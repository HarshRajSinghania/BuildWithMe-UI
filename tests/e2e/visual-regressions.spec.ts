import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
test.describe('@visual', () => {
  test.describe.configure({ mode: 'parallel' });
  const manifests = JSON.parse(
    readFileSync(new URL('../../src/generated/registry.json', import.meta.url), 'utf8'),
  ) as { id: string }[];
  for (const theme of ['dark', 'light'] as const) {
    for (const width of [360, 768, 1280, 1536]) {
      test(`${theme} homepage at ${width}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 1000 });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.addInitScript(
          (selectedTheme) => localStorage.setItem('theme', selectedTheme),
          theme,
        );
        await page.goto('/');
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(page.getByRole('combobox', { name: 'Color theme' })).toHaveValue(theme);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        ).toBe(true);
        await expect(page).toHaveScreenshot(`home-${theme}-${width}.png`, {
          animations: 'disabled',
          maxDiffPixelRatio: 0.01,
        });
      });
    }
  }

  for (const framework of ['react', 'vue', 'svelte'] as const) {
    for (const { id } of manifests) {
      test(`${id}/${framework}: reviewed visual baseline`, async ({ page }) => {
        test.setTimeout(60_000);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto(`/preview/${id}/${framework}`);
        await page.addStyleTag({
          content: '.site-header, .skip-link { visibility: hidden !important; }',
        });
        const demo =
          framework === 'react'
            ? page.locator('.preview-stage .bw-demo').first()
            : page
                .frameLocator(`iframe[title="${framework} preview for ${id}"]`)
                .locator('.bw-demo')
                .first();
        await expect(demo).toBeVisible();
        if (framework !== 'react') await expect(page.locator('.preview-loading')).toHaveCount(0);
        for (const width of [360, 1280]) {
          await page.setViewportSize({ width, height: 900 });
          for (const theme of ['dark', 'light']) {
            await page.getByRole('combobox', { name: 'Preview theme' }).selectOption(theme);
            await expect(page.locator('.preview-stage')).toHaveCSS(
              'background-color',
              theme === 'dark' ? 'rgb(5, 5, 5)' : 'rgb(243, 240, 232)',
            );
            await demo.locator('img').evaluateAll(async (images) => {
              await Promise.all(images.map((image) => (image as HTMLImageElement).decode()));
            });
            if (framework !== 'react') {
              // Fit the entire component before taking an element capture. A tall
              // component otherwise gets clipped by the embedded iframe viewport.
              const height = await demo.evaluate((element) => Math.ceil(element.scrollHeight + 48));
              await page.locator('iframe').evaluate((element, height) => {
                element.style.height = `${height}px`;
                element.style.minHeight = '0';
              }, height);
            }
            // Capture review is required before committing new or updated baseline files.
            await expect(demo).toHaveScreenshot(`${id}-${framework}-${theme}-${width}.png`, {
              animations: 'disabled',
              maxDiffPixelRatio: 0.01,
            });
          }
        }
      });
    }
  }
});
