<?php

declare(strict_types=1);

namespace MMash\Contact;

use Aws\SesV2\SesV2Client;
use PHPMailer\PHPMailer\PHPMailer;
use RuntimeException;

final class ContactMail
{
    public const RECIPIENT = 'info@m-mash.net';
    private const SUBJECT = 'M-MASH: Website inquiry';

    public static function send(ContactConfig $config, string $replyTo, string $message): void
    {
        if (!filter_var($config->from, FILTER_VALIDATE_EMAIL)) {
            throw new RuntimeException('Invalid contact sender configuration');
        }

        if ($config->transport === 'mailpit') {
            if (!class_exists(PHPMailer::class)) {
                throw new RuntimeException('Mailpit mode requires Composer dev dependencies');
            }
            $port = filter_var($config->mailpitPort, FILTER_VALIDATE_INT, [
                'options' => ['min_range' => 1, 'max_range' => 65535],
            ]);
            if (!preg_match('/\A[A-Za-z0-9_.-]+\z/', $config->mailpitHost) || $port === false) {
                throw new RuntimeException('Invalid Mailpit configuration');
            }
            // Docker Compose service names may contain underscores, which PHPMailer rejects.
            $host = str_contains($config->mailpitHost, '_') ? gethostbyname($config->mailpitHost) : $config->mailpitHost;
            if (!PHPMailer::isValidHost($host)) {
                throw new RuntimeException('Invalid or unresolved Mailpit host');
            }
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = $host;
            $mail->Port = $port;
            $mail->SMTPAutoTLS = false;
            $mail->Timeout = 5;
            $mail->CharSet = PHPMailer::CHARSET_UTF8;
            $mail->Encoding = PHPMailer::ENCODING_QUOTED_PRINTABLE;
            $mail->setFrom($config->from);
            $mail->addAddress(self::RECIPIENT);
            $mail->addReplyTo($replyTo);
            $mail->Subject = self::SUBJECT;
            $mail->Body = $message;
            $mail->send();
            return;
        }

        if ($config->region === '') {
            throw new RuntimeException('Invalid SES configuration');
        }

        $ses = new SesV2Client([
            'version' => '2019-09-27',
            'region' => $config->region,
            'retries' => 0,
            'http' => ['connect_timeout' => 3, 'timeout' => 8],
        ]);
        self::sendWithSes($ses, $config->from, $replyTo, $message);
    }

    public static function sendWithSes(SesV2Client $ses, string $from, string $replyTo, string $message): void
    {
        $ses->sendEmail([
            'FromEmailAddress' => $from,
            'Destination' => ['ToAddresses' => [self::RECIPIENT]],
            'ReplyToAddresses' => [$replyTo],
            'Content' => ['Simple' => [
                'Subject' => ['Data' => self::SUBJECT, 'Charset' => 'UTF-8'],
                'Body' => ['Text' => ['Data' => $message, 'Charset' => 'UTF-8']],
            ]],
        ]);
    }
}
