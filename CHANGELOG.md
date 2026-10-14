# Changelog

## Unreleased — readiness remediation

### Added

- Custom records, plans, tab items, controlled state, native change events, and tab/table composition across React, Vue, and Svelte.
- Live integration examples at `/examples/react`, `/examples/vue`, and `/examples/svelte`, including empty data, callback payloads, controlled values, form actions, and save recovery.
- Separate behavioral and visual browser suites, complete iframe bounds checks, component accessibility scans, motion lifecycle checks, actual CLI installation checks, and a repeatable production performance sampler.
- Compatibility documentation, a manual release checklist, and a focused contributor backlog.
- Framework-specific existing-application setup, workbench source-file guidance, and CLI-installed consumer type/build/interaction verification.

### Fixed

- Vulnerable Sharp and source-map-js transitive dependencies.
- Next.js security advisories affecting 16.3.6, with the application and consumer fixtures pinned to patched 16.3.8.
- Unchecked array access exposed by Nuxt's default TypeScript configuration in shared helpers and Vue tabs navigation.
- Narrow Vue/Svelte preview roots, invalid Flip Text labeling, and unintended React button form submissions.
- Inherited homepage canonicals on other pages; standalone previews are now non-indexable.
- Framework preview bootstrap timeout, retry by reload after errors, and off-screen pausing.
- Accessible async action labels in Vue/Svelte and stable action labels with custom React table cells.
- Catalog hydration layout shift: filters and cards now render in the first server response. Rapid filter changes preserve all URL values.
- Narrow tabs/pagination/status badges, missing native Stagger Reveal spacing, and React Flowing Lines orientation.
- Outdated motion documentation and formatting inconsistencies.

Existing component IDs, exports, default data, licensing, and upstream notices are preserved. Package publication and deployment remain separate release actions. Framework verification remains provisional until the full acceptance contract is satisfied.

## 0.2.0 — existing source ecosystem

- 55 designs and 165 React, Vue, and Svelte sources with typed manifests, isolated previews, source closure generation, provenance, and package verification tooling.
- This entry describes the existing package version; it does not imply that npm packages or a historical GitHub release were published.
