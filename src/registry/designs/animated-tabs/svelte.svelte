<!-- MIT · BuildWithMe-UI contributors. Original implementation. -->
<script lang="ts">
  import { tick, untrack, type Snippet } from 'svelte';
  import {
    defaultTabs,
    selectedTab,
    type TabItem,
    type TabsOptions,
  } from '../../shared/component-data';
  import { observeMotion } from '../../shared/motion-lifecycle';

  import '../../shared/base.css';
  import './animated-tabs.css';
  let {
    paused = false,
    items = defaultTabs,
    value,
    defaultValue,
    label = 'Workflow',
    onValueChange,
    panel,
  }: TabsOptions & { panel?: Snippet<[TabItem]> } = $props();
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
  let localValue = $state<string | undefined>(untrack(() => defaultValue ?? items[0]?.id));
  const selected = $derived(selectedTab(items, value ?? localValue));
  function choose(next: string) {
    if (value === undefined) localValue = next;
    onValueChange?.(next);
  }
  async function navigate(event: KeyboardEvent, index: number) {
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? items.length - 1
          : event.key === 'ArrowRight'
            ? (index + 1) % items.length
            : event.key === 'ArrowLeft'
              ? (index + items.length - 1) % items.length
              : -1;
    if (next < 0) return;
    event.preventDefault();
    choose(items[next].id);
    await tick();
    root?.querySelectorAll<HTMLButtonElement>('[role=tab]')[next]?.focus();
  }
</script>

<div bind:this={root} class="bw-demo" data-active={active} data-component="animated-tabs">
  <div class="bw-tab-box">
    {#if selected}
      <div class="bw-tabs" role="tablist" aria-label={label}>
        {#each items as item, index (item.id)}
          <button
            type="button"
            id={`${uid}-tab-${index}`}
            role="tab"
            aria-selected={selected.id === item.id}
            aria-controls={`${uid}-panel`}
            tabindex={selected.id === item.id ? 0 : -1}
            onclick={() => choose(item.id)}
            onkeydown={(event) => navigate(event, index)}
          >
            {#if selected.id === item.id}<span class="bw-tab-indicator"></span>{/if}<span
              >{item.label}</span
            >
          </button>
        {/each}
      </div>
      <div
        class="bw-description bw-tab-copy"
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${items.indexOf(selected)}`}
        tabindex="0"
      >
        {#if panel}{@render panel(selected)}{:else}{selected.content}{/if}
      </div>
    {:else}<p class="bw-description">No tabs available.</p>{/if}
  </div>
</div>
