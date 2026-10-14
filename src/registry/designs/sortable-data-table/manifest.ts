import { defineManifest } from '../../schema';

export default defineManifest({
  schemaVersion: 2,
  id: 'sortable-data-table',
  title: 'Sortable data table',
  summary: 'A dense data table with accessible sorting and row actions.',
  domains: ['data-display'],
  tags: ['table', 'sort', 'data'],
  status: 'new',
  engines: ['css'],
  frameworks: {
    react: {
      source: 'designs/sortable-data-table/react.tsx',
      exportName: 'SortableDataTable',
      usage:
        'import SortableDataTable from "@/components/buildwithme/sortable-data-table/react";\n\n<SortableDataTable />',
      dependencies: {},
    },
    vue: {
      source: 'designs/sortable-data-table/vue.vue',
      exportName: 'SortableDataTable',
      usage:
        '<script setup lang="ts">\nimport SortableDataTable from "~/components/buildwithme/sortable-data-table/vue.vue";\n</script>\n\n<template>\n  <SortableDataTable />\n</template>',
      dependencies: {},
    },
    svelte: {
      source: 'designs/sortable-data-table/svelte.svelte',
      exportName: 'SortableDataTable',
      usage:
        '<script lang="ts">\nimport SortableDataTable from "$lib/components/buildwithme/sortable-data-table/svelte.svelte";\n</script>\n\n<SortableDataTable />',
      dependencies: {},
    },
  },
  installation: {
    npm: true,
    source: true,
    copy: true,
  },
  accessibility: {
    summary: 'Uses semantic controls, visible focus, and motion-safe interaction.',
    features: ['Keyboard reachable controls', 'Visible focus treatment', 'Reduced-motion friendly'],
  },
  props: [
    {
      name: 'label',
      type: 'string',
      default: 'Sortable data table',
      description: 'Accessible display label.',
    },
    {
      name: 'className',
      type: 'string',
      default: '',
      description: 'Additional root CSS class.',
    },
    {
      name: 'rows',
      type: 'readonly TableRow[]',
      default: 'built-in rows',
      description: 'Records with unique IDs, names, and statuses.',
    },
    {
      name: 'sort',
      type: 'TableSort',
      default: 'uncontrolled',
      description: 'Controlled key/direction; Vue supports v-model:sort.',
    },
    {
      name: 'defaultSort',
      type: 'TableSort',
      default: 'name ascending',
      description: 'Initial uncontrolled sort.',
    },
    {
      name: 'selectedId',
      type: 'string',
      default: 'uncontrolled',
      description: 'Controlled selected record ID; Vue supports v-model:selected-id.',
    },
    {
      name: 'onSortChange',
      type: '(sort: TableSort) => void',
      default: 'undefined',
      description: 'React/Svelte callback; Vue emits sort-change and update:sort.',
    },
    {
      name: 'onSelect',
      type: '(row: TableRow) => void',
      default: 'undefined',
      description: 'Full selected record; Vue emits select and update:selectedId.',
    },
    {
      name: 'renderCell / cell',
      type: 'render function / slot / snippet',
      default: 'row[column]',
      description:
        'React renderCell(row, column), Vue #cell={row,column}, Svelte cell(row,column).',
    },
  ],
  provenance: {
    type: 'original',
    creator: {
      name: 'BuildWithMe-UI contributors',
    },
    license: 'MIT',
  },
  related: [],
  style: 'designs/sortable-data-table/sortable-data-table.css',
});
