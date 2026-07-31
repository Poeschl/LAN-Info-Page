# LAN Info Page

LAN Info Page provides an easy way to share important links (game servers, wiki, voice chat, tournament brackets, ...)
with LAN party participants. Admins can additionally see admin-only links (e.g. infrastructure dashboards) when
logged in with the right role. The page itself is always publicly visible, no login is required to see the
regular links.

It will also collect LAN party participant stats over time: the LAN Launcher client reports hardware/player info to
`GET /api/stats/report`, which is stored in the database and displayed publicly on the page in a "Participants"
table below the link list.

## Features

- Single page listing configurable links, grouped by category
- Admin-only links, only shown to sessions with the configured admin role
- The page is publicly visible; login is only required to unlock admin-only links
- Authentication via OpenID Connect (OIDC) only
- LAN party participant stats, with an online/offline status dot and "last online at" hover tooltip per participant (powered by ETI LAN Launcher)
- Downloadable files for participants (mods, installers, documents, ...), listed below the link collection

Below subsections will describe the main features in more detail.

### Link Collection

![Screenshot of the link collection](docs/assets/feature-links.png)

All links are configured in a file named `links.yaml`. Each link has a title, URL, category and an icon or image.
By a simple configuration change, the page can be adapted to any LAN party's needs.
For links that are only relevant to admins, the `adminOnly` field can be set to `true`.
Those links will only be shown to logged-in users with the configured admin role.

### Downloads

Any file placed in the `config/downloads` folder is automatically listed in a "Downloads" section on the page,
right below the link collection. There is no configuration file for this feature - just drop a file in and it
shows up; remove it and it disappears again, no restart required. This is useful for sharing installers, mods or
maps directly from the page instead of (or in addition to) linking to an external file share.

Only installers and archives are allowed: `.exe`, `.msi`, `.zip`, `.7z`, `.rar`, `.tar`, `.tar.gz`, `.tgz`,
`.tar.bz2` and `.gz`. Files with any other extension are silently ignored - both in the listing and when
requested directly - to keep this feature limited to its intended purpose (shipping tools/mods to participants,
not general-purpose file hosting).

Files are served at `/api/downloads/<filename>` with a "Save As" download prompt, and are publicly accessible to
anyone visiting the page (same as the regular link collection) - there is currently no admin-only restriction for
downloadable files. Hidden files (names starting with a dot) and subfolders are ignored. Installers and archives
are shown with distinct icons in the "Downloads" section so participants can tell them apart at a glance.

If you need more advanced file sharing (uploads by participants, folder browsing, permissions, ...), consider
running a dedicated file server like [copyparty](https://github.com/9001/copyparty) alongside this page and adding
a regular link to it instead.

### LAN Participants Statistics

This feature is powered by the [ETI LAN Launcher](https://www.eti-lan.xyz/) client, which reports hardware and player info to the server.

![Screenshot of the participants table](docs/assets/feature-participants.png)

The online/offline status of each participant is determined by the last time they reported to the server.
If a participant has not reported in the last x minutes, they are considered offline (x can be configured).

## Usage

The server can be deployed as a pre-built podman/docker container.

An overview of how to set up LAN Info Page is described in the [deploy](deploy) directory. Please look there for more
information.

## Development

### AI usage

AI is used in this project to support development. Pure 100% agentic development is not done and is not planned.
All code changes go through human code review to ensure quality and correctness.

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
  "downloadsPath": "./config/downloads",
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
Optionally add files to `config/downloads/` to offer them for download to participants; see the "Downloads" section above.

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

### Simulating a Participant Stats Report

To test the "Participants" table without a real LAN Launcher client, simulate a stats report with `curl` against the
running dev server (`GET /api/stats/report`, unauthenticated):

```bash
curl "http://localhost:3000/api/stats/report?hostname=LAN-PC-01&macaddr1=00:1A:2B:3C:4D:5E&macaddr2=00:1A:2B:3C:4D:5F&board_manufacturer=ASUS&baseboard=ROG%20STRIX%20B550-F&system_product_name=Custom%20Build&bios_release=2.20&cpu=AMD%20Ryzen%207%205800X&gpu=NVIDIA%20RTX%203070&windows_edition=Windows%2011%20Pro&player_name=Markus&current_game=Counter-Strike%202"
```

Only `macaddr1` is required, all other query parameters are optional. A successful call returns `ok` and the
participant then shows up at `GET /api/stats` and in the page's "Participants" table.
