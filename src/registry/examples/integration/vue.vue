<!-- MIT · BuildWithMe-UI contributors. Original consumer example. -->
<script setup lang="ts">
import { ref } from 'vue';
import AnimatedTabs from '../../designs/animated-tabs/vue.vue';
import PrecisionPagination from '../../designs/precision-pagination/vue.vue';
import PricingMatrix from '../../designs/pricing-matrix/vue.vue';
import SortableDataTable from '../../designs/sortable-data-table/vue.vue';
import AsyncStatusButton from '../../designs/async-status-button/vue.vue';
import MagneticButton from '../../designs/magnetic-button/vue.vue';
import BorderTraceButton from '../../designs/border-trace-button/vue.vue';
import PressDepthButton from '../../designs/press-depth-button/vue.vue';
import ShimmerButton from '../../designs/shimmer-button/vue.vue';
import { defaultTableSort, type Billing, type TableSort } from '../../shared/component-data';
import { exampleTabs, exampleRows, examplePlans } from './data';
import './examples.css';
const tab = ref('overview');
const page = ref(1);
const billing = ref<Billing>('monthly');
const plan = ref('');
const sort = ref<TableSort>(defaultTableSort);
const row = ref('');
const empty = ref(false);
const mounted = ref(true);
const hold = ref(false);
const reject = ref(false);
const lastEvent = ref('Ready.');
const submissions = ref(0);
function update(name: string, value: unknown, commit: () => void) {
  lastEvent.value = JSON.stringify({ event: name, value });
  if (!hold.value) commit();
}
function reset() {
  tab.value = 'overview';
  page.value = 1;
  billing.value = 'monthly';
  plan.value = '';
  sort.value = defaultTableSort;
  row.value = '';
  lastEvent.value = 'Ready.';
}
async function save() {
  await new Promise((resolve) => setTimeout(resolve, 50));
  if (reject.value) {
    reject.value = false;
    throw new Error('Example rejection');
  }
  lastEvent.value = JSON.stringify({ event: 'save', value: 'complete' });
}
</script>
<template>
  <div class="bwm-examples">
    <p>Custom data, controlled state, composition, and callbacks in a small application.</p>
    <div class="example-actions">
      <button type="button" @click="empty = !empty">
        {{ empty ? 'Restore example data' : 'Show empty state' }}
      </button>
      <button type="button" @click="mounted = !mounted">
        {{ mounted ? 'Hide components' : 'Show components' }}
      </button>
      <button type="button" @click="reset">Reset selections</button>
      <label><input type="checkbox" v-model="hold" />Hold controlled values</label>
    </div>
    <output class="example-events" aria-label="Last component event">{{ lastEvent }}</output>
    <form class="example-form" @submit.prevent="submissions++">
      <div v-if="mounted" class="example-grid">
        <section data-example="tabs">
          <h2>Project tabs</h2>
          <AnimatedTabs
            :items="empty ? [] : exampleTabs"
            :value="tab"
            @value-change="(v) => update('tab', v, () => (tab = v))"
            ><template #panel="{ item }"
              ><strong>Custom panel: {{ item.content }}</strong></template
            ></AnimatedTabs
          >
        </section>
        <section data-example="pagination">
          <h2>Project pages</h2>
          <PrecisionPagination
            :page="page"
            :page-count="empty ? 0 : 8"
            @page-change="(v) => update('page', v, () => (page = v))"
          />
        </section>
        <section data-example="pricing">
          <h2>Project plans</h2>
          <PricingMatrix
            :plans="empty ? [] : examplePlans"
            :billing="billing"
            :selected-plan="plan"
            @billing-change="(v) => update('billing', v, () => (billing = v))"
            @plan-select="(v) => update('plan', v, () => (plan = v))"
          />
        </section>
        <section data-example="table">
          <h2>Project records</h2>
          <SortableDataTable
            :rows="empty ? [] : exampleRows"
            :sort="sort"
            :selected-id="row"
            @sort-change="(v) => update('sort', v, () => (sort = v))"
            @select="(v) => update('row', v, () => (row = v.id))"
            ><template #cell="{ row: record, column }"
              ><strong v-if="column === 'name'">{{ record.name }}</strong
              ><template v-else>{{ record.status }}</template></template
            ></SortableDataTable
          >
        </section>
        <section data-example="async">
          <h2>Save with recovery</h2>
          <div class="example-actions">
            <button type="button" @click="reject = true">Reject next save</button>
          </div>
          <AsyncStatusButton :on-action="save" />
        </section>
        <section data-example="actions">
          <h2>Actions inside a form</h2>
          <MagneticButton /><BorderTraceButton /><PressDepthButton /><ShimmerButton />
        </section>
      </div>
      <div class="example-actions"><button type="submit">Submit application form</button></div>
      <output class="example-events" aria-label="Form submissions">{{ submissions }}</output>
    </form>
  </div>
</template>
