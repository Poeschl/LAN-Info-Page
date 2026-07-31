# GitHub Copilot Instructions for LAN Info Page

## Repository Overview

**LAN Info Page** is a Nuxt 4-based web application that shows a single, publicly visible page listing configurable
links (game servers, wiki, voice chat, etc.) for LAN party participants. Links are configured via a YAML file and
re-read on every request. Users authenticated via OIDC whose token/session contains the admin role additionally see
admin-only links. The project also ships a database connector, used to collect and display LAN party participant
stats reported by the LAN Launcher client.

**Tech Stack:**
- **Framework:** Nuxt 4 (Vue 3, TypeScript)
- **Runtime:** Node.js v24+
- **Database:** PostgreSQL with TypeORM (used only for the participant stats feature, not for links)
- **Migrations:** pg-flyway
- **Testing:** Vitest with @nuxt/test-utils
- **Linters:** ESLint, Biome (for formatting)
- **Code Quality:** Pre-commit hooks (configured in `.pre-commit-config.yaml`)
- **Container Runtime:** Docker/Podman

## Environment Setup & Prerequisites

**ALWAYS perform these steps in order for any new clone:**

1. **Install Node.js v24+** (npm 10+)
2. **Install dependencies:**
   ```bash
   npm install
   ```
   This automatically runs `nuxt prepare` as a postinstall hook, generating types in `.nuxt/`.

3. **Create environment configuration (for dev/build only, NOT required for tests):**
   ```bash
   cp Env.template Env.ts
   ```
   **IMPORTANT:**
   - `Env.ts` is required for `npm run dev` and `npm run build`
   - `Env.ts` is NOT required for `npm run test` - tests use a mock (see Testing section)

4. **Adjust links config:** Edit `config/links.yaml` to change which links are shown (see comments in that file).

5. **Start development environment (optional, for testing with database):**
   ```bash
   ./start_dev_env.sh  # or start_dev_env.bat on Windows
   ```
   This starts a PostgreSQL container via docker-compose. Not required for building/linting, and not required
   for the main link-list page to work (it only reads the YAML file).

## Build, Lint, Test Commands

