import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { withProductionServer } from './verification-server';
const samples = await withProductionServer(async (url) => {
  const browser = await chromium.launch({ headless: true });
  const measurements: unknown[] = [];
  try {
    for (const motion of ['reduce', 'no-preference'] as const) {
      for (const width of [390, 1280]) {
        for (const route of ['/', '/components', '/components/animated-tabs']) {
          for (let run = 1; run <= 3; run++) {
            const context = await browser.newContext({
              viewport: { width, height: 900 },
              reducedMotion: motion,
            });
            const page = await context.newPage();
            const errors: string[] = [];
            page.on('pageerror', (error) => errors.push(error.message));
            // Literal JS avoids serializing transpiler-specific closure helpers into the page.
            await page.addInitScript({
              content: `
            window.__bwmMetrics = { largestPaint: 0, shifts: 0 };
            new PerformanceObserver(list => {
              for (const entry of list.getEntries()) window.__bwmMetrics.largestPaint = entry.startTime;
            }).observe({ type: 'largest-contentful-paint', buffered: true });
            new PerformanceObserver(list => {
              for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__bwmMetrics.shifts += entry.value;
            }).observe({ type: 'layout-shift', buffered: true });
          `,
            });
            await page.goto(url + route);
            await page.waitForLoadState('networkidle');
            await page.waitForFunction('window.__bwmMetrics.largestPaint > 0');
            const metric = await page.evaluate(() => {
              const navigation = performance.getEntriesByType(
                'navigation',
              )[0] as PerformanceNavigationTiming;
              const resources = performance.getEntriesByType(
                'resource',
              ) as PerformanceResourceTiming[];
              return {
                ...(window as unknown as { __bwmMetrics: { largestPaint: number; shifts: number } })
                  .__bwmMetrics,
                fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null,
                ttfb: navigation.responseStart,
                jsBytes: resources
                  .filter((resource) => /\.js(?:\?|$)/.test(resource.name))
                  .reduce((bytes, resource) => bytes + resource.encodedBodySize, 0),
                resources: resources.length,
                renderer:
                  document.querySelector('[data-renderer]')?.getAttribute('data-renderer') ?? null,
                overflow: document.documentElement.scrollWidth > innerWidth,
              };
            });
            const jsBudget = (width < 981 ? 400 : 600) * 1024;
            if (
              errors.length ||
              metric.overflow ||
              metric.shifts >= 0.1 ||
              metric.jsBytes > jsBudget
            )
              throw new Error(
                `Performance sample failed for ${route}: ${JSON.stringify({ errors, metric, jsBudget })}`,
              );
            measurements.push({ motion, width, route, run, ...metric });
            await context.close();
          }
        }
      }
    }
    return measurements;
  } finally {
    await browser.close();
  }
});
await fs.mkdir('tmp', { recursive: true });
await fs.writeFile(
  'tmp/performance-smoke.json',
  JSON.stringify(
    {
      buildId: (await fs.readFile('.next/BUILD_ID', 'utf8')).trim(),
      measuredAt: new Date().toISOString(),
      node: process.version,
      platform: process.platform,
      environment:
        'Local production server, Chromium, cold browser contexts, reduced and normal motion; no network or CPU throttling. These are lab samples, not field Core Web Vitals.',
      samples,
    },
    null,
    2,
  ),
);
console.log('Saved 36 production-page lab samples to tmp/performance-smoke.json.');
