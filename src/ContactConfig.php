<?php

declare(strict_types=1);

namespace MMash\Contact;

use RuntimeException;
use Symfony\Component\Dotenv\Dotenv;
use Symfony\Component\Yaml\Yaml;

final readonly class ContactConfig
{
    private const KEYS = [
        'MMASH_CONTACT_TRANSPORT', 'MMASH_CONTACT_FROM', 'AWS_REGION',
        'MMASH_MAILPIT_HOST', 'MMASH_MAILPIT_PORT', 'MMASH_CONTACT_STATE_DIR',
    ];

    private function __construct(
        public string $transport,
        public string $from,
        public string $region,
        public string $mailpitHost,
        public string $mailpitPort,
        public string $stateDir,
    ) {
    }

    public static function load(string $root): self
    {
        $directory = $root . '/config';
        $settings = array_replace(
            self::readYaml($directory . '/contact.yaml'),
            self::readDotenv($directory . '/.env'),
        );
        $localYaml = $directory . '/contact.local.yaml';
        if (is_file($localYaml)) {
            $settings = array_replace($settings, self::readYaml($localYaml));
        }

        $localEnv = $directory . '/.env.local';
        if (is_file($localEnv)) {
            $settings = array_replace($settings, self::readDotenv($localEnv));
        }

        $resolved = [];
        foreach (self::KEYS as $key) {
            $environment = getenv($key);
            $value = $environment !== false ? $environment : ($settings[$key] ?? '');
            if (!is_string($value) && !is_int($value)) {
                throw new RuntimeException('Invalid contact configuration value');
            }
            $resolved[$key] = (string) $value;
        }

        $transport = $resolved['MMASH_CONTACT_TRANSPORT'];
        if (!in_array($transport, ['ses', 'mailpit'], true)) {
            throw new RuntimeException('Invalid contact transport');
        }
        $stateDir = $resolved['MMASH_CONTACT_STATE_DIR'];
        if ($stateDir === '') {
            throw new RuntimeException('Contact state directory is not configured');
        }
        $from = $resolved['MMASH_CONTACT_FROM'];

        return new self(
            $transport,
            $from === '' && $transport === 'mailpit' ? 'website@example.test' : $from,
            $resolved['AWS_REGION'],
            $resolved['MMASH_MAILPIT_HOST'],
            $resolved['MMASH_MAILPIT_PORT'],
            str_starts_with($stateDir, '/') ? $stateDir : $root . '/' . $stateDir,
        );
    }

    private static function readYaml(string $path): array
    {
        $settings = Yaml::parseFile($path, Yaml::PARSE_EXCEPTION_ON_INVALID_TYPE) ?? [];
        if (!is_array($settings) || array_diff_key($settings, array_fill_keys(self::KEYS, true)) !== []) {
            throw new RuntimeException('Invalid contact YAML configuration keys');
        }

        return $settings;
    }

    private static function readDotenv(string $path): array
    {
        $contents = @file_get_contents($path);
        if ($contents === false) {
            throw new RuntimeException('Could not read contact dotenv file');
        }
        if (str_contains($contents, '$(')) {
            throw new RuntimeException('Shell command substitution is not supported in contact configuration');
        }

        return (new Dotenv())->parse($contents, $path);
    }
}
