# LAN-Page

LAN-Page provides an easy way to share important links (game servers, wiki, voice chat, tournament brackets, ...)
with LAN party participants. Admins can additionally see admin-only links (e.g. infrastructure dashboards) when
logged in with the right role. The page itself is always publicly visible, no login is required to see the
regular links.

It will also collect LAN party participant stats over time: the LAN Launcher client reports hardware/player info to
`GET /api/stats/report`, which is stored in the database and displayed publicly on the page in a "Participants"
table below the link list.

## Features

- Single page listing configurable links, grouped by category
- Links are configured via a simple YAML file that is re-read on every request (no restart needed)
- Admin-only links, only shown to sessions with the configured admin role
- The page is publicly visible; login is only required to unlock admin-only links
- Authentication via OpenID Connect (OIDC) only
- Database connector (PostgreSQL via TypeORM) that stores and serves LAN party participant stats, with an
  online/offline status dot and "last online at" hover tooltip per participant

## Usage

The server can be deployed as a pre-built podman/docker container.

An overview of how to set up LAN-Page is described in the [deploy](deploy) directory. Please look there for more
information.

## Development

### Environment Setup

For local development, install python3, pip, npm and Node.js (version 24 or later).
A `docker-compose` configuration is provided for local testing. You need either Podman or Docker installed to run it.

Clone the repository and install dependencies:

```bash
npm install
```

Now copy the environment template `Env.template` into `Env.ts` and adjust as below.
The settings below are suitable for a local environment provided by the docker-compose.

```json
{
  "databaseHost": "localhost",
  "databasePort": 5432,
  "databaseUser": "postgres",
  "databasePassword": "postgres",
  "databaseName": "postgres",
  "linksConfigPath": "./config/links.yaml",
  "statsOnlineThresholdMinutes": 15,
  "statsExpireHours": 24,
  "logLevel": "info",
  "oidcOpenidAutoDiscoveryUrl": "",
  "oidcClientId": "",
  "oidcClientSecret": ""
}
```

Authentication is only possible via OIDC - set `oidcOpenidAutoDiscoveryUrl`, `oidcClientId` and `oidcClientSecret`
to a working provider for local development if you need to test admin-only links. Without OIDC configured, the
page still works, but nobody can log in and admin-only links stay hidden.

Adjust `config/links.yaml` to change the links shown on the page. See the comments in that file for the supported fields.
Optionally add images to `config/images/` and reference their filename via a link's `image` field; they are served at `/api/links/images/<filename>`.

### Ensure Code quality with pre-commit

This project uses [pre-commit](https://pre-commit.com/) to ensure code quality before committing changes.
To set it up, first install the pre-commit package (e.g., via `pip install pre-commit`), then run:

```bash
# Execute in the project folder
pre-commit install
```

Now, every time you make a commit, the defined hooks will run automatically to check your code.
Those checks will also run on CI to ensure code quality is maintained. No PR will be merged if the checks fail!

### Running the Server Locally

Before starting the server, the local dev environment must be started with the `start_dev_env.sh` (or `.bat`) script.
This will download and start required services like a PostgreSQL database in containers.

After that, you can start the server with:

```bash
npm run dev
```
