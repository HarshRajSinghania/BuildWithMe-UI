import { defineManifest } from '../../schema';
export default defineManifest({
  schemaVersion: 2,
  id: 'precision-pagination',
  title: 'Precision pagination',
  summary: 'A compact pagination control with explicit current-page state and large targets.',
  domains: ['navigation'],
  tags: ['pagination', 'navigation', 'pages', 'adapted'],
  status: 'new',
  engines: ['css'],
  frameworks: {
    react: {
      source: 'designs/precision-pagination/react.tsx',
      exportName: 'PrecisionPagination',
      usage:
        'import PrecisionPagination from "@/components/buildwithme/precision-pagination/react";\n\n<PrecisionPagination />',
      dependencies: {},
    },
    vue: {
      source: 'designs/precision-pagination/vue.vue',
      exportName: 'PrecisionPagination',
      usage:
        '<script setup lang="ts">\nimport PrecisionPagination from "~/components/buildwithme/precision-pagination/vue.vue";\n</script>\n\n<template>\n  <PrecisionPagination />\n</template>',
      dependencies: {},
    },
    svelte: {
      source: 'designs/precision-pagination/svelte.svelte',
      exportName: 'PrecisionPagination',
      usage:
        '<script lang="ts">\nimport PrecisionPagination from "$lib/components/buildwithme/precision-pagination/svelte.svelte";\n</script>\n\n<PrecisionPagination />',
      dependencies: {},
    },
  },
  installation: {
    npm: true,
    source: true,
    copy: true,
  },
  accessibility: {
    summary:
      'Uses semantic controls, visible focus, theme-aware contrast, and reduced-motion fallbacks.',
    features: [
      'Keyboard reachable controls',
      'Visible focus treatment',
      'Reduced-motion friendly',
      'Dark and light themes',
    ],
  },
  props: [
    {
      name: 'label',
      type: 'string',
      default: 'Precision pagination',
      description: 'Accessible display label.',
    },
    {
      name: 'paused',
      type: 'boolean',
      default: 'false',
      description: 'Pauses decorative animation.',
    },
    {
      name: 'page',
      type: 'number',
      default: 'uncontrolled',
      description: 'Controlled one-based page; Vue supports v-model:page.',
    },
    {
      name: 'defaultPage',
      type: 'number',
      default: '2',
      description: 'Initial uncontrolled page.',
    },
    {
      name: 'pageCount',
      type: 'number',
      default: '4',
      description: 'Total pages; non-finite or non-positive values render one page.',
    },
    {
      name: 'onPageChange',
      type: '(page: number) => void',
      default: 'undefined',
      description: 'React/Svelte callback; Vue emits page-change and update:page.',
    },
  ],
  provenance: {
    type: 'adapted',
    creator: {
      name: 'BuildWithMe-UI contributors',
    },
    license: 'MIT',
    upstreamUrl:
      'https://github.com/vercel/registry-starter/blob/main/src/components/ui/pagination.tsx',
    upstreamAuthor: 'Vercel, Inc.',
    upstreamLicense: 'MIT',
    modification:
      'Reimplemented as a dependency-light, monochrome, theme-aware design with React, Vue, and Svelte source variants and reduced-motion behavior. Kinetic Playground repair (2026-10-05): framework-native behavior, scoped motion lifecycle, complete source closure, and corrected source usage; original upstream notices retained. Readiness update (2026-10-07): configurable page count, controlled page and native framework change events.',
  },
  related: [],
  style: 'designs/precision-pagination/precision-pagination.css',
});
