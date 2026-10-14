<!-- MIT · BuildWithMe-UI contributors. Original implementation. -->
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';
import { observeMotion } from '../../shared/motion-lifecycle';

import '../../shared/base.css';
import './animated-tabs.css';
import { defaultTabs, selectedTab, type TabItem } from '../../shared/component-data';
const props = withDefaults(
  defineProps<{
    paused?: boolean;
    items?: readonly TabItem[];
    value?: string;
    defaultValue?: string;
    label?: string;
  }>(),
  { paused: false, items: () => defaultTabs, label: 'Workflow' },
);
const emit = defineEmits<{ 'update:value': [value: string]; valueChange: [value: string] }>();
const root = ref<HTMLElement | null>(null);
const active = ref(false);
const reduced = ref(true);
const uid = useId();
let lifecycle: ReturnType<typeof observeMotion> | undefined;
onMounted(() => {
  if (root.value)
    lifecycle = observeMotion(
      root.value,
      (state) => {
        active.value = state.active;
        reduced.value = state.reduced;
      },
      props.paused,
    );
});
watch(
  () => props.paused,
  (value) => lifecycle?.setPaused(Boolean(value)),
);
onBeforeUnmount(() => lifecycle?.destroy());
const localValue = ref(props.defaultValue ?? props.items[0]?.id);
const selected = computed(() => selectedTab(props.items, props.value ?? localValue.value));
function choose(value: string) {
  if (props.value === undefined) localValue.value = value;
  emit('update:value', value);
  emit('valueChange', value);
}
async function navigate(event: KeyboardEvent, index: number) {
  const length = props.items.length;
  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? length - 1
        : event.key === 'ArrowRight'
          ? (index + 1) % length
          : event.key === 'ArrowLeft'
            ? (index + length - 1) % length
            : -1;
  const item = props.items[next];
  if (!item) return;
  event.preventDefault();
  choose(item.id);
  await nextTick();
  root.value?.querySelectorAll<HTMLButtonElement>('[role=tab]')[next]?.focus();
}
</script>

<template>
  <div ref="root" class="bw-demo" :data-active="active" data-component="animated-tabs">
    <div class="bw-tab-box">
      <template v-if="selected">
        <div class="bw-tabs" role="tablist" :aria-label="props.label">
          <button
            v-for="(item, index) in props.items"
            :key="item.id"
            type="button"
            :id="`${uid}-tab-${index}`"
            role="tab"
            :aria-selected="selected.id === item.id"
            :aria-controls="`${uid}-panel`"
            :tabindex="selected.id === item.id ? 0 : -1"
            @click="choose(item.id)"
            @keydown="navigate($event, index)"
          >
            <span v-if="selected.id === item.id" class="bw-tab-indicator" /><span>{{
              item.label
            }}</span>
          </button>
        </div>
        <div
          class="bw-description bw-tab-copy"
          role="tabpanel"
          :id="`${uid}-panel`"
          :aria-labelledby="`${uid}-tab-${props.items.indexOf(selected)}`"
          tabindex="0"
        >
          <slot name="panel" :item="selected">{{ selected.content }}</slot>
        </div>
      </template>
      <p v-else class="bw-description">No tabs available.</p>
    </div>
  </div>
</template>
