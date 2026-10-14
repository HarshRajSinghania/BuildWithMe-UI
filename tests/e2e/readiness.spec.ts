import { expect, test } from '@playwright/test';
test('framework links replace the example runtime without stale iframe state', async ({ page }) => {
  await page.goto('/examples/vue');
  for (const framework of ['vue', 'svelte', 'vue'] as const) {
    if (!page.url().endsWith(`/examples/${framework}`)) {
      await page
        .getByRole('navigation', { name: 'Example framework' })
        .getByRole('link', { name: framework, exact: true })
        .click();
    }
    const frame = page.frameLocator(`iframe[title="${framework} preview for integration-example"]`);
    await expect(frame.getByRole('tab', { name: 'Overview' })).toBeVisible();
    await expect(page.locator('.preview-loading')).toHaveCount(0);
    await expect(page.locator('.preview-error')).toHaveCount(0);
    await page.getByRole('button', { name: 'Replay preview' }).click();
    await expect(frame.getByRole('tab', { name: 'Overview' })).toBeVisible();
    await expect(page.locator('.preview-loading')).toHaveCount(0);
  }
});
test('catalog cards and filters are present before JavaScript runs', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/components?domain=navigation`);
    await expect(page.getByRole('combobox', { name: 'Filter by product domain' })).toHaveValue(
      'navigation',
    );
    expect(await page.locator('.component-card').count()).toBeGreaterThan(0);
    await expect(page.getByText('Preparing the collection…')).toHaveCount(0);
  } finally {
    await context.close();
  }
});
for (const path of [
  '/',
  '/components',
  '/ecosystem',
  '/contribute',
  '/docs/installation',
  '/components/magnetic-button',
  '/examples/react',
]) {
  test(`${path} owns its canonical URL`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://build-with-me-ui.vercel.app${path === '/' ? '' : path}`,
    );
  });
}
test('standalone previews are not indexed or canonicalized to the homepage', async ({
  page,
  request,
}) => {
  await page.goto('/preview/magnetic-button/react');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  for (const framework of ['vue', 'svelte']) {
    const runtime = await request.get(`/preview-runtime/${framework}/index.html`);
    expect(runtime.ok()).toBe(true);
    expect(await runtime.text()).toContain('name="robots" content="noindex, nofollow"');
  }
});
for (const framework of ['vue', 'svelte'] as const) {
  test(`${framework} accepts host commands and rejects a frame pretending to be its host`, async ({
    page,
  }) => {
    await page.goto(`/preview/magnetic-button/${framework}`);
    const runtime = page.frameLocator(`iframe[title="${framework} preview for magnetic-button"]`);
    await expect(runtime.getByRole('button', { name: /Pull me closer/ })).toBeVisible();
    await expect(page.locator('.preview-loading')).toHaveCount(0);
    const frame = page
      .frames()
      .find((item) => item.url().includes(`/preview-runtime/${framework}/`))!;
    await frame.evaluate(() =>
      window.postMessage(
        { source: 'buildwithme-host', type: 'theme', value: 'light' },
        location.origin,
      ),
    );
    await expect(runtime.locator('html')).toHaveAttribute('data-bwm-theme', 'dark');
    await page.getByRole('combobox', { name: 'Preview theme' }).selectOption('light');
    await expect(runtime.locator('html')).toHaveAttribute('data-bwm-theme', 'light');
  });
  test(`${framework} retries after its runtime fails to load`, async ({ page }) => {
    let failing = true;
    await page.route(`**/preview-runtime/${framework}/assets/**`, (route) =>
      failing ? route.abort() : route.continue(),
    );
    await page.goto(`/preview/magnetic-button/${framework}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.preview-error[role="alert"]')).toContainText(
      'did not become ready',
      { timeout: 20000 },
    );
    failing = false;
    await page.getByRole('button', { name: 'Try again' }).click();
    await expect(
      page
        .frameLocator(`iframe[title="${framework} preview for magnetic-button"]`)
        .getByRole('button', { name: /Pull me closer/ }),
    ).toBeVisible();
    await expect(page.locator('.preview-error[role="alert"]')).toHaveCount(0);
  });
  test(`${framework} pauses JS motion when its frame is outside the viewport`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`/preview/magnetic-button/${framework}`);
    const demo = page
      .frameLocator(`iframe[title="${framework} preview for magnetic-button"]`)
      .locator('.bw-demo');
    await expect(demo).toHaveAttribute('data-active', 'true');
    await page.locator('.site-footer').scrollIntoViewIfNeeded();
    await page.locator('iframe').evaluate((node) => {
      node.style.visibility = 'hidden';
      node.style.position = 'absolute';
      node.style.top = '-2000px';
    });
    await expect(demo).toHaveAttribute('data-active', 'false');
    await page.locator('iframe').evaluate((node) => {
      node.style.visibility = '';
      node.style.position = '';
      node.style.top = '';
    });
    await page.locator('iframe').scrollIntoViewIfNeeded();
    await expect(demo).toHaveAttribute('data-active', 'true');
  });
}

test('rapid catalog edits preserve all filters across reload and reset', async ({ page }) => {
  await page.goto('/components');
  await page.getByRole('combobox', { name: 'Filter by product domain' }).selectOption('navigation');
  await page.getByRole('combobox', { name: 'Filter by framework' }).selectOption('vue');
  await page.getByRole('combobox', { name: 'Filter by engine' }).selectOption('css');
  await page.getByRole('combobox', { name: 'Filter by installation' }).selectOption('source');
  await page.getByRole('textbox', { name: 'Search components' }).fill('tab');
  await expect(page).toHaveURL(
    (url) =>
      url.searchParams.get('domain') === 'navigation' &&
      url.searchParams.get('framework') === 'vue' &&
      url.searchParams.get('engine') === 'css' &&
      url.searchParams.get('method') === 'source' &&
      url.searchParams.get('q') === 'tab',
  );
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'Filter by product domain' })).toHaveValue(
    'navigation',
  );
  await expect(page.getByRole('combobox', { name: 'Filter by framework' })).toHaveValue('vue');
  await expect(page.getByRole('combobox', { name: 'Filter by engine' })).toHaveValue('css');
  await expect(page.getByRole('combobox', { name: 'Filter by installation' })).toHaveValue(
    'source',
  );
  await expect(page.getByRole('textbox', { name: 'Search components' })).toHaveValue('tab');
  await page.locator('.active-filters').getByRole('button', { name: 'Reset' }).click();
  await expect(page).toHaveURL(/\/components$/);
  await expect(page.locator('.component-card')).toHaveCount(55);
});
