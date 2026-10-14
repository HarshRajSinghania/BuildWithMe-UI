import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const theme of ['dark', 'light']) {
  for (const width of [360, 1280]) {
    test(`installation guidance works in ${theme} at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
      await page.goto('/components/magnetic-button');
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const install = page.locator('.component-install');
      const tabs = page.getByRole('tablist', { name: 'Component framework' });
      for (const framework of ['react', 'vue', 'svelte'] as const) {
        await tabs.getByRole('tab', { name: new RegExp(framework) }).click();
        await expect(install.locator('.source-toolbar code')).toContainText(
          `/r/${framework}/magnetic-button.json`,
        );
        await expect(install.getByRole('link')).toHaveAttribute(
          'href',
          `/docs/installation#${framework}`,
        );
        const disclosure = install.locator('summary');
        await disclosure.focus();
        if (
          !(await install.locator('details').evaluate((node) => (node as HTMLDetailsElement).open))
        )
          await disclosure.press('Enter');
        await expect(install.locator('pre')).toContainText(
          framework === 'react'
            ? '@/components/'
            : framework === 'vue'
              ? '~/components/'
              : '$lib/components/',
        );
        await expect(install.getByRole('list', { name: 'Installed source files' })).toContainText(
          'motion-lifecycle.ts',
        );
        await expect(install.getByRole('list', { name: 'Installed source files' })).toContainText(
          'LICENSE',
        );
      }
      if (testInfo.project.name === 'chromium')
        await install.screenshot({ path: `tmp/adoption-panel-${theme}-${width}.png` });
      await page.reload();
      await expect(install.getByRole('link')).toHaveAttribute('href', '/docs/installation#svelte');
      // The link is server-rendered; runtime readiness confirms hydration before history traversal.
      await expect(page.locator('.preview-loading')).toHaveCount(0);
      await expect(page.locator('.preview-error')).toHaveCount(0);
      await page.goBack();
      await expect(install.getByRole('link')).toHaveAttribute('href', '/docs/installation#vue');
      await page.evaluate(() =>
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: async () => {
              throw new Error('blocked');
            },
          },
        }),
      );
      await install.getByRole('button', { name: 'Copy command', exact: true }).click();
      await expect(install.getByLabel('Text to copy manually')).toHaveValue(
        /\/r\/vue\/magnetic-button.json/,
      );
      await install.getByRole('link').click();
      await expect(page.locator('#vue')).toBeInViewport();
      for (const framework of ['react', 'vue', 'svelte']) {
        await expect(page.locator(`#${framework}-usage pre`)).toBeVisible();
      }
      const accessibility = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      expect(accessibility.violations).toEqual([]);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
      if (testInfo.project.name === 'chromium')
        await page.screenshot({ path: `tmp/adoption-guide-${theme}-${width}.png`, fullPage: true });
      // Reduced CSS viewport models browser zoom reflow; CSS zoom does not update breakpoints.
      await page.setViewportSize({ width: Math.max(320, Math.floor(width / 2)), height: 450 });
      await page.getByRole('link', { name: 'Svelte / SvelteKit', exact: true }).click();
      await expect(page.locator('#svelte')).toBeInViewport();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
    });
  }
}
