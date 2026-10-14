# Production-page lab samples — 2026-10-07

Latest sample set: `2026-10-07T19:57:11.840Z`, build `TQJjiP6VBGEMR9bdpjjO3`.

Measured on a local production server on Windows with Node.js 24.12.0 and Playwright Chromium. Each row contains the median of three cold browser contexts; the server and package caches are warm. Network/CPU are unthrottled and browser validation was also running on this workstation. These measurements are not field Core Web Vitals or physical-device results.

| Motion        | Viewport width | Route                       | Median FCP (ms) | Median observed LCP (ms) | Maximum CLS | Encoded JavaScript (KiB) |
| ------------- | -------------- | --------------------------- | --------------- | ------------------------ | ----------- | ------------------------ |
| reduce        | 390            | `/`                         | 104             | 104                      | 0.000       | 256                      |
| reduce        | 390            | `/components`               | 140             | 140                      | 0.000       | 235                      |
| reduce        | 390            | `/components/animated-tabs` | 104             | 104                      | 0.000       | 282                      |
| reduce        | 1280           | `/`                         | 140             | 140                      | 0.000       | 256                      |
| reduce        | 1280           | `/components`               | 152             | 152                      | 0.000       | 277                      |
| reduce        | 1280           | `/components/animated-tabs` | 120             | 120                      | 0.000       | 282                      |
| no-preference | 390            | `/`                         | 140             | 140                      | 0.000       | 256                      |
| no-preference | 390            | `/components`               | 136             | 136                      | 0.000       | 235                      |
| no-preference | 390            | `/components/animated-tabs` | 128             | 128                      | 0.000       | 282                      |
| no-preference | 1280           | `/`                         | 140             | 140                      | 0.000       | 494                      |
| no-preference | 1280           | `/components`               | 160             | 160                      | 0.000       | 277                      |
| no-preference | 1280           | `/components/animated-tabs` | 160             | 160                      | 0.000       | 282                      |

The catalog's previous maximum observed CLS was 0.129 at mobile width and 0.116 at desktop width. Attribution identified the footer moving when a short CSR fallback was replaced. Request-time rendering removed that shift in all 36 current samples. No page-width overflow or uncaught browser error was observed by the sampler.

Normal desktop homepage samples used WebGL; mobile and reduced-motion homepage samples used SVG. The additional desktop graphics code increased encoded JavaScript from about 256 KiB to 494 KiB. Keep this conditional load boundary when changing the hero. These readings do not measure interaction latency, sustained animation frame rate, memory pressure, hidden-tab battery use, or constrained mobile networks.

Local regression targets: no document-width overflow, CLS below 0.1 in each sample, no uncaught errors, and initial encoded JavaScript below 400 KiB on mobile / 600 KiB on desktop for these routes. Investigate regressions rather than raising limits without evidence. Collect physical-device/network and field interaction evidence before making broader performance claims.

Reproduce with `pnpm build && pnpm performance:smoke`. The ignored `tmp/performance-smoke.json` includes the build ID, timestamp, environment, individual readings, and renderer selection. Browser screenshots are separate visual evidence. Automated CI remains unchanged.
