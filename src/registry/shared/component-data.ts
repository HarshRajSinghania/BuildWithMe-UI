// MIT · BuildWithMe-UI contributors. Preserve this notice when redistributing.
export type TabItem = { id: string; label: string; content?: string };
export const defaultTabs: readonly TabItem[] = [
  { id: 'design', label: 'Design', content: 'A good idea deserves a thoughtful interface.' },
  { id: 'develop', label: 'Develop', content: 'Turn the details into something that works.' },
  { id: 'deliver', label: 'Deliver', content: 'Put it into the world. Keep making it better.' },
];
export interface TabsOptions {
  items?: readonly TabItem[];
  value?: string;
  defaultValue?: string;
  label?: string;
  paused?: boolean;
  onValueChange?: (value: string) => void;
}
export function selectedTab(items: readonly TabItem[], value: string | undefined) {
  return items.find((item) => item.id === value) ?? items[0];
}
export interface PaginationOptions {
  label?: string;
  paused?: boolean;
  page?: number;
  defaultPage?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
}
export function pageCount(value: number) {
  return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
}
export function clampPage(value: number, count: number) {
  return Math.min(pageCount(count), pageCount(value));
}
export function paginationItems(current: number, count: number) {
  const pages = new Set([1, count]);
  for (let n = Math.max(1, current - 2); n <= Math.min(count, current + 2); n++) pages.add(n);
  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | 'start-gap' | 'end-gap')[] = [];
  sorted.forEach((n, i) => {
    const previous = sorted[i - 1];
    if (previous !== undefined && n - previous > 1)
      result.push(n < current ? 'start-gap' : 'end-gap');
    result.push(n);
  });
  return result;
}
export type Billing = 'monthly' | 'yearly';
export type PricingPlan = {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyMonthlyPrice?: number;
  features: readonly string[];
};
export const defaultPlans: readonly PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 0,
    features: ['Personal projects', 'One workspace', 'Keep your source'],
  },
  {
    id: 'studio',
    name: 'Studio',
    monthlyPrice: 18,
    features: ['Unlimited projects', 'One workspace', 'Keep your source'],
  },
  {
    id: 'team',
    name: 'Team',
    monthlyPrice: 42,
    features: ['Unlimited projects', 'Team workspace', 'Keep your source'],
  },
];
export interface PricingOptions {
  label?: string;
  className?: string;
  plans?: readonly PricingPlan[];
  billing?: Billing;
  defaultBilling?: Billing;
  selectedPlan?: string;
  onBillingChange?: (billing: Billing) => void;
  onPlanSelect?: (id: string) => void;
}
export function planPrice(plan: PricingPlan, billing: Billing) {
  return billing === 'yearly'
    ? (plan.yearlyMonthlyPrice ?? Math.round(plan.monthlyPrice * 0.8))
    : plan.monthlyPrice;
}
export type TableRow = { id: string; name: string; status: string };
export type SortKey = 'name' | 'status';
export type TableSort = { key: SortKey; direction: 'ascending' | 'descending' };
export const defaultRows: readonly TableRow[] = [
  { id: 'aurora', name: 'Aurora', status: 'Ready' },
  { id: 'orbit', name: 'Orbit', status: 'Review' },
  { id: 'signal', name: 'Signal', status: 'Ready' },
];
export const defaultTableSort: TableSort = { key: 'name', direction: 'ascending' };
export interface TableOptions {
  label?: string;
  className?: string;
  rows?: readonly TableRow[];
  sort?: TableSort;
  defaultSort?: TableSort;
  selectedId?: string;
  onSortChange?: (sort: TableSort) => void;
  onSelect?: (row: TableRow) => void;
}
export function nextSort(sort: TableSort, key: SortKey): TableSort {
  return {
    key,
    direction: sort.key === key && sort.direction === 'ascending' ? 'descending' : 'ascending',
  };
}
export function sortRows(rows: readonly TableRow[], sort: TableSort) {
  const direction = sort.direction === 'ascending' ? 1 : -1;
  return [...rows].sort((a, b) => a[sort.key].localeCompare(b[sort.key], 'en') * direction);
}
