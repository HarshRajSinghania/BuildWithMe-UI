<!-- Adapted from https://github.com/vercel/registry-starter/blob/main/src/components/ui/pagination.tsx under MIT. Copyright (c) Vercel, Inc.. -->
<script lang="ts">
  import { untrack } from 'svelte';
  import {
    clampPage,
    pageCount as normalizeCount,
    paginationItems,
    type PaginationOptions,
  } from '../../shared/component-data';
  import { observeMotion } from '../../shared/motion-lifecycle';

  import '../../shared/base.css';
  import './precision-pagination.css';
  let {
    label = 'Precision pagination',
    paused = false,
    page,
    defaultPage = 2,
    pageCount = 4,
    onPageChange,
  }: PaginationOptions = $props();
  let root: HTMLDivElement;
  let active = $state(false);
  let reduced = $state(true);
  const uid = $props.id();
  $effect(() => {
    if (!root) return;
    const lifecycle = observeMotion(
      root,
      (state) => {
        active = state.active;
        reduced = state.reduced;
      },
      paused,
    );
    return () => lifecycle.destroy();
  });
  let localPage = $state(untrack(() => defaultPage));
  const count = $derived(normalizeCount(pageCount));
  const current = $derived(clampPage(page ?? localPage, count));
  function choose(next: number) {
    const value = clampPage(next, count);
    if (value === current) return;
    if (page === undefined) localPage = value;
    onPageChange?.(value);
  }
</script>

<div bind:this={root} class="bw-demo" data-active={active} data-component="precision-pagination">
  <nav class="adapt-pagination" aria-label={label}>
    <button
      type="button"
      aria-label="Previous page"
      disabled={current === 1}
      onclick={() => choose(current - 1)}>←</button
    >
    {#each paginationItems(current, count) as n (n)}
      {#if typeof n === 'number'}<button
          type="button"
          aria-current={current === n ? 'page' : undefined}
          onclick={() => choose(n)}>{n}</button
        >
      {:else}<span aria-hidden="true">…</span>{/if}
    {/each}
    <button
      type="button"
      aria-label="Next page"
      disabled={current === count}
      onclick={() => choose(current + 1)}>→</button
    >
  </nav>
</div>
