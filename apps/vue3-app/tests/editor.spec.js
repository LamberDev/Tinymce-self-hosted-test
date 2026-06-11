import { test, expect } from '@playwright/test';

const EVIDENCE = 'tests/evidence';

const editorFrame = (page) => page.frameLocator('iframe.tox-edit-area__iframe');
const editorBody = (page) => editorFrame(page).locator('body#tinymce');

test.describe('Vue 3 · self-hosted TinyMCE', () => {
  test('loads the editor from the self-hosted script (not the cloud)', async ({ page }) => {
    const scriptResponse = page.waitForResponse(
      (res) => res.url().includes('/tinymce/tinymce.min.js') && res.status() === 200
    );

    await page.goto('/');
    const res = await scriptResponse;

    expect(new URL(res.url()).host).toBe(new URL(page.url()).host);
    expect(res.url()).not.toContain('tiny.cloud');

    await expect(page.locator('.tox-tinymce')).toBeVisible();
    await expect(editorBody(page)).toBeVisible();
    await expect(page.locator('.tox-notification')).toHaveCount(0);

    await page.screenshot({ path: `${EVIDENCE}/01-editor-cargado.png`, fullPage: true });
  });

  test('typing updates the bound v-model', async ({ page }) => {
    await page.goto('/');
    const body = editorBody(page);
    await expect(body).toBeVisible();

    await body.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Delete');
    await body.type('Texto escrito por Playwright en Vue 3.');

    await expect(page.getByTestId('model-output')).toContainText(
      'Texto escrito por Playwright en Vue 3.'
    );
    await expect(page.getByTestId('char-count')).not.toHaveText('0');

    await page.screenshot({ path: `${EVIDENCE}/02-texto-escrito.png`, fullPage: true });
  });

  test('toolbar formatting (bold) is applied and reflected in the model', async ({ page }) => {
    await page.goto('/');
    const body = editorBody(page);
    await expect(body).toBeVisible();

    await body.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Delete');
    await body.type('Texto en negrita');
    await page.keyboard.press('Control+A');

    await page.getByRole('button', { name: 'Bold' }).click();

    await expect(page.getByTestId('model-output')).toContainText('<strong>');

    await page.screenshot({ path: `${EVIDENCE}/03-formato-aplicado.png`, fullPage: true });
  });
});
