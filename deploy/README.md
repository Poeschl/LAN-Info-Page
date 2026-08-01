# How to deploy LAN Info Page

LAN Info Page can be deployed using a pre-built Podman/Docker container using the provided `docker-compose.yaml`.

Before starting the server, ensure that you adjusted the environment variables and the `links.yaml` config to your needs.
Authentication is only possible via OIDC. Without it configured, the page is still shown, but no admin links will
ever be visible and nobody can log in.

## Requirements

* A running container runtime (Podman or Docker) with compose plugin or similar.
* A PostgreSQL database (used to store LAN party participant stats reported by the LAN Launcher client).

## Links configuration

Copy `config/links.yaml` from the repository to a `links.yaml` file next to your `docker-compose.yaml` and adjust it
to your needs, then mount it as shown in the provided compose file. The file is read on every request, so changes
take effect without restarting the container.

To use images instead of (or in addition to) icons, create an `images` folder next to `links.yaml`, place your image
files there (png, jpg, jpeg, gif, webp, svg, avif or ico), and reference the filename via the `image` field on a link
entry. Mount that folder as shown in the provided compose file; images are then served at `/api/links/images/<filename>`.

## Participant stats collection

`GET /api/stats/report` accepts the same query parameters as the original eti-lan/LANPage `stats.php` script
(`macaddr1`, `macaddr2`, `board_manufacturer`, `baseboard`, `system_product_name`, `bios_release`, `cpu`, `gpu`,
`windows_edition`, `player_name`, `current_game`, `hostname`) and is meant to be called by a LAN Launcher client on
each participant's machine. Point the client's stats-reporting URL at `https://<your-deployment>/api/stats/report`.

**This endpoint is intentionally unauthenticated**, exactly like the original `stats.php`. It is only safe to expose
it on a trusted LAN party network - do not expose it on the public internet without adding a reverse-proxy level
restriction (e.g. IP allowlisting), since anyone able to reach it can submit arbitrary stats reports.

The collected data is shown publicly (no login required) in a "Participants" table below the link list, with a
colored dot indicating online/offline status.

## Environment Variables

* `DATABASE_HOST`: The hostname or IP address of the PostgreSQL database.
* `DATABASE_PORT`: The port number for the PostgreSQL database.
* `DATABASE_USER`: The username for the PostgreSQL database.
* `DATABASE_PASSWORD`: The password for the PostgreSQL database.
* `DATABASE_NAME`: The name of the PostgreSQL database.
* `LINKS_CONFIG_PATH` (optional): Path to the links YAML file, relative to the container's working directory. Defaults to `./config/links.yaml`.
* `DOWNLOADS_PATH` (optional): Path to the downloads folder, relative to the container's working directory. Defaults to `./config/downloads`.
* `STATS_ONLINE_THRESHOLD_MINUTES` (optional): Minutes since a participant's last stats report after which it is considered offline on the page. Defaults to `15`.
* `STATS_EXPIRE_HOURS` (optional): Hours after which a participant's stats entry is no longer shown on the page at all. Defaults to `24`.
* `LOG_LEVEL` (optional): Log level for the server. Defaults to `info`. Valid values: `debug`, `info`, `warn`, `error`.
* `SESSION_PASSWORD`: A string with at least 32 characters for encrypting session cookies. If not provided, the server will automatically generate one and store it in `/app/data/.session_password` for persistence across container restarts.

### OpenID Connect (OIDC) Authentication

Authentication is only possible via OIDC - there is no local username/password login. If all environment variables
for OIDC are provided, clicking "Login" in the navigation bar directly redirects to the OIDC provider (no
intermediate login page). Unlike the admin-only login of the previous project, **any** authenticated OIDC user can
log in here since the page itself is public. Only users whose token contains the admin role additionally see the
admin-only links.

* `OIDC_DISCOVERY_URL` (optional): The OpenID Connect discovery URL for OIDC authentication. (for example for keycloak, `https://login.example.com/realms/myrealm/.well-known/openid-configuration`)
* `OIDC_CLIENT_ID` (optional): The OpenID Connect client ID.
* `OIDC_CLIENT_SECRET` (optional): The OpenID Connect client secret.

As redirect URI use `https://<your-domain>/auth/oidc` and a user needs to have the scope `openid` and `email` to log in.

#### Admin permission

To show the admin-only links to a user, its token needs to contain the right role.
The application expects the roles to be in the `roles` claim of the access token as a list.

For keycloak follow this procedure:

To do that follow this path: `Clients` -> `<your-client>` -> `Client scopes` -> `<your-client>-dedicated` list item -> `Mappers`.

Create a new preconfigured mapper of the type `client roles`, set the `Token Claim Name` to "roles" and verify `Add to access token` and `Multivalued` is checked.
Also uncheck `Full scope allowed` in the `Scope` tab beside the `Mappers` to get only the roles of this client.

The application uses the following role which needs to be set up as a `Client role`:

* `lan_page_admin`: Users with this role see the admin-only links on the page.

## Session Password Management

The server requires a session password for encrypting user session cookies. The entrypoint script handles this automatically:

1. **Provided password**: If `SESSION_PASSWORD` environment variable is set, it will be used.
2. **Existing password**: If a password was previously generated and persisted in `/app/data`, it will be reused.
3. **New password**: If neither exists, a random 64-character hex password is generated and saved to `/app/data/.session_password`.

To ensure session persistence across container restarts, mount a volume to `/app/data` or provide a `SESSION_PASSWORD` environment variable.
