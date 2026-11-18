<?php

declare(strict_types=1);

namespace MMash\Contact;

use RuntimeException;

final class RateLimit
{
    private const WINDOW = 900;
    private const PER_ADDRESS = 5;
    private const TOTAL = 60;

    /** Reserve an attempt; return seconds until retry (zero if accepted). */
    public static function reserve(string $directory, string $address): int
    {
        $lock = @fopen($directory . '/contact.lock', 'c');
        if ($lock === false) {
            throw new RuntimeException('Contact rate-limit directory is not writable');
        }

        try {
            if (!flock($lock, LOCK_EX)) {
                throw new RuntimeException('Could not lock contact rate limiter');
            }

            $path = $directory . '/contact.json';
            $now = time();
            $state = is_file($path) ? @file_get_contents($path) : '{"expires":0}';
            if ($state === false) {
                throw new RuntimeException('Could not read contact rate limiter');
            }
            $window = json_decode($state, true, 8, JSON_THROW_ON_ERROR);
            if (!is_int($window['expires'] ?? null)) {
                throw new RuntimeException('Invalid contact rate-limit state');
            }
            if ($window['expires'] <= $now) {
                $window = ['expires' => $now + self::WINDOW, 'total' => 0, 'clients' => [], 'salt' => bin2hex(random_bytes(32))];
            } elseif (!is_int($window['total'] ?? null) || !is_array($window['clients'] ?? null)
                || !is_string($window['salt'] ?? null)) {
                throw new RuntimeException('Invalid contact rate-limit state');
            }

            // IPv6 addresses within a /64 share a budget.
            $packed = @inet_pton($address);
            $key = hash_hmac('sha256', $packed === false ? 'unknown' : substr($packed, 0, 8), $window['salt']);
            $attempts = $window['clients'][$key] ?? 0;
            if ($attempts >= self::PER_ADDRESS || $window['total'] >= self::TOTAL) {
                return $window['expires'] - $now;
            }
            $window['clients'][$key] = $attempts + 1;
            ++$window['total'];

            $data = json_encode($window, JSON_THROW_ON_ERROR);
            $pending = $directory . '/contact.pending';
            if (@file_put_contents($pending, $data) !== strlen($data) || !@rename($pending, $path)) {
                throw new RuntimeException('Could not save contact rate limiter');
            }
            return 0;
        } finally {
            fclose($lock);
        }
    }
}
