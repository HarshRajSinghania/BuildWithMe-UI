<!-- Adapted from https://github.com/vercel/registry-starter/blob/main/src/components/ui/pagination.tsx under MIT. Copyright (c) Vercel, Inc.. -->
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';
import { observeMotion } from '../../shared/motion-lifecycle';

import '../../shared/base.css';
import './precision-pagination.css';
import { clampPage, pageCount, paginationItems } from '../../shared/component-data';
const props = withDefaults(
  defineProps<{
    label?: string;
    paused?: boolean;
    page?: number;
    defaultPage?: number;
    pageCount?: number;
  }>(),
  { label: 'Precision pagination', paused: false, defaultPage: 2, pageCount: 4 },
);
const emit = defineEmits<{ 'update:page': [page: number]; pageChange: [page: number] }>();
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
const localPage = ref(props.defaultPage);
const count = computed(() => pageCount(props.pageCount));
const current = computed(() => clampPage(props.page ?? localPage.value, count.value));
function choose(next: number) {
  const value = clampPage(next, count.value);
  if (value === current.value) return;
  if (props.page === undefined) localPage.value = value;
  emit('update:page', value);
  emit('pageChange', value);
}
</script>

<template>
  <div ref="root" class="bw-demo" :data-active="active" data-component="precision-pagination">
    <nav class="adapt-pagination" :aria-label="props.label">
      <button
        type="button"
        aria-label="Previous page"
        :disabled="current === 1"
        @click="choose(current - 1)"
      >
        ←
      </button>
      <template v-for="n in paginationItems(current, count)" :key="n">
        <button
          v-if="typeof n === 'number'"
          type="button"
          :aria-current="current === n ? 'page' : undefined"
          @click="choose(n)"
        >
          {{ n }}
        </button>
        <span v-else aria-hidden="true">…</span>
      </template>
      <button
        type="button"
        aria-label="Next page"
        :disabled="current === count"
        @click="choose(current + 1)"
      >
        →
      </button>
    </nav>
  </div>
</template>
