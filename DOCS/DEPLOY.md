# VPS releases with PHP Deployer

The `production` target in [`config/deploy.yaml`](../config/deploy.yaml) is `ubuntu@151.80.145.236:/var/www/m-mash.net`. The recipe in [`deploy.php`](../deploy.php) fetches `master` from `git@github.com:vdonchev/m-mash.git`, installs locked production dependencies, checks the release and switches the `current` symlink. It retains five releases. It does not provision the VPS or change web-server settings.

## Before the first release

1. Configure SSH access to `ubuntu@151.80.145.236` and verify the SSH host key through a trusted channel. `ubuntu` needs write access to `/var/www/m-mash.net`; the VPS needs GitHub's verified host key and read access to the repo. Prefer a repo-specific read-only deploy key for unattended releases. For an authorized one-off release from a trusted client and VPS, use the forwarded agent option below. Set `MMASH_DEPLOY_USER` only if a different SSH account is needed.
2. Install Git, PHP 8.5 (CLI and web worker, with Composer's required extensions), Composer and `unzip` on the VPS. The remote `php` and `composer` commands must be on the deploy account's `PATH`.
3. Keep releases writable by `ubuntu`, not by Apache's `www-data` account. Confirm the PHP worker also runs as `www-data` if Apache uses a separate PHP-FPM pool. Prepare `/var/www/m-mash.net/shared/var` as a private directory owned by the PHP worker (mode `0700`), unless setting `MMASH_CONTACT_STATE_DIR` to another private location. Deployer preserves that state and the shared config files across releases. It creates an empty `shared/config/.env` readable only by the deploy user if missing. Before adding the [SES settings](CONTACT.md#vps-and-ses), set the group and modes (shown for `www-data`):

   ```sh
   cd /var/www/m-mash.net/shared/config
   chgrp www-data . .env
   chmod 0750 .
   chmod 0640 .env
   ```

   Edit `.env` as `ubuntu`. Keep `.env.local` empty in production unless you deliberately need an override.
4. Plan the web-root switch to **`/var/www/m-mash.net/current/public`** after the first release exists. If the VPS already serves the old site, preserve its files and [legacy paths](PROJECT.md#legacy-m-mashnet-dependencies) before cutting over. Don't point the web server at the deploy root or replace an existing `current` directory without checking what's there.

## Deploy or roll back

From the local checkout:

```sh
composer install
vendor/bin/dep tree deploy
```

The task tree is local-only. When the intended commit is on GitHub and a release is authorized, run:

```sh
vendor/bin/dep deploy production
```

If using your local SSH agent instead of a deploy key, forward it for this deploy only and disable SSH connection reuse:

```sh
vendor/bin/dep deploy production -o forward_agent=true -o ssh_multiplexing=false
```

After release, verify the public URL, locale navigation and PHP routing. Test live SES delivery only with approval. To revert the `current` symlink to the previous release:

```sh
vendor/bin/dep rollback production
```

Rollback does not revert shared settings or state. Releases made before `config/.env` became a shared file do not use the new SES credentials.