### Linting
```bash
npm run lint
```
- **Prerequisite:** `.nuxt/` must be generated (automatically done by `npm install`)
- Runs ESLint with `--fix` flag
- Configuration: `eslint.config.ts` (using Nuxt's ESLint module)
- **ALWAYS run before committing**

### Building
```bash
npm run build
```
- **Prerequisite:** `Env.ts` must exist (create from `Env.template`)
- Builds the Nuxt application with Nitro, then copies `database/migrations/` and `config/` into `.output/`
- Output directory: `.output/`
- Success indicator: Creates `.output/server/index.mjs`

### Development Server
```bash
npm run dev
```
- **Prerequisite:** `Env.ts` must exist
- Starts Nuxt dev server on port 3000 with hot-reload

### Testing
```bash
npm run test           # Run all tests
npm run test:unit      # Run unit tests only (Node environment, mirrors server/)
npm run test:component # Run component tests only (Nuxt environment, mirrors app/)
```
- **Configuration:** `vitest.config.ts`
- **Test naming convention:** `[SourceFileName].test.ts`
- **Environment Configuration Mocking:**
  - Tests do NOT require `Env.ts` to be present - the environment is mocked automatically
  - Mock file: `test/mocks/Env.ts`
  - A Vite plugin in `vitest.config.ts` redirects all `~~/Env` imports to the mock file
  - **IMPORTANT:** Tests should NEVER rely on the real `Env.ts` file

### Database Migrations
- **Migration tool:** pg-flyway
- **Migrations location:** `database/migrations/`
- **Naming convention:** `V###__description.sql` (e.g., `V001__initial_schema.sql`)
- **Execution:** Migrations run automatically at application startup via the `01_databaseInitializer` Nitro
  plugin. Failures are logged but do not stop the server, since the main page does not depend on the database.

## Pre-commit Hooks & Code Quality

**CRITICAL: All code changes MUST pass pre-commit hooks before being committed.**

```bash
pip install pre-commit  # or brew install pre-commit
pre-commit install
```

**Configured hooks** (`.pre-commit-config.yaml`):
1. **trailing-whitespace** - Removes trailing whitespace
2. **end-of-file-fixer** - Ensures files end with newline
3. **check-merge-conflict** - Prevents committing merge conflict markers
4. **check-added-large-files** - Blocks files >1MB
5. **check-shebang-scripts-are-executable** - Ensures shell scripts with shebangs are executable
6. **mixed-line-ending** - Enforces LF line endings
7. **biome-format** - Formats CSS, JS, TS, Vue, YAML, HTML, JSON
8. **oxipng** - Optimizes PNG images
9. **gitleaks** - Scans for secrets/credentials
10. **yaml-extension-check** - Enforces `.yaml` (not `.yml`)
11. **jpeg-extension-check** - Enforces `.jpeg` (not `.jpg`)

**EditorConfig:** `.editorconfig` defines 2-space indent, LF line endings, UTF-8, max line length 160.

## Project Structure

```
/
├── app/                    # Nuxt application code
│   ├── app.vue             # Root Vue component
│   ├── assets/             # Stylesheets (SCSS)
│   ├── components/         # Vue components (NavBar, NavbarUserComponent, PageFooter, ...)
│   ├── composeables/       # Vue composables (useAuthApi, useLinksApi)
│   ├── pages/               # Nuxt pages (index = the public link list)
│   └── plugins/            # Nuxt plugins (fontawesome, logging)
├── server/                 # Nitro server code
│   ├── api/                # API routes (auto-registered)
│   │   ├── auth/            # Auth method endpoint (GET /api/auth)
│   │   ├── health/          # Health check endpoint
│   │   ├── links/            # GET /api/links (public, role-filtered)
│   │   └── stats/            # GET /api/stats (public), GET /api/stats/report (ingestion, unauthenticated)
│   ├── models/              # Server-side models (ErrorResponse, Health)
│   ├── plugins/             # Nitro plugins (logging, startup, database initializer)
│   ├── repositories/         # TypeORM entities (PlayerStatRepository)
│   ├── routes/auth/oidc.ts  # OIDC callback handler
│   ├── schemas/              # Zod validation schemas (LinkConfigSchema)
│   ├── services/            # Business logic (AuthService, LinkService)
│   └── utils/               # Server utilities (database.ts - TypeORM DataSource)
├── config/
│   ├── links.yaml           # The configurable list of links shown on the page
│   └── images/              # Optional images for links, referenced via a link's "image" field
├── test/                   # Test suite
│   ├── unit/                # Unit tests (Node environment), mirrors server/
│   └── component/            # Component tests (Nuxt environment), mirrors app/
├── database/
│   └── migrations/           # SQL migration files (pg-flyway), e.g. V001__initial_schema.sql
├── shared/
│   ├── models/               # TypeScript model interfaces shared between client/server (Link, PlayerStat, Auth)
│   └── types/                # Ambient type declarations (auth.d.ts)
├── public/                 # Static assets
├── deploy/                 # Deployment configs and README
├── docker/                 # Dockerfile and entrypoint.sh
├── .pre-commit-config.yaml
├── biome.json
├── eslint.config.ts
├── nuxt.config.ts
├── vitest.config.ts
├── tsconfig.json
├── Env.template             # Environment template
├── Env.ts                   # Environment config (git-ignored, create from template)
└── docker-compose.yaml      # Local dev services (PostgreSQL)
```

## Key Concepts

- **Public page, optional admin links:** `app/pages/index.vue` is reachable without login. `GET /api/links`
  filters out `adminOnly` links unless the caller's session has the `lan_page_admin` role
  (see `server/services/AuthService.ts` `ADMIN_ROLE`).
- **YAML-driven links:** `config/links.yaml` is validated with `server/schemas/LinkConfigSchema.ts` (Zod) and read
  fresh on every request by `server/services/LinkService.ts` - no restart needed to change links. Links may specify an
  `image` filename resolved against `config/images/` and served (with path-traversal protection) at
  `GET /api/links/images/:filename`, as an alternative to the FontAwesome `icon` field.
- **Auth:** OIDC only (`server/routes/auth/oidc.ts`) - there is no local username/password login. Clicking "Login" in
  `NavBar.vue` links directly to `/auth/oidc`, skipping any intermediate login page. Any authenticated OIDC user may
  log in; only users whose `roles` claim contains `lan_page_admin` get the admin role in their session.
- **Participant stats:** `database/migrations/V001__initial_schema.sql` and
  `server/repositories/PlayerStatRepository.ts` provide a `player_stats` table keyed by MAC address, modeled after
  the LAN Launcher-compatible `stats.php` reporting endpoint of the original eti-lan/LANPage project (hostname, MAC
  addresses, hardware info, player name, current game, last-seen timestamp). `server/services/PlayerStatService.ts`
  implements the upsert-by-MAC ingestion (`report()`) and the expiry-filtered, online/offline-annotated retrieval
  (`getStats()`). `GET /api/stats/report` (intentionally unauthenticated, matching the original `stats.php` design
  for use only on trusted LAN networks) is the ingestion endpoint for the LAN Launcher client; `GET /api/stats` is
  the public retrieval endpoint consumed by `app/composeables/useStatsApi.ts`. `app/pages/index.vue` renders the
  results in a "Participants" table below the link list, with a colored online/offline status dot per row (hover
  tooltip shows "Last online at ...").

## Common Issues & Workarounds

1. **"Cannot find module './Env'"** - Missing `Env.ts`. Fix: `cp Env.template Env.ts`.
2. **"Types generated in .nuxt" but TypeScript errors persist** - Stale `.nuxt/` cache. Fix: delete `.nuxt/` and
   re-run `npm install`.
3. **Database connection errors during build/dev** - The link list page works without a database. Only the
   participant stats endpoints require one; failures there are logged, not fatal.

## Development Workflow

1. Create `Env.ts` from template (first time only)
2. Make code changes
3. Run Biome formatting on changed files: `npx @biomejs/biome format --write <changed files>`
4. Run `npm run lint` to auto-fix ESLint issues
5. Test with `npm run dev` (if needed)
6. Run `npm run build` to ensure production build works
7. Run `pre-commit run --all-files` to ensure all hooks pass
8. Commit only after all pre-commit hooks are green (passing)

**For database schema changes:**
1. Create new SQL migration file in `database/migrations/` following naming convention `V###__description.sql`
2. Write SQL DDL statements (CREATE TABLE, ALTER TABLE, etc.)
3. If adding new entities, create the corresponding TypeORM entity in `server/repositories/` and register it in
   `server/utils/database.ts`'s `entities` array

## Testing Best Practices

- **Mirror structure:** unit tests under `test/unit/` mirror `server/`, component tests under `test/component/`
  mirror `app/`.
- **Given/When/Then:** structure each test body with `// given`, `// when`, `// then` comments.
- **Environment mocking:** never import the real `Env.ts` in tests; rely on `test/mocks/Env.ts` via the Vite alias
  configured in `vitest.config.ts`.

```typescript
// test/unit/services/ExampleService.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { ExampleService } from "../../../server/services/ExampleService";

describe("ExampleService", () => {
  let service: ExampleService;

  beforeEach(() => {
    service = ExampleService.getInstance();
  });

  describe("methodName", () => {
    it("should do something when condition is met", () => {
      // given
      const input = "test";

      // when
      const result = service.methodName(input);

      // then
      expect(result).toBe("expected");
    });
  });
});
```

## Important Notes

- **Node Version:** Requires Node.js 24+
- **Database:** PostgreSQL 18 (alpine) in docker-compose, only needed for participant stats collection
- **Build Artifacts:** `.output/`, `.nuxt/`, `node_modules/` are git-ignored
- **Environment File:** `Env.ts` is git-ignored, must be created locally
- **Line Endings:** LF enforced (pre-commit hook auto-fixes)
- **Indentation:** 2 spaces everywhere (enforced by EditorConfig)

## Trust These Instructions

These instructions are comprehensive and tested. Only search for additional information if you encounter errors
not covered here or if these instructions prove incorrect for your specific scenario.
