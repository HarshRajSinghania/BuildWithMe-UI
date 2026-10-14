<!-- MIT · BuildWithMe-UI contributors. Original implementation. -->
<script lang="ts">
  import { untrack } from 'svelte';
  import {
    defaultPlans,
    planPrice,
    type Billing,
    type PricingOptions,
  } from '../../shared/component-data';
  import '../../shared/base.css';
  import './pricing-matrix.css';
  let {
    label = 'Pricing matrix',
    className = '',
    plans = defaultPlans,
    billing,
    defaultBilling = 'monthly',
    selectedPlan,
    onBillingChange,
    onPlanSelect,
  }: PricingOptions = $props();
  let localBilling = $state<Billing>(untrack(() => defaultBilling));
  let localSelected = $state('');
  const currentBilling = $derived(billing ?? localBilling);
  const selected = $derived(plans.find((plan) => plan.id === (selectedPlan ?? localSelected)));
  function toggle() {
    const next = currentBilling === 'monthly' ? 'yearly' : 'monthly';
    if (billing === undefined) localBilling = next;
    onBillingChange?.(next);
  }
  function choose(id: string) {
    if (selectedPlan === undefined) localSelected = id;
    onPlanSelect?.(id);
  }
</script>

<section class={`bw-demo bwm-pricing-matrix ${className}`}>
  <div class="bwm-pricing">
    <h3>{label}</h3>
    <div class="bwm-row">
      <small>Example plans · no checkout</small>
      <button
        type="button"
        class="bwm-control"
        aria-pressed={currentBilling === 'yearly'}
        onclick={toggle}>Yearly billing {currentBilling === 'yearly' ? '✓' : '○'}</button
      >
    </div>
    <div class="bwm-plans">
      {#each plans as plan (plan.id)}<article class="bwm-panel">
          <h4>{plan.name}</h4>
          <strong>${planPrice(plan, currentBilling)}<small> / month</small></strong>
          <ul>
            {#each plan.features as feature, i (i)}<li>{feature}</li>{/each}
          </ul>
          <button
            type="button"
            aria-pressed={selected?.id === plan.id}
            onclick={() => choose(plan.id)}>Choose {plan.name}</button
          >
        </article>{/each}
    </div>
    <p role="status">
      {!plans.length
        ? 'No plans available.'
        : selected
          ? `${selected.name} selected locally.`
          : 'Find room for your next idea.'}
    </p>
  </div>
</section>
