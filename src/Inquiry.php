<?php

declare(strict_types=1);

namespace MMash\Contact;

final class Inquiry
{
    public const FIELDS = [
        'first-name' => ['text', 'given-name', 100, true],
        'last-name' => ['text', 'family-name', 100, true],
        'company' => ['text', 'organization', 160, true],
        'phone' => ['tel', 'tel', 50, false],
        'email' => ['email', 'email', 254, true],
        'description' => ['textarea', '', 4000, true],
    ];

    public static function read(array $input): array
    {
        $values = $invalid = [];
        foreach (self::FIELDS as $name => [$type, , $max, $required]) {
            $raw = $input[$name] ?? '';
            if (!is_string($raw) || !mb_check_encoding($raw, 'UTF-8')) {
                $values[$name] = '';
                $invalid[] = $name;
                continue;
            }

            $value = trim(str_replace(["\r\n", "\r"], "\n", $raw), " \t\n");
            $controls = $type === 'textarea' ? '/[\x00-\x08\x0B-\x1F\x7F]/' : '/[\x00-\x1F\x7F]/';
            $values[$name] = $value;
            if (($required && $value === '') || mb_strlen($value, 'UTF-8') > $max
                || preg_match($controls, $value)
                || ($type === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL))) {
                $invalid[] = $name;
            }
        }

        return [$values, $invalid];
    }

    public static function message(array $values, string $locale): string
    {
        return "Language: {$locale}\n"
            . "Name: {$values['first-name']} {$values['last-name']}\n"
            . "Company: {$values['company']}\n"
            . ($values['phone'] === '' ? '' : "Phone: {$values['phone']}\n")
            . "Email: {$values['email']}\n\n"
            . $values['description'];
    }
}
