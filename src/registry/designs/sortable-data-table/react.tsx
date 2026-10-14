// MIT · BuildWithMe-UI contributors. Original implementation.
'use client';

import { useMemo, useState } from 'react';
import '../../shared/base.css';
import './sortable-data-table.css';

import {
  defaultRows,
  defaultTableSort,
  sortRows,
  nextSort,
  type TableOptions,
  type TableRow,
  type SortKey,
} from '../../shared/component-data';
import type { ReactNode } from 'react';
export interface SortableDataTableProps extends TableOptions {
  renderCell?: (row: TableRow, key: SortKey) => ReactNode;
}
export default function SortableDataTable({
  label = 'Sortable data table',
  className = '',
  rows = defaultRows,
  sort: controlledSort,
  defaultSort = defaultTableSort,
  selectedId,
  onSortChange,
  onSelect,
  renderCell,
}: SortableDataTableProps) {
  const [localSort, setLocalSort] = useState(defaultSort);
  const [localSelected, setLocalSelected] = useState('');
  const sort = controlledSort ?? localSort;
  const selected = rows.find((row) => row.id === (selectedId ?? localSelected));
  const sortedRows = useMemo(() => sortRows(rows, sort), [rows, sort]);
  function updateSort(key: SortKey) {
    const next = nextSort(sort, key);
    if (controlledSort === undefined) setLocalSort(next);
    onSortChange?.(next);
  }
  function choose(row: TableRow) {
    if (selectedId === undefined) setLocalSelected(row.id);
    onSelect?.(row);
  }

  return (
    <section className={`bw-demo bwm-sortable-data-table ${className}`}>
      <div className="bwm-table-shell">
        <div className="bwm-table-meta" aria-hidden="true">
          <span>System index</span>
          <span>{rows.length.toString().padStart(2, '0')} records</span>
        </div>
        <div className="bwm-table-scroll">
          <table className="bwm-table">
            <caption className="bw-sr-only">{label}</caption>
            <thead>
              <tr>
                <th scope="col" aria-sort={sort.key === 'name' ? sort.direction : undefined}>
                  <button type="button" onClick={() => updateSort('name')}>
                    Name
                    <span aria-hidden="true">
                      {sort.key === 'name' ? (sort.direction === 'ascending' ? '↑' : '↓') : '↕'}
                    </span>
                  </button>
                </th>
                <th scope="col" aria-sort={sort.key === 'status' ? sort.direction : undefined}>
                  <button type="button" onClick={() => updateSort('status')}>
                    Status
                    <span aria-hidden="true">
                      {sort.key === 'status' ? (sort.direction === 'ascending' ? '↑' : '↓') : '↕'}
                    </span>
                  </button>
                </th>
                <th scope="col" className="bwm-action-heading">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className="bwm-row-marker" aria-hidden="true" />
                    {renderCell ? renderCell(row, 'name') : row.name}
                  </td>
                  <td>
                    <span className={`bwm-status bwm-status-${row.status.toLowerCase()}`}>
                      {renderCell ? renderCell(row, 'status') : row.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="bwm-row-action"
                      aria-label={`Inspect ${row.name}`}
                      onClick={() => choose(row)}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="bwm-table-status" role="status" aria-live="polite">
          {!rows.length
            ? 'No records available.'
            : selected
              ? `Selected ${selected.name}.`
              : 'Select a record to inspect.'}
        </p>
      </div>
    </section>
  );
}
