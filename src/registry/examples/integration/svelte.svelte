<!-- MIT · BuildWithMe-UI contributors. Original consumer example. -->
<script lang="ts">
  import AnimatedTabs from '../../designs/animated-tabs/svelte.svelte';
  import PrecisionPagination from '../../designs/precision-pagination/svelte.svelte';
  import PricingMatrix from '../../designs/pricing-matrix/svelte.svelte';
  import SortableDataTable from '../../designs/sortable-data-table/svelte.svelte';
  import AsyncStatusButton from '../../designs/async-status-button/svelte.svelte';
  import MagneticButton from '../../designs/magnetic-button/svelte.svelte';
  import BorderTraceButton from '../../designs/border-trace-button/svelte.svelte';
  import PressDepthButton from '../../designs/press-depth-button/svelte.svelte';
  import ShimmerButton from '../../designs/shimmer-button/svelte.svelte';
  import { defaultTableSort, type Billing, type TableSort } from '../../shared/component-data';
  import { exampleTabs, exampleRows, examplePlans } from './data';
  import './examples.css';
  let tab = $state('overview');
  let page = $state(1);
  let billing = $state<Billing>('monthly');
  let plan = $state('');
  let sort = $state<TableSort>(defaultTableSort);
  let row = $state('');
  let empty = $state(false);
  let mounted = $state(true);
  let hold = $state(false);
  let reject = $state(false);
  let lastEvent = $state('Ready.');
  let submissions = $state(0);
  function update(name: string, value: unknown, commit: () => void) {
    lastEvent = JSON.stringify({ event: name, value });
    if (!hold) commit();
  }
  function reset() {
    tab = 'overview';
    page = 1;
    billing = 'monthly';
    plan = '';
    sort = defaultTableSort;
    row = '';
    lastEvent = 'Ready.';
  }
  async function save() {
    await new Promise((resolve) => setTimeout(resolve, 50));
    if (reject) {
      reject = false;
      throw new Error('Example rejection');
    }
    lastEvent = JSON.stringify({ event: 'save', value: 'complete' });
  }
</script>

<div class="bwm-examples">
  <p>Custom data, controlled state, composition, and callbacks in a small application.</p>
  <div class="example-actions">
    <button type="button" onclick={() => (empty = !empty)}
      >{empty ? 'Restore example data' : 'Show empty state'}</button
    >
    <button type="button" onclick={() => (mounted = !mounted)}
      >{mounted ? 'Hide components' : 'Show components'}</button
    >
    <button type="button" onclick={reset}>Reset selections</button>
    <label><input type="checkbox" bind:checked={hold} />Hold controlled values</label>
  </div>
  <output class="example-events" aria-label="Last component event">{lastEvent}</output>
  <form
    class="example-form"
    onsubmit={(event) => {
      event.preventDefault();
      submissions++;
    }}
  >
    {#if mounted}<div class="example-grid">
        <section data-example="tabs">
          <h2>Project tabs</h2>
          <AnimatedTabs
            items={empty ? [] : exampleTabs}
            value={tab}
            onValueChange={(v) => update('tab', v, () => (tab = v))}
            >{#snippet panel(item)}<strong>Custom panel: {item.content}</strong
              >{/snippet}</AnimatedTabs
          >
        </section>
        <section data-example="pagination">
          <h2>Project pages</h2>
          <PrecisionPagination
            {page}
            pageCount={empty ? 0 : 8}
            onPageChange={(v) => update('page', v, () => (page = v))}
          />
        </section>
        <section data-example="pricing">
          <h2>Project plans</h2>
          <PricingMatrix
            plans={empty ? [] : examplePlans}
            {billing}
            selectedPlan={plan}
            onBillingChange={(v) => update('billing', v, () => (billing = v))}
            onPlanSelect={(v) => update('plan', v, () => (plan = v))}
          />
        </section>
        <section data-example="table">
          <h2>Project records</h2>
          <SortableDataTable
            rows={empty ? [] : exampleRows}
            {sort}
            selectedId={row}
            onSortChange={(v) => update('sort', v, () => (sort = v))}
            onSelect={(v) => update('row', v, () => (row = v.id))}
            >{#snippet cell(record, column)}{#if column === 'name'}<strong>{record.name}</strong
                >{:else}{record.status}{/if}{/snippet}</SortableDataTable
          >
        </section>
        <section data-example="async">
          <h2>Save with recovery</h2>
          <div class="example-actions">
            <button type="button" onclick={() => (reject = true)}>Reject next save</button>
          </div>
          <AsyncStatusButton onAction={save} />
        </section>
        <section data-example="actions">
          <h2>Actions inside a form</h2>
          <MagneticButton /><BorderTraceButton /><PressDepthButton /><ShimmerButton />
        </section>
      </div>{/if}
    <div class="example-actions"><button type="submit">Submit application form</button></div>
    <output class="example-events" aria-label="Form submissions">{submissions}</output>
  </form>
</div>
