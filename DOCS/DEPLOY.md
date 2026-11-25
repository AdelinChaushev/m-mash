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

## Apache routing

Use `mod_rewrite` and `mod_dir` on the public virtual host. The release-local [`public/.htaccess`](../public/.htaccess) contains the route allowlist and redirects so they roll back with the site. Merge this into the vhost serving the site, alongside its existing TLS and PHP-FPM configuration:

```apache
DocumentRoot /var/www/m-mash.net/current/public

<Directory /var/www/m-mash.net/current/public>
    Options +FollowSymLinks -Indexes -MultiViews
    AllowOverride FileInfo Indexes Options=Indexes,MultiViews
    DirectoryIndex index.html
    Require all granted
</Directory>
```

Run `apache2ctl configtest` before reloading, then smoke-test the vhost before switching DNS. Check `301` responses, query string preservation, `/sitemap.xml`, and PHP execution on `/contact-submit.php`. The rewrite rules do not handle the PHP endpoint or legacy `files/` and `images/` paths; keep serving the legacy documents and images separately.

## Automatic releases from GitHub

[Test and deploy](../.github/workflows/production.yml) runs the contact tests and JavaScript syntax check for pull requests to `master` and pushes to `master`. Only a successful push run in `vdonchev/m-mash` can deploy. The workflow uses the existing Deployer recipe for the tested commit, not whatever commit happens to be on `master` when the VPS fetches. It skips superseded commits and does not create another release if `current/REVISION` already matches. It verifies the deployed revision and checks the public home, capabilities, German contact and PHP endpoint with GET requests only.

Before pushing the workflow to `master`, verify the `production` GitHub environment exists, allows only `master`, and has both environment secrets:

- `VPS_SSH_PRIVATE_KEY`: the Actions-to-VPS private key. Its public key is authorized for the `ubuntu` deploy account.
- `VPS_KNOWN_HOSTS`: the verified VPS host-key line for `151.80.145.236`.

The VPS separately uses `~/.ssh/m-mash-github-ro`, whose public key is a read-only deploy key in `vdonchev/m-mash`. No agent forwarding is used by Actions. Protect `master` and review changes to the workflow and deployment recipe before merging. The first push that adds the workflow to `master` can deploy. Do not also deploy locally for a push handled by Actions.

## Local deploy or rollback

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

After a local release, verify the public URL, locale navigation and PHP routing. Test live SES delivery only with approval. If you need to roll back, first make sure no deploy is running or queued in Actions. To revert the `current` symlink to the previous release:

```sh
vendor/bin/dep rollback production
```

Rollback does not revert shared settings or state. Releases made before `config/.env` became a shared file do not use the new SES credentials.
