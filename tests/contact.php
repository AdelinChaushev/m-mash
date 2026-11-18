<?php

declare(strict_types=1);

use Aws\CommandInterface;
use Aws\Exception\AwsException;
use Aws\MockHandler;
use Aws\Result;
use Aws\SesV2\SesV2Client;
use MMash\Contact\ContactConfig;
use MMash\Contact\ContactMail;
use MMash\Contact\Inquiry;
use MMash\Contact\RateLimit;
use Psr\Http\Message\RequestInterface;

require dirname(__DIR__) . '/vendor/autoload.php';

function same(mixed $expected, mixed $actual, string $message): void
{
    if ($expected !== $actual) {
        throw new RuntimeException($message . ': ' . var_export($actual, true));
    }
}

$configRoot = sys_get_temp_dir() . '/mmash-config-' . bin2hex(random_bytes(12));
mkdir($configRoot . '/config', 0700, true);
$previousEnv = [];
foreach (['MMASH_CONTACT_TRANSPORT', 'MMASH_CONTACT_FROM', 'AWS_REGION', 'MMASH_MAILPIT_HOST', 'MMASH_MAILPIT_PORT', 'MMASH_CONTACT_STATE_DIR'] as $key) {
    $previousEnv[$key] = getenv($key);
    putenv($key);
}
try {
    $configDir = $configRoot . '/config';
    copy(dirname(__DIR__) . '/config/contact.yaml', $configDir . '/contact.yaml');
    copy(dirname(__DIR__) . '/config/.env', $configDir . '/.env');
    $config = ContactConfig::load($configRoot);
    same('ses', $config->transport, 'Default transport is SES');
    same('127.0.0.1', $config->mailpitHost, 'Default Mailpit host');
    same('1025', $config->mailpitPort, 'YAML port number is normalized');
    same($configRoot . '/var', $config->stateDir, 'Default state is under the checkout');

    file_put_contents($configDir . '/.env', "AWS_REGION=eu-central-1\nMMASH_MAILPIT_HOST=base-env.test\n");
    file_put_contents($configDir . '/contact.local.yaml', "MMASH_MAILPIT_HOST: local-yaml.test\n");
    file_put_contents($configDir . '/.env.local', '');
    $config = ContactConfig::load($configRoot);
    same('eu-central-1', $config->region, 'Tracked dotenv supplies a default');
    same('local-yaml.test', $config->mailpitHost, 'Local YAML overrides tracked defaults');

    file_put_contents($configDir . '/.env.local', "MMASH_CONTACT_TRANSPORT=mailpit\nMMASH_MAILPIT_HOST='lamp_mailpit'\nMMASH_CONTACT_STATE_DIR=/tmp/private-state\nAWS_ACCESS_KEY_ID=fake-unused\n");
    $config = ContactConfig::load($configRoot);
    same('lamp_mailpit', $config->mailpitHost, 'Local dotenv takes precedence over local YAML');
    same('website@example.test', $config->from, 'Mailpit can run without an SES sender');
    same('/tmp/private-state', $config->stateDir, 'Absolute state directory remains unchanged');
    same(false, isset($_ENV['AWS_ACCESS_KEY_ID']) && $_ENV['AWS_ACCESS_KEY_ID'] === 'fake-unused', 'Contact config is not exported to the environment');

    putenv('MMASH_CONTACT_TRANSPORT=ses');
    putenv('MMASH_MAILPIT_HOST=server-env.test');
    $config = ContactConfig::load($configRoot);
    same('ses', $config->transport, 'Server environment has highest precedence');
    same('server-env.test', $config->mailpitHost, 'Server environment overrides local host');

    file_put_contents($configDir . '/.env.local', 'MMASH_MAILPIT_HOST=$(echo unsafe)');
    try {
        ContactConfig::load($configRoot);
        throw new LogicException('Dotenv command substitution should have been refused');
    } catch (RuntimeException $error) {
        same('Shell command substitution is not supported in contact configuration', $error->getMessage(), 'Configuration never executes shell commands');
    }
} finally {
    foreach ($previousEnv as $key => $value) {
        putenv($value === false ? $key : "$key=$value");
    }
    foreach (['contact.yaml', 'contact.local.yaml', '.env', '.env.local'] as $file) {
        if (is_file($configRoot . '/config/' . $file)) {
            unlink($configRoot . '/config/' . $file);
        }
    }
    rmdir($configRoot . '/config');
    rmdir($configRoot);
}

