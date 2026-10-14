# Compatibility and integration

The root application requires Node.js 22+ and pnpm 10.28.1. The local readiness review uses Node.js 24 on Windows; the lightweight GitHub job uses Node.js 24 on Linux.

| Target             | Verified consumer version            | Source usage                                                                                 |
| ------------------ | ------------------------------------ | -------------------------------------------------------------------------------------------- |
| React / Next.js    | React 19.3.0, Next.js 16.3.8         | Interactive sources preserve `use client`; import the complete installed closure.            |
| Vue / Nuxt         | Vue 3.5.43, Nuxt 4.5.2               | Vue 3 composition API; controlled props support native `v-model` update events.              |
| Svelte / SvelteKit | Svelte 5.57.1, SvelteKit 2.70.3      | Svelte 5 runes and snippets; controlled state uses callback props.                           |
| Browsers           | Playwright Chromium, Firefox, WebKit | Desktop and mobile viewport checks are lab coverage, not testing on physical mobile devices. |

These are tested versions, not claims that every older or newer framework version is compatible. Package peers and dependency versions are generated from authoritative manifests. npm packages remain unpublished.

## Data and controlled state

- Tab items have unique `id`, `label`, and optional `content` strings. `value` selects an ID; `defaultValue` initializes uncontrolled state. An invalid/removed ID displays the first remaining item; an empty list displays a readable empty state.
- Pagination uses one-based `page`, `defaultPage`, and `pageCount`. Counts/pages are floored and bounded; non-finite or non-positive counts display one page. Large counts display bounded page links and gaps.
- Pricing plans have unique `id`, `name`, `monthlyPrice`, optional `yearlyMonthlyPrice`, and `features`. Omitted yearly prices retain the original demonstration's rounded 20% discount. `billing` and `selectedPlan` are independently controllable. Pricing displays data; it does not integrate payments.
- Table records have unique `id`, `name`, and `status`. `sort` contains `key: 'name' | 'status'` and `direction: 'ascending' | 'descending'`. Sorting copies the record list; selection emits the complete record. `selectedId` controls the selected record.

Pass a controlled value together with its callback/event handler and update it in the application. Without a supplied controlled value, local state owns changes. Default values are initialization-only. Application data is never mutated by a component. Supply valid typed records and unique IDs.

| Component            | React / Svelte callbacks                       | Vue events and bindings                                                     |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------- |
| Animated Tabs        | `onValueChange(id)`                            | `value-change`, `v-model:value`                                             |
| Precision Pagination | `onPageChange(page)`                           | `page-change`, `v-model:page`                                               |
| Pricing Matrix       | `onBillingChange(billing)`, `onPlanSelect(id)` | `billing-change`, `plan-select`, `v-model:billing`, `v-model:selected-plan` |
| Sortable Data Table  | `onSortChange(sort)`, `onSelect(record)`       | `sort-change`, `select`, `v-model:sort`, `v-model:selected-id`              |

React uses `renderPanel(item)` and `renderCell(record, column)`. Vue uses named `panel` and `cell` slots with equivalent slot props. Svelte uses `panel(item)` and `cell(record, column)` snippets. The live examples demonstrate each form; their reviewed sources are under `src/registry/examples/integration/`.

## Installation paths

The shadcn CLI follows the consuming project's component aliases and source directory. A project with `src/` normally receives `src/components/buildwithme/<id>/`. Ensure `@/` or `~/` points to the appropriate application directory. For Svelte, place the delivered `components/buildwithme` tree under `src/lib` so `$lib/components/buildwithme` resolves, or adapt the import to its actual configured directory.

Keep all generated helper, CSS, LICENSE, and notice files together. The CLI smoke test exercises the advertised `pnpm dlx shadcn@latest add <registry-url>` command in configured fixtures, separately from compilation/package consumer checks.
