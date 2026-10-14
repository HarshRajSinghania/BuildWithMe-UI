// MIT · BuildWithMe-UI contributors. Original example application data.
import type { TabItem, TableRow, PricingPlan } from '../../shared/component-data';
export const exampleTabs: readonly TabItem[] = [
  { id: 'overview', label: 'Overview', content: 'Launch status' },
  { id: 'activity', label: 'Activity', content: 'Recent activity' },
];
export const exampleRows: readonly TableRow[] = [
  { id: 'zephyr', name: 'Zephyr', status: 'Waiting' },
  { id: 'atlas', name: 'Atlas', status: 'Ready' },
];
export const examplePlans: readonly PricingPlan[] = [
  {
    id: 'launch',
    name: 'Launch',
    monthlyPrice: 12,
    yearlyMonthlyPrice: 9,
    features: ['One real project'],
  },
  {
    id: 'scale',
    name: 'Scale',
    monthlyPrice: 32,
    yearlyMonthlyPrice: 25,
    features: ['Shared projects'],
  },
];