[$values, $invalid] = Inquiry::read([
    'first-name' => ' Иван ',
    'last-name' => 'Иванов',
    'company' => 'Muster GmbH',
    'email' => 'visitor@example.test',
    'description' => "Проба\r\nSecond line",
]);
same([], $invalid, 'Valid inquiry without a phone number');
same('', $values['phone'], 'Phone is optional');
same('Иван', $values['first-name'], 'Name trimmed');
$message = Inquiry::message($values, 'bg');
same("Language: bg\nName: Иван Иванов\nCompany: Muster GmbH\nEmail: visitor@example.test\n\nПроба\nSecond line",
    $message, 'Message and newline encoding');

[, $invalid] = Inquiry::read(array_replace($values, [
    'first-name' => ['Unexpected array'],
    'company' => "Company\nCc: test@example.test",
    'phone' => "\0",
    'email' => "visitor@example.test\r\nBcc: test@example.test",
    'description' => str_repeat('я', 4001),
]));
same(['first-name', 'company', 'phone', 'email', 'description'], $invalid, 'Invalid types, controls and length');
[, $invalid] = Inquiry::read(['first-name' => "\xFF"]);
same(['first-name', 'last-name', 'company', 'email', 'description'], $invalid, 'Malformed UTF-8 and missing fields');

$dir = sys_get_temp_dir() . '/mmash-contact-' . bin2hex(random_bytes(12));
mkdir($dir, 0700);
try {
    for ($i = 1; $i <= 5; ++$i) {
        same(0, RateLimit::reserve($dir, '2001:db8:abcd::' . $i), 'IPv6 budget permits five attempts');
    }
    same(true, RateLimit::reserve($dir, '2001:db8:abcd::6') > 0, 'Same IPv6 /64 is limited');
    for ($i = 1; $i <= 55; ++$i) {
        same(0, RateLimit::reserve($dir, '192.0.2.' . $i), 'Global budget permits sixty attempts');
    }
    same(true, RateLimit::reserve($dir, '192.0.2.56') > 0, 'Global budget is enforced');
    file_put_contents($dir . '/contact.json', '{"expires":0}');
    same(0, RateLimit::reserve($dir, '2001:db8:abcd::6'), 'An expired budget resets');
} finally {
    foreach (glob($dir . '/contact.*') as $file) {
        unlink($file);
    }
    rmdir($dir);
}

$mock = new MockHandler([
    static function (CommandInterface $command, RequestInterface $request) use ($message): Result {
        same('SendEmail', $command->getName(), 'SES v2 operation');
        same('POST', $request->getMethod(), 'SES v2 request method');
        same('/v2/email/outbound-emails', $request->getUri()->getPath(), 'SES v2 request path');
        $payload = json_decode((string) $request->getBody(), true, flags: JSON_THROW_ON_ERROR);
        same('website@example.test', $payload['FromEmailAddress'], 'Verified sender is separate from reply address');
        same(['ToAddresses' => ['info@m-mash.net']], $payload['Destination'], 'Fixed recipient');
        same(['visitor@example.test'], $payload['ReplyToAddresses'], 'Visitor email is reply-to');
        same(['Data' => $message, 'Charset' => 'UTF-8'], $payload['Content']['Simple']['Body']['Text'], 'UTF-8 body');
        return new Result(['MessageId' => 'fake-message-id']);
    },
    new AwsException('Simulated refusal', new \Aws\Command('SendEmail'), ['code' => 'MessageRejected']),
]);
$ses = new SesV2Client([
    'version' => '2019-09-27',
    'region' => 'eu-central-1',
    'credentials' => ['key' => 'fake-key', 'secret' => 'fake-secret'],
    'handler' => $mock,
    'retries' => 0,
]);
ContactMail::sendWithSes($ses, 'website@example.test', 'visitor@example.test', $message);
try {
    ContactMail::sendWithSes($ses, 'website@example.test', 'visitor@example.test', $message);
    throw new RuntimeException('SES rejection should not be swallowed');
} catch (AwsException $error) {
    same('MessageRejected', $error->getAwsErrorCode(), 'SES failure reaches the endpoint');
}

echo "Contact configuration, validation, rate limits and mocked SES checks passed.\n";
