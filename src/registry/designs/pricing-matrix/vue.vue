<!-- MIT · BuildWithMe-UI contributors. Original implementation. -->
<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  defaultPlans,
  planPrice,
  type PricingPlan,
  type Billing,
} from '../../shared/component-data';
import '../../shared/base.css';
import './pricing-matrix.css';
const props = withDefaults(
  defineProps<{
    label?: string;
    className?: string;
    plans?: readonly PricingPlan[];
    billing?: Billing;
    defaultBilling?: Billing;
    selectedPlan?: string;
  }>(),
  { label: 'Pricing matrix', className: '', plans: () => defaultPlans, defaultBilling: 'monthly' },
);
const emit = defineEmits<{
  'update:billing': [billing: Billing];
  billingChange: [billing: Billing];
  'update:selectedPlan': [id: string];
  planSelect: [id: string];
}>();
const localBilling = ref<Billing>(props.defaultBilling);
const localSelected = ref('');
const currentBilling = computed(() => props.billing ?? localBilling.value);
const selected = computed(() =>
  props.plans.find((plan) => plan.id === (props.selectedPlan ?? localSelected.value)),
);
function toggle() {
  const next = currentBilling.value === 'monthly' ? 'yearly' : 'monthly';
  if (props.billing === undefined) localBilling.value = next;
  emit('update:billing', next);
  emit('billingChange', next);
}
function choose(id: string) {
  if (props.selectedPlan === undefined) localSelected.value = id;
  emit('update:selectedPlan', id);
  emit('planSelect', id);
}
</script>
<template>
  <section :class="`bw-demo bwm-pricing-matrix ${props.className}`">
    <div class="bwm-pricing">
      <h3>{{ props.label }}</h3>
      <div class="bwm-row">
        <small>Example plans · no checkout</small>
        <button
          type="button"
          class="bwm-control"
          :aria-pressed="currentBilling === 'yearly'"
          @click="toggle"
        >
          Yearly billing {{ currentBilling === 'yearly' ? '✓' : '○' }}
        </button>
      </div>
      <div class="bwm-plans">
        <article v-for="plan in props.plans" :key="plan.id" class="bwm-panel">
          <h4>{{ plan.name }}</h4>
          <strong>${{ planPrice(plan, currentBilling) }}<small> / month</small></strong>
          <ul>
            <li v-for="(feature, i) in plan.features" :key="i">{{ feature }}</li>
          </ul>
          <button type="button" :aria-pressed="selected?.id === plan.id" @click="choose(plan.id)">
            Choose {{ plan.name }}
          </button>
        </article>
      </div>
      <p role="status">
        {{
          !props.plans.length
            ? 'No plans available.'
            : selected
              ? `${selected.name} selected locally.`
              : 'Find room for your next idea.'
        }}
      </p>
    </div>
  </section>
</template>
