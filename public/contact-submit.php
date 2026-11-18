<?php

declare(strict_types=1);

use MMash\Contact\ContactConfig;
use MMash\Contact\ContactMail;
use MMash\Contact\Inquiry;
use MMash\Contact\RateLimit;

$root = dirname(__DIR__);
$translations = require $root . '/src/contact-copy.php';
$requestedLocale = $_POST['locale'] ?? null;
$locale = is_string($requestedLocale) && isset($translations[$requestedLocale]) ? $requestedLocale : 'bg';
$copy = $translations[$locale];
$json = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');
$values = $invalid = [];
$status = 400;
$result = 'request';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    $status = 405;
} elseif (isset($_SERVER['HTTP_SEC_FETCH_SITE'])
    && !in_array($_SERVER['HTTP_SEC_FETCH_SITE'], ['same-origin', 'none'], true)) {
    $status = 403;
} elseif ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 65536) {
    $status = 413;
} elseif (strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '', 2)[0])) !== 'application/x-www-form-urlencoded') {
    $status = 415;
} elseif (($_POST['website'] ?? '') !== '') {
    $status = 400;
} else {
    try {
        $autoload = $root . '/vendor/autoload.php';
        if (!is_file($autoload)) {
            throw new RuntimeException('Composer dependencies are missing');
        }
        require $autoload;

        [$values, $invalid] = Inquiry::read($_POST);
        if ($invalid !== []) {
            $status = 422;
            $result = 'invalid';
        } else {
            $config = ContactConfig::load($root);
            $retryAfter = RateLimit::reserve($config->stateDir, $_SERVER['REMOTE_ADDR'] ?? '');
            if ($retryAfter > 0) {
                header('Retry-After: ' . $retryAfter);
                $status = 429;
                $result = 'limited';
            } else {
                ContactMail::send($config, $values['email'], Inquiry::message($values, $locale));
                $status = 200;
                $result = 'sent';
            }
        }
    } catch (Throwable $error) {
        // Transport exceptions may embed inquiry data; log only the class and AWS error code.
        $awsCode = $error instanceof \Aws\Exception\AwsException ? $error->getAwsErrorCode() : null;
        error_log('M-MASH contact: ' . $error::class
            . (is_string($awsCode) && preg_match('/\A[A-Za-z0-9_.-]{1,100}\z/', $awsCode) ? ' (' . $awsCode . ')' : ''));
        $status = 503;
        $result = 'unavailable';
    }
}

http_response_code($status);
header('Cache-Control: no-store');
header('Vary: Accept');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow');

if ($json) {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(
        ['result' => $result, 'message' => $copy[$result], 'invalid' => $invalid],
        JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE,
    );
    return;
}

header('Content-Type: text/html; charset=UTF-8');
header("Content-Security-Policy: default-src 'none'; style-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");
require $root . '/src/contact-result.php';
