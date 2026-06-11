#!/usr/bin/env node
/**
 * copy-tinymce.mjs — Self-hosting helper.
 *
 * Copies the installed `tinymce` package (the whole editor: tinymce.min.js,
 * icons, models, plugins, skins, themes, ...) from node_modules into a
 * destination folder that the app serves statically (e.g. ./public/tinymce).
 *
 * Why a script instead of a static copy committed to git?
 *   - The editor files come straight from the npm package, so they always
 *     match the installed version. Bumping `tinymce` (or running
 *     `npm run update:tinymce` after a security advisory) and reinstalling
 *     re-copies the right files automatically.
 *   - Nothing vendored is committed (the destination is .gitignored).
 *
 * It is wired into each app's `postinstall` (covers `npm install` / CI) and
 * `predev` / `prebuild` (covers `npm run dev` / `npm run build` even when
 * node_modules is restored from cache and postinstall did not run).
 *
 * Usage:  node ../../scripts/copy-tinymce.mjs <destination-dir>
 *   defaults to ./public/tinymce relative to the current working directory.
 */
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { cp, rm, readFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);

async function main() {
  const destArg = process.argv[2] ?? './public/tinymce';
  const destDir = resolve(process.cwd(), destArg);

  // Resolve the real location of the `tinymce` package. require.resolve is
  // robust against npm workspaces hoisting (tinymce lives in the root
  // node_modules, not the app's), so we never hardcode ./node_modules.
  let pkgDir;
  try {
    pkgDir = dirname(require.resolve('tinymce/package.json'));
  } catch {
    console.error(
      '[copy-tinymce] Could not resolve the "tinymce" package. ' +
        'Did you run `npm install`? Skipping copy.'
    );
    process.exit(0); // do not fail installs that are still in progress
  }

  const version = JSON.parse(
    await readFile(resolve(pkgDir, 'package.json'), 'utf8')
  ).version;

  // Fresh copy: remove any previous vendored files so stale assets never linger.
  if (existsSync(destDir)) {
    await rm(destDir, { recursive: true, force: true });
  }

  await cp(pkgDir, destDir, {
    recursive: true,
    // Skip metadata files that are useless to serve.
    filter: (src) => !/[\\/](package\.json|README\.md|\.npmignore)$/.test(src),
  });

  console.log(
    `[copy-tinymce] Copied TinyMCE v${version}\n` +
      `              from: ${pkgDir}\n` +
      `              to:   ${destDir}`
  );
}

main().catch((err) => {
  console.error('[copy-tinymce] Failed:', err);
  process.exit(1);
});
