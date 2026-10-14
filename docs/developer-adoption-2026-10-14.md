# Existing-application installation — 2026-10-14

Implemented on `codex/developer-adoption`, preserving the pre-existing uncommitted readiness work.

## Delivered

The existing installation handbook now has stable framework anchors, explicit CLI transport configuration and alias guidance, complete-folder placement, manifest-authored first usage, theme boundaries, integration links, and recovery guidance. Native Nuxt and SvelteKit aliases and generated configuration are retained after the transport step. Existing application configuration is merged rather than replaced.

The detail workbench uses its existing framework selection for the command, setup link, manifest usage, and actual source-closure file list. Guidance uses a keyboard-accessible native disclosure and the existing clipboard recovery control. Homepage source-ownership cards keep their compact installation presentation.

The expanded CLI suite installs Animated Tabs, Magnetic Button, and Code Snippet from the served registry into fresh Next.js, Nuxt, and SvelteKit consumers. It moves Vue and Svelte closures to the documented native directories, type-checks and builds the applications, and exercises controlled tabs, keyboard navigation, action callbacks, and successful/failed clipboard operations in Chromium. Tests also confirm CSS delivery and absence of uncaught browser errors. Negative controls temporarily remove a helper or misplace a complete folder, verify that the closure gate rejects them, and restore the fixtures.

Nuxt's default unchecked-index checking found unsafe array access in the shared pagination and motion helpers and Vue tabs navigation. Guards were added in authoritative sources; the consumer compiler configuration was not weakened. Public component APIs and generated artifact targets remain unchanged.

## Evidence

- `pnpm check`: lint, TypeScript, 32 unit tests, 55-design registry validation, the 244-page production build, and three packed packages passed on the final application sources. Formatting and diff-whitespace checks passed.
- `pnpm test:install:cli`: all three consumers passed closure/dependency/notice checks, negative controls, type checking, production builds, and Chromium interactions. The three installed designs contain 22 React files, 19 Vue files, and 19 Svelte files.
- `pnpm test:install`: all 165 independent source artifacts and three 55-export packages passed; clean Next.js, Nuxt, and SvelteKit packed-package consumers built successfully after the helper guards.
- The focused installation/integration/tabs/workbench browser run passed 33 cases across Chromium, Firefox, and WebKit. Dark/light themes, 360/1280 widths, reduced motion, source file lists, clipboard recovery, reload/history, setup anchors, axe scans, and document bounds are covered.
- After preserving the compact homepage cards and synchronizing the reload/history test with runtime readiness, the final homepage/installation regression run passed all 15 cases across the three engines.
- An earlier broader catalog/readiness/integration run passed 129 existing cases. Its 12 new installation cases failed solely at an incorrect CSS-zoom assertion; those cases subsequently passed with a reduced-viewport reflow check in the focused run.
- Dark/light mobile/desktop panel and handbook captures were inspected locally. Screenshot output and consumer results remain in ignored `tmp/`; no baselines were rewritten.

## Limits

Reflow is simulated through a reduced CSS viewport, with a minimum width of 320px. Actual 200% browser UI zoom remains a manual acceptance item: the in-app browser's zoom keyboard shortcut did not change its viewport/device ratio. This is not physical-device, assistive-technology, or field-performance evidence.

The CLI checks use the advertised `shadcn@latest` command and require network access. One attempt encountered a transient timeout fetching shadcn's neutral color registry; the subsequent complete run passed. Clipboard success uses a browser-local stub to assert payloads, separately from failure recovery; it does not assert operating-system clipboard permissions.

History tests wait for native preview readiness after reload before traversing back, rather than treating server-rendered links as a hydration signal. Immediate history traversal during hydration is outside this acceptance evidence.

Initial milestone verification used Next.js 16.3.6 / React 19.3.0, Nuxt 4.5.2 / Vue 3.5.43, and SvelteKit 2.70.3 / Svelte 5.57.1. Sample installation evidence does not promote full component verification or establish consumer adoption. npm remains unpublished; no release, push, or deployment was performed during that implementation.

## Pre-push security verification — 2026-10-14

A fresh production audit found six advisories affecting the pinned Next.js version. The application and both Next.js consumer fixtures now pin 16.3.8, including the fixes documented in the upstream [image optimization advisory](https://github.com/advisories/GHSA-cjq9-62q9-8jv4) and [Draft Mode cache advisory](https://github.com/advisories/GHSA-3w37-wq28-93x7). The compatibility guide reflects the patched consumer version; React, Vue, Nuxt, and Svelte versions are unchanged.

On the patched dependency set, `pnpm check`, `pnpm format:check`, and `pnpm audit --prod` passed; the audit reports no known vulnerabilities. All 165 source artifacts and three packed-package consumers passed `pnpm test:install`, and all three CLI-installed consumers passed their closure, negative, type, build, and Chromium interaction checks. Staged-file hygiene and whitespace checks passed; generated outputs and local evidence remain untracked.

The complete browser run passed **1,173 / 1,173** cases: 391 each in Chromium, Firefox, and WebKit. Snapshot updates were disabled, with no skipped, failed, or retried cases. This includes the reviewed visual baselines and the new installation guidance. The manual evidence limits above remain unchanged.
