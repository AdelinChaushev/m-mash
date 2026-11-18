<?php

declare(strict_types=1);

namespace Deployer;

require 'recipe/common.php';

import(__DIR__ . '/config/deploy.yaml');

$user = getenv('MMASH_DEPLOY_USER');
if ($user !== false && $user !== '') {
    host('production')->setRemoteUser($user);
}

set('repository', 'git@github.com:vdonchev/m-mash.git');
set('git_ssh_command', 'ssh -o BatchMode=yes -o StrictHostKeyChecking=yes');
set('keep_releases', 5);
set('shared_files', ['config/.env.local']);
set('shared_dirs', ['var']);
set('bin/composer', static fn (): string => '{{bin/php}} ' . escapeshellarg(which('composer')));

desc('Checks production dependencies and required release files');
task('deploy:check_release', static function (): void {
    cd('{{release_path}}');
    run('test -f public/index.html && test -f public/contact-submit.php && test -r config/contact.yaml && test -r config/.env');
    run('{{bin/composer}} check-platform-reqs --no-dev');
    run('{{bin/php}} -l public/contact-submit.php');
    run('{{bin/php}} -r ' . escapeshellarg('require "vendor/autoload.php"; MMash\Contact\ContactConfig::load(getcwd());'));
});

task('deploy', [
    'deploy:prepare',
    'deploy:vendors',
    'deploy:check_release',
    'deploy:publish',
]);

after('deploy:failed', 'deploy:unlock');
