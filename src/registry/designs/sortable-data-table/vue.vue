<!-- MIT · BuildWithMe-UI contributors. Original implementation. -->
<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  defaultRows,
  defaultTableSort,
  sortRows,
  nextSort,
  type TableRow,
  type TableSort,
  type SortKey,
} from '../../shared/component-data';
import '../../shared/base.css';
import './sortable-data-table.css';
const props = withDefaults(
  defineProps<{
    label?: string;
    className?: string;
    rows?: readonly TableRow[];
    sort?: TableSort;
    defaultSort?: TableSort;
    selectedId?: string;
  }>(),
  {
    label: 'Sortable data table',
    className: '',
    rows: () => defaultRows,
    defaultSort: () => defaultTableSort,
  },
);
const emit = defineEmits<{
  'update:sort': [sort: TableSort];
  sortChange: [sort: TableSort];
  'update:selectedId': [id: string];
  select: [row: TableRow];
}>();
const localSort = ref(props.defaultSort);
const localSelected = ref('');
const currentSort = computed(() => props.sort ?? localSort.value);
const sorted = computed(() => sortRows(props.rows, currentSort.value));
const selected = computed(() =>
  props.rows.find((row) => row.id === (props.selectedId ?? localSelected.value)),
);
function updateSort(key: SortKey) {
  const next = nextSort(currentSort.value, key);
  if (props.sort === undefined) localSort.value = next;
  emit('update:sort', next);
  emit('sortChange', next);
}
function choose(row: TableRow) {
  if (props.selectedId === undefined) localSelected.value = row.id;
  emit('update:selectedId', row.id);
  emit('select', row);
}
</script>
<template>
  <section :class="`bw-demo bwm-sortable-data-table ${props.className}`">
    <div class="bwm-table-shell">
      <div class="bwm-table-meta" aria-hidden="true">
        <span>System index</span
        ><span>{{ props.rows.length.toString().padStart(2, '0') }} records</span>
      </div>
      <div class="bwm-table-scroll">
        <table class="bwm-table">
          <caption class="bw-sr-only">
            {{
              props.label
            }}
          </caption>
          <thead>
            <tr>
              <th
                v-for="key in ['name', 'status'] as const"
                :key="key"
                scope="col"
                :aria-sort="currentSort.key === key ? currentSort.direction : undefined"
              >
                <button type="button" @click="updateSort(key)">
                  {{ key === 'name' ? 'Name' : 'Status'
                  }}<span aria-hidden="true">{{
                    currentSort.key === key
                      ? currentSort.direction === 'ascending'
                        ? '↑'
                        : '↓'
                      : '↕'
                  }}</span>
                </button>
              </th>
              <th scope="col" class="bwm-action-heading">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in sorted" :key="row.id">
              <td>
                <span class="bwm-row-marker" aria-hidden="true" /><slot
                  name="cell"
                  :row="row"
                  column="name"
                  >{{ row.name }}</slot
                >
              </td>
              <td>
                <span :class="`bwm-status bwm-status-${row.status.toLowerCase()}`"
                  ><slot name="cell" :row="row" column="status">{{ row.status }}</slot></span
                >
              </td>
              <td>
                <button
                  type="button"
                  class="bwm-row-action"
                  :aria-label="`Inspect ${row.name}`"
                  @click="choose(row)"
                >
                  Inspect
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="bwm-table-status" role="status" aria-live="polite">
        {{
          !props.rows.length
            ? 'No records available.'
            : selected
              ? `Selected ${selected.name}.`
              : 'Select a record to inspect.'
        }}
      </p>
    </div>
  </section>
</template>
