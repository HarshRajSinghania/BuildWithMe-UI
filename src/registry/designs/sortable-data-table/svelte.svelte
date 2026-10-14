<!-- MIT · BuildWithMe-UI contributors. Original implementation. -->
<script lang="ts">
  import { untrack, type Snippet } from 'svelte';
  import {
    defaultRows,
    defaultTableSort,
    sortRows,
    nextSort,
    type TableOptions,
    type TableRow,
    type SortKey,
  } from '../../shared/component-data';
  import '../../shared/base.css';
  import './sortable-data-table.css';
  let {
    label = 'Sortable data table',
    className = '',
    rows = defaultRows,
    sort,
    defaultSort = defaultTableSort,
    selectedId,
    onSortChange,
    onSelect,
    cell,
  }: TableOptions & { cell?: Snippet<[TableRow, SortKey]> } = $props();
  let localSort = $state(untrack(() => defaultSort));
  let localSelected = $state('');
  const currentSort = $derived(sort ?? localSort);
  const sorted = $derived(sortRows(rows, currentSort));
  const selected = $derived(rows.find((row) => row.id === (selectedId ?? localSelected)));
  function updateSort(key: SortKey) {
    const next = nextSort(currentSort, key);
    if (sort === undefined) localSort = next;
    onSortChange?.(next);
  }
  function choose(row: TableRow) {
    if (selectedId === undefined) localSelected = row.id;
    onSelect?.(row);
  }
</script>

<section class={`bw-demo bwm-sortable-data-table ${className}`}>
  <div class="bwm-table-shell">
    <div class="bwm-table-meta" aria-hidden="true">
      <span>System index</span><span>{rows.length.toString().padStart(2, '0')} records</span>
    </div>
    <div class="bwm-table-scroll">
      <table class="bwm-table">
        <caption class="bw-sr-only">{label}</caption>
        <thead
          ><tr>
            {#each ['name', 'status'] as key (key)}
              <th
                scope="col"
                aria-sort={currentSort.key === key ? currentSort.direction : undefined}
              >
                <button type="button" onclick={() => updateSort(key as SortKey)}
                  >{key === 'name' ? 'Name' : 'Status'}<span aria-hidden="true"
                    >{currentSort.key === key
                      ? currentSort.direction === 'ascending'
                        ? '↑'
                        : '↓'
                      : '↕'}</span
                  ></button
                >
              </th>
            {/each}
            <th scope="col" class="bwm-action-heading">Action</th>
          </tr></thead
        >
        <tbody
          >{#each sorted as row (row.id)}<tr>
              <td
                ><span class="bwm-row-marker" aria-hidden="true"></span>{#if cell}{@render cell(
                    row,
                    'name',
                  )}{:else}{row.name}{/if}</td
              >
              <td
                ><span class={`bwm-status bwm-status-${row.status.toLowerCase()}`}
                  >{#if cell}{@render cell(row, 'status')}{:else}{row.status}{/if}</span
                ></td
              >
              <td
                ><button
                  type="button"
                  class="bwm-row-action"
                  aria-label={`Inspect ${row.name}`}
                  onclick={() => choose(row)}>Inspect</button
                ></td
              >
            </tr>{/each}</tbody
        >
      </table>
    </div>
    <p class="bwm-table-status" role="status" aria-live="polite">
      {!rows.length
        ? 'No records available.'
        : selected
          ? `Selected ${selected.name}.`
          : 'Select a record to inspect.'}
    </p>
  </div>
</section>
