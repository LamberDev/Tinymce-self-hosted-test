#!/usr/bin/env node
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { cp, rm, readFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);

async function main() {
  const destArg = process.argv[2] ?? './public/tinymce';
  const destDir = resolve(process.cwd(), destArg);

  let pkgDir;
  try {
    pkgDir = dirname(require.resolve('tinymce/package.json'));
  } catch {
    console.error(
      '[copy-tinymce] Could not resolve the "tinymce" package. ' +
        'Did you run `npm install`? Skipping copy.'
    );
    process.exit(0);
  }

  const version = JSON.parse(
    await readFile(resolve(pkgDir, 'package.json'), 'utf8')
  ).version;

  if (existsSync(destDir)) {
    await rm(destDir, { recursive: true, force: true });
  }

  await cp(pkgDir, destDir, {
    recursive: true,
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
