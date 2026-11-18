# VPS releases with PHP Deployer

The `production` target in [`config/deploy.yaml`](../config/deploy.yaml) is `151.80.145.236:/var/www/m-mash.net`. The recipe in [`deploy.php`](../deploy.php) fetches `main` from the GitHub repository, installs locked production dependencies, checks the release and switches the `current` symlink. It retains five releases. It does not provision the VPS or change web-server settings.

## Before the first release

1. Use a non-root SSH deploy account with write access to `/var/www/m-mash.net`. Configure your SSH account/key for `151.80.145.236`, or pass the username with `MMASH_DEPLOY_USER`. Verify the SSH host key through a trusted channel. The VPS itself needs read access to `git@github.com:AdelinChaushev/m-mash.git` (e.g. a read-only GitHub deploy key and the verified GitHub host key); the recipe does not forward your SSH agent.
2. Install Git, PHP 8.5 (CLI and web worker, with Composer's required extensions), Composer and `unzip` on the VPS. The remote `php` and `composer` commands must be on the deploy account's `PATH`.
3. Prepare `/var/www/m-mash.net/shared/var` as a private writable directory owned by the PHP worker (mode `0700`), unless setting `MMASH_CONTACT_STATE_DIR` to another private location. Deployer preserves that state and `shared/config/.env.local` across releases and rollbacks. The deploy user must be able to read the override for the release check; grant the PHP worker read-only access if you use it. Keep AWS credentials outside the release tree. See [the SES checklist](CONTACT.md#vps-and-ses).
4. Plan the web-root switch to **`/var/www/m-mash.net/current/public`** after the first release exists. If the VPS already serves the old site, preserve its files and [legacy paths](PROJECT.md#legacy-m-mashnet-dependencies) before cutting over. Don't point the web server at the deploy root or replace an existing `current` directory without checking what's there.

## Deploy or roll back

From the local checkout:

```sh
composer install
vendor/bin/dep tree deploy
```

The task tree is local-only. When the intended commit is on GitHub and a release is authorized, run the following with your real SSH username (or omit `MMASH_DEPLOY_USER` if SSH already selects the correct user):

```sh
MMASH_DEPLOY_USER=your-ssh-user vendor/bin/dep deploy production
```

After release, verify the public URL, locale navigation and PHP routing. Test live SES delivery only with approval. To revert the `current` symlink to the previous release:

```sh
MMASH_DEPLOY_USER=your-ssh-user vendor/bin/dep rollback production
```

Rollback does not revert shared settings or state.
