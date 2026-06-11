# TinyMCE self-hosted · monorepo PoC (AngularJS + Vue 3)

Proof of concept showing how to **self-host TinyMCE 8** (no cloud API key, no
paid plan) and reuse the same editor build across two apps in an **npm
workspaces** monorepo:

| App | Framework | Integration |
| --- | --- | --- |
| `apps/vue3-app` | Vue 3 + Vite | reusable `<TinyEditor v-model>` component over `@tinymce/tinymce-vue` |
| `apps/angularjs-app` | AngularJS 1.8 + Vite | reusable `<tiny-editor ng-model>` component (own module) over the global `tinymce` |

## Why self-host?

Since **TinyMCE 7** the editor is licensed under **GPLv2+**, and the hosted
"cloud" build requires a paid API key (it shows a *"This domain is not
registered"* banner otherwise). Self-hosting the open-source package and
declaring `license_key: 'gpl'` removes both the API key and the banner — at the
cost of premium plugins (powerpaste, spellchecker, etc.), which are **not**
included in the GPL package and are intentionally omitted here.

## How the self-hosting works (the core of this PoC)

The `tinymce` npm package contains the whole editor. We never serve it from
`node_modules` directly nor commit it — instead a script copies it into each
app's `public/tinymce/` (served at `/tinymce/tinymce.min.js`):

- **`scripts/copy-tinymce.mjs`** resolves the installed `tinymce` package
  (robust against workspace hoisting via `require.resolve`) and copies it to the
  destination passed as an argument.
- It is wired into each app's npm scripts:
  - `postinstall` → runs on every `npm install` (local **and CI**).
  - `predev` / `prebuild` → runs before `npm run dev` / `npm run build`, so the
    files exist even when `node_modules` is restored from cache.
- The destination `apps/*/public/tinymce/` is **git-ignored** — the editor
  files always come from the installed package version, so they can't drift.

### Updating after a security advisory

It is essentially "reinstall and re-copy":

```bash
npm run update:tinymce   # npm install tinymce@latest in both apps + re-copy
npm run audit            # npm audit, to surface known vulnerabilities
```

> **Heads-up:** `npm audit` reports a *high* advisory against **`angular`**
> (AngularJS 1.x). AngularJS is **end-of-life** and the advisories have
> *"No fix available"* — this is inherent to using AngularJS, not a TinyMCE
> problem, and no `update`/`audit fix` can resolve it. It is kept here only
> because the PoC explicitly targets AngularJS; a real project should migrate
> off AngularJS. The TinyMCE dependency itself is clean.

## Getting started

```bash
npm install              # installs all workspaces + copies TinyMCE into each app

npm run dev:vue          # Vue 3 app   → http://localhost:5173
npm run dev:angularjs    # AngularJS   → http://localhost:5174
```

## End-to-end tests + screenshot evidence

Each app has Playwright tests that load the editor, type into it, apply
toolbar formatting, assert the bound model, and save screenshots to
`apps/*/tests/evidence/`.

```bash
npx playwright install --with-deps chromium   # first time only
npm run test:e2e                               # runs e2e in every workspace
# or per app:
npm run test:e2e -w apps/vue3-app
npm run test:e2e -w apps/angularjs-app
```

Evidence screenshots produced: `01-editor-cargado.png`,
`02-texto-escrito.png`, `03-formato-aplicado.png`.

## Layout

```
.
├─ package.json                 # npm workspaces + orchestration scripts
├─ scripts/copy-tinymce.mjs     # self-hosting copy helper
└─ apps/
   ├─ vue3-app/                 # Vue 3 + <TinyEditor>
   └─ angularjs-app/            # AngularJS 1.8 + <tiny-editor>
```
