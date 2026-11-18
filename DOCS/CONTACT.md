# Contact form

All four contact pages POST to `public/contact-submit.php`. JavaScript displays a localized result inline; without JavaScript, the endpoint renders a localized result page with a prefilled retry form when possible. Phone is optional. The form accepts text only, and the public fallback address remains `info@m-mash.net`.

The endpoint checks allowed request methods, payload size, expected form encoding, field types, lengths and the reply address. A hidden honeypot and a private file-based limit allow 5 attempts per IPv4 address or IPv6 /64 and 60 attempts total per 15-minute window. Behind a reverse proxy, configure the web server to set `REMOTE_ADDR` from a trusted proxy only; the application does not trust forwarded IP headers. The app does not save inquiry bodies or log them. Rate-limit files store counters and keyed address fingerprints with a per-window salt; an expired window is replaced at the next valid attempt.

## Configuration

Tracked defaults live in `config/contact.yaml` and `config/.env`. From highest to lowest priority: the PHP worker's environment, `config/.env.local`, `config/contact.local.yaml`, `config/.env`, then `config/contact.yaml`. Both `.local` files are ignored by Git and stay outside `public/`. Use literal values in the dotenv files; the loader reads the supported contact settings without exporting variables to the process environment. The AWS SDK still obtains credentials separately.

## Local testing with Mailpit

Run `composer install` with development dependencies. To use the existing `m-mash.test` vhost, add to `config/.env.local`:

```dotenv
MMASH_CONTACT_TRANSPORT=mailpit
MMASH_MAILPIT_HOST=lamp_mailpit
MMASH_MAILPIT_PORT=1025
```

The vhost must already serve `public/`. No Docker or Apache settings are needed for Mailpit. Create the ignored `var/` directory if it is missing and make it writable by the PHP worker only. For the current Docker LAMP checkout, if `var/` doesn't already exist, run:

```sh
docker exec --user www-data docker-lamp_web-1 mkdir -p -m 700 /var/www/m-mash.test/var
```

Submit dummy data at <https://m-mash.test/kontakti.html> and check the [Mailpit inbox](http://localhost:8025/) and the `Reply-To` header. Mailpit uses the development-only PHPMailer dependency and defaults to `website@example.test` as sender. Ensure Mailpit forwarding and relay are disabled.

If you run `php -S` from WSL instead of using the vhost, override the Mailpit host with `MMASH_MAILPIT_HOST=127.0.0.1` on the command line and, if the Docker worker owns `var/`, use a separate private `MMASH_CONTACT_STATE_DIR` writable by your WSL user.

Run `composer test` for configuration precedence, validation, rate-limit and mocked SES request checks. These tests don't contact AWS or Mailpit.

## VPS and SES

1. Follow the [Deployer setup](DEPLOY.md). The HTTPS document root is `/var/www/m-mash.net/current/public`. Configure PHP 8.5 to execute `.php` rather than serve its source. Disable directory listings and configure a `64 KiB` body limit on the submit route. Keep PHP `display_errors` off and don't log request bodies. Make sure files above `public/` can't be reached over HTTP.
2. Deployer installs production dependencies and checks platform requirements. Give the PHP worker write access to the shared state directory, or set a separate private directory owned by the worker and mode `0700`. Don't give the worker write access to configuration, source code or dependencies.
3. After gaining DNS control, verify `m-mash.net` and DKIM in your chosen SES region. Request production access in that same region; while in the sandbox, the recipient must also be verified. Confirm that `info@m-mash.net` receives mail with the existing inbox provider; SES is only for outgoing mail here. Preserve the required MX records at domain cutover.
4. Set non-secret contact options in the PHP worker environment or VPS `shared/config/.env.local`. Give the worker read access only if using that file. Configure AWS credentials separately through a provider supported by the SDK; for PHP-FPM, make sure the pool passes any required environment variables even if `clear_env` is on. Keep AWS secrets outside the checkout and web root.

   | Setting | Production value |
   | --- | --- |
   | `MMASH_CONTACT_TRANSPORT` | `ses` (default) |
   | `AWS_REGION` | Region of the verified SES identity and approved sending account |
   | `MMASH_CONTACT_FROM` | Fixed sender on the verified domain, e.g. `website@m-mash.net` |
   | `MMASH_CONTACT_STATE_DIR` | Writable private directory; defaults to `<checkout>/var` |
   | AWS credentials | Prefer a role when available, otherwise a dedicated credential set supplied through the SDK's default credential chain. For a non-AWS VPS without an instance role, set `AWS_EC2_METADATA_DISABLED=true`. |

   Grant only `ses:SendEmail` for the verified SES identity. Restrict permissions further with `ses:FromAddress` set to the configured sender and `ses:Recipients` limited to `info@m-mash.net`. No SES SMTP credentials are used in production; the SDK signs the SES v2 API request over HTTPS.
5. With approval, submit a dummy inquiry to verify real inbox delivery and that Reply targets the visitor. The form confirms SES acceptance, not delivery. Monitor SES bounces and complaints after launch. Confirm the approved privacy notice covers inquiry processing through SES as well as the other site services.
