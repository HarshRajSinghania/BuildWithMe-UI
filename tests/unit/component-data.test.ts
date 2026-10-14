import { describe, expect, it } from 'vitest';
import {
  clampPage,
  pageCount,
  paginationItems,
  selectedTab,
  nextSort,
  sortRows,
  planPrice,
} from '../../src/registry/shared/component-data';
describe('consumer data contracts', () => {
  it('bounds page state when data disappears or changes', () => {
    expect(clampPage(9, 3)).toBe(3);
    expect(clampPage(-1, 0)).toBe(1);
    expect(pageCount(Number.NaN)).toBe(1);
    expect(pageCount(Number.POSITIVE_INFINITY)).toBe(1);
    expect(clampPage(2.8, 4.2)).toBe(2);
    expect(paginationItems(500, 1000)).toEqual([
      1,
      'start-gap',
      498,
      499,
      500,
      501,
      502,
      'end-gap',
      1000,
    ]);
    expect(paginationItems(2, 4)).toEqual([1, 2, 3, 4]);
  });
  it('falls back safely for a removed tab or an empty list', () => {
    const items = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ];
    expect(selectedTab(items, 'b')).toBe(items[1]);
    expect(selectedTab(items, 'removed')).toBe(items[0]);
    expect(selectedTab([], 'a')).toBeUndefined();
  });
  it('sorts without mutating application records and toggles each key independently', () => {
    const rows = Object.freeze([
      { id: 'z', name: 'Zephyr', status: 'Waiting' },
      { id: 'a', name: 'Atlas', status: 'Ready' },
    ]);
    const sort = { key: 'name', direction: 'ascending' } as const;
    expect(sortRows(rows, sort).map((row) => row.id)).toEqual(['a', 'z']);
    expect(rows.map((row) => row.id)).toEqual(['z', 'a']);
    expect(nextSort(sort, 'name')).toEqual({ key: 'name', direction: 'descending' });
    expect(nextSort(sort, 'status')).toEqual({ key: 'status', direction: 'ascending' });
  });
  it('uses explicit yearly prices while retaining the original demonstration discount', () => {
    const plan = {
      id: 'launch',
      name: 'Launch',
      monthlyPrice: 12,
      yearlyMonthlyPrice: 9,
      features: [],
    };
    expect(planPrice(plan, 'monthly')).toBe(12);
    expect(planPrice(plan, 'yearly')).toBe(9);
    expect(planPrice({ ...plan, monthlyPrice: 18, yearlyMonthlyPrice: undefined }, 'yearly')).toBe(
      14,
    );
  });
});
