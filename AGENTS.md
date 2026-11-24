# Repository Guidelines

## User Identity and Privacy

- Authenticate actions on the caller's own account with the private user UUID and a verified session or token. Read the caller's identity from that session. A public UID or a user identifier in the request body cannot establish who is calling.
- Use the public UID to look up, display, or interact with another user. Only the authenticated owner may receive their own user UUID. This also applies to administrators, nested response data, error messages, public URLs, and filenames. Keep user UUIDs used for database joins on the server. UUIDs belonging to resources such as roles and groups are separate identifiers.

## Project Structure

KIRAKIRA Cerasus is a Nuxt and Vue frontend with source at the repository root. `app.vue` is the entry point, `pages/` defines routes, and `components/` and `layouts/` contain shared UI. Put reusable Vue logic in `composables/`, API clients in `composables/api/`, Pinia state in `stores/`, and general helpers in `utils/`. Nuxt modules and build plugins live in `modules/` and `plugins/`.

Use `assets/` for bundled images, icons, fonts, and styles and `public/` for files served directly. Update source strings in `i18n/locales/English.ts` and use Crowdin for translations.

## Build and Development

Use the Node LTS release selected by `.nvmrc` and the pnpm version pinned in `package.json`. Run commands from the repository root.

Use the computer's existing pnpm store for dependency operations. Keep task-created temporary files, logs, and verification artifacts under the repository's `node_modules/.cache/`. Do not create temporary pnpm stores or place task artifacts in `/tmp`, `/private/tmp`, or `$TMPDIR`.

- `pnpm install` installs dependencies and prepares Nuxt's generated files.
- `pnpm dev:local` starts the HTTPS frontend, usually at `https://localhost:3000`, and expects a separate Rosales backend at `https://localhost:30000`.
- `pnpm dev:stg` proxies requests to the staging backend. See the usage restrictions in [README_en-US.md](README_en-US.md#running-with-online-backend).
- `pnpm build` builds the production app, `pnpm generate` produces static output, and `pnpm preview` serves the output locally.

## Coding Style

Use tabs for code, two spaces for Markdown and YAML indentation, and LF line endings. Prefer TypeScript, the Vue Composition API with `<script setup lang="ts">`, and scoped SCSS for component styles. Use double quotes and statement semicolons in TypeScript. Name components in PascalCase (`SendVerificationCode.vue`), pages in kebab-case (`block-and-hide.vue`), and composable functions with a `use` prefix (`useBackgroundImages`).

Run `pnpm exec eslint <file>` for changed code and `pnpm exec stylelint <file>` for changed styles. Use `pnpm lint:css` to check styles across the repository.

## Testing

Exercise changed flows in the local browser and use `/dev/components` to check reusable UI. The standalone `plugins/postcss/*.test.ts` scripts print transformed CSS for inspection. Running them with `pnpm exec tsx <file>` currently requires resolving TypeScript alias parsing errors and making the undeclared `postcss-selector-parser` dependency available. The project has no package-level test script or coverage threshold.

## Commits and Pull Requests

Use Conventional Commits, such as `fix(search): disable auto focus`. Husky runs Commitlint on commit messages. Target `develop`, describe the change and how you verified it, and link related issues when available. Include screenshots for visible UI changes where they help review.
