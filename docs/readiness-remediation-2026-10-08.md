# Readiness remediation — 2026-10-08

Implemented on `codex/readiness-remediation`. This review supersedes historical browser-blocked notes. Local Chromium, Firefox, and WebKit execution was authorized for this work.

## Changes delivered

- Pinned patched transitive dependencies: `sharp@0.35.5` and `source-map-js@1.2.2`.
- Constrained the native runtime mount so mobile Vue/Svelte frames can shrink; bounds assertions now inspect the iframe document as well as the host page.
- Corrected Flip Text's accessible text in all three frameworks and made non-submit React actions explicitly `type="button"`.
- Assigned route-specific canonical URLs and excluded standalone preview pages and raw native runtime documents from indexing.
- Separated behavior and visual suites. Settled themes are checked before axe scans. All 165 source previews have dark/light mobile/desktop baselines in all three browser engines; homepage baselines cover four widths.
- Reviewed contact sheets for every design, framework, theme, and viewport, with full-size inspection of affected captures. Review found narrow tabs, pagination/status intrinsic widths, fixed-width Suggestion Chips, missing word spaces in native Stagger Reveal, and React Flowing Lines inheriting a column layout; these are corrected and have behavioral regressions. Tall iframe captures now fit the source, decode artwork before measuring, and hide host navigation from component-only captures.
- Added typed data and controlled/uncontrolled APIs for tabs, pagination, pricing, and sortable tables across React, Vue, and Svelte. Native events, full row payloads, and panel/cell composition are documented.
- Added live integration examples at `/examples/react`, `/examples/vue`, and `/examples/svelte`, with custom records, controlled state, slots/snippets/render functions, reset/empty/recovery controls, and real form integration. The same examples build against packed packages in clean Next.js, Nuxt, and SvelteKit consumers.
- Hardened native runtime readiness, timeout/retry using a fresh iframe, framework switching, rapid replay cancellation, host identity checks, and offscreen pause. A WebKit message-source difference is addressed without weakening origin/source validation.
- Rendered the catalog on the server to avoid the late Suspense fallback layout shift and preserve browsing without JavaScript. Rapid filter edits now compose synchronously through Next.js-supported history updates instead of competing server navigations. Controls enable after hydration so early input cannot be overwritten while their handlers initialize.
- Added actual shadcn CLI installation checks for each framework, release guidance, changelog, compatibility notes, contributor tasks, showcase guidance, and mobile lab performance measurements.
- Corrected the public motion handbook and formatted authored files. Formatting-only changes to existing configuration/docs are maintenance changes, distinct from the functional remediation. An isolated review patch for 20 formatting-only files is saved locally at `tmp/readiness-formatting-only.patch`; no commits or staging have been performed.

## Verification

The production build and package gate passed: lint, TypeScript, 32 unit tests across eight files, 55-design registry validation, 244 generated Next.js pages, and three inspected tarballs containing 55 exports each.

- `pnpm test:install` passed all 165 independently compiled source artifacts, three 55-export packages, and clean Next.js, Nuxt, and SvelteKit consumer builds including the custom integration examples.
- `pnpm test:install:cli` passed the actual shadcn add command in three configured consumers, checking installed source closures, declared dependencies, and preserved notices. It samples Animated Tabs per framework; it does not assert every CLI-transformed artifact compiles.
- `pnpm performance:smoke` passed 36 production-page samples: no document overflow, no uncaught errors, zero observed CLS, and initial encoded JavaScript within 400 KiB mobile / 600 KiB desktop limits.
- `pnpm format:check`, `pnpm audit --prod`, tracked-file hygiene, and `git diff --check` passed. The production audit reports no known vulnerabilities.
- The complete Chromium, Firefox, and WebKit run passed **1,161 / 1,161** cases with snapshot updates disabled: 642 behavior cases and 519 visual cases comparing 2,004 reviewed PNGs. After the final narrow Suggestion Chips layout adjustment, all 18 affected behavior/visual cases passed again across the three engines with snapshot updates disabled. Its mobile/desktop captures were reviewed before this comparison, and the full build/package and 165-source consumer gates passed again. The earlier full comparison passed 1,154 of 1,158 cases; its two Firefox recovery timeouts, WebKit lost-filter reproduction, and aborted-prefetch error informed the final fixes. Prefetch cancellation is no longer induced by the bulk test navigating away before requests finish; uncaught errors remain asserted.

## Evidence boundaries

The full catalog remains provisional. The automated matrix demonstrates default interactions, settled themes, accessibility scans, mobile/desktop bounds, motion/visibility behavior, and reviewed reduced-motion captures. Deep custom-input/event/composition acceptance covers the four newly reusable designs and async recovery examples; it does not establish every other design's full contract. Unmount/remount and stale-runtime regressions do not constitute exhaustive leak profiling. Physical devices, manual assistive-technology testing, 200% zoom, field INP/LCP, sustained animation/GPU performance, and independent consumer adoption remain future acceptance work.

Visual differences in typography and structure between existing framework ports are preserved in their own reviewed baselines; baseline approval does not assert pixel parity between frameworks. Internal table/TOC scrolling and decorative animated text cropping are intentional; document overflow is not.

npm packages remain unpublished, the existing version remains 0.2.0, and no deployment, release tag, or public release was made. Tagged release discipline is documented for a reviewed versioned release. CI retains its single lightweight Linux `check:quick` job; comprehensive checks remain explicit release commands.

## Follow-up

Use the scoped tasks in [contributor backlog](contributor-backlog.md) to finish remaining source contracts and collect real consumer evidence before promoting verification or adding designs. See [compatibility](compatibility.md), [release checklist](releasing.md), and [performance review](performance-review-2026-10-07.md).
