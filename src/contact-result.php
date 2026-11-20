<?php

use MMash\Contact\Inquiry;

$e = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>
<!doctype html>
<html lang="<?= $e($locale) ?>">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= $e($copy['title']) ?></title>
  <link rel="stylesheet" href="assets/css/tokens.css?v=2026-11-20">
  <link rel="stylesheet" href="assets/css/site.css?v=2026-11-20">
</head>
<body>
  <main class="section">
    <div class="container">
      <div class="panel form-card">
        <h1 class="h2"><?= $e($copy['title']) ?></h1>
        <p class="form-status" data-state="<?= $result === 'sent' ? 'sent' : 'error' ?>"><?= $e($copy[$result]) ?></p>
        <?php if ($status !== 200): ?>
          <p><a href="mailto:info@m-mash.net">info@m-mash.net</a></p>
        <?php endif; ?>
        <?php if ($status !== 200 && $values !== []): ?>
          <form class="form-grid" action="contact-submit.php" method="post">
            <input type="hidden" name="locale" value="<?= $e($locale) ?>">
            <div hidden><label>Website <input name="website" type="text" autocomplete="off" tabindex="-1"></label></div>
            <?php foreach (array_keys(Inquiry::FIELDS) as $index => $name): ?>
              <?php
              [$type, $autocomplete, $max, $required] = Inquiry::FIELDS[$name];
              $attributes = ' class="input" id="f-' . $name . '" name="' . $name . '" maxlength="' . $max . '"'
                  . ($required ? ' required' : '') . (in_array($name, $invalid, true) ? ' aria-invalid="true"' : '');
              ?>
              <div class="field<?= in_array($name, ['company', 'description'], true) ? ' field--full' : '' ?>">
                <label class="field__label" for="f-<?= $name ?>"><?= $e($copy['fields'][$index]) ?></label>
                <?php if ($type === 'textarea'): ?>
                  <textarea<?= $attributes ?> rows="6"><?= $e($values[$name]) ?></textarea>
                <?php else: ?>
                  <input<?= $attributes ?> type="<?= $type ?>" autocomplete="<?= $autocomplete ?>" value="<?= $e($values[$name]) ?>">
                <?php endif; ?>
              </div>
            <?php endforeach; ?>
            <div class="field--full"><button class="btn btn--primary btn--lg" type="submit"><?= $e($copy['send']) ?></button></div>
          </form>
        <?php endif; ?>
        <p><a href="<?= $e($copy['page']) ?>"><?= $e($copy['back']) ?></a></p>
      </div>
    </div>
  </main>
</body>
</html>
