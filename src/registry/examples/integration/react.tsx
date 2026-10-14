// MIT · BuildWithMe-UI contributors. Original consumer example.
'use client';
import { useState } from 'react';
import AnimatedTabs from '../../designs/animated-tabs/react';
import PrecisionPagination from '../../designs/precision-pagination/react';
import PricingMatrix from '../../designs/pricing-matrix/react';
import SortableDataTable from '../../designs/sortable-data-table/react';
import AsyncStatusButton from '../../designs/async-status-button/react';
import MagneticButton from '../../designs/magnetic-button/react';
import BorderTraceButton from '../../designs/border-trace-button/react';
import PressDepthButton from '../../designs/press-depth-button/react';
import ShimmerButton from '../../designs/shimmer-button/react';
import { defaultTableSort, type Billing, type TableSort } from '../../shared/component-data';
import { exampleTabs, exampleRows, examplePlans } from './data';
import './examples.css';
export default function IntegrationExample() {
  const [tab, setTab] = useState('overview');
  const [page, setPage] = useState(1);
  const [billing, setBilling] = useState<Billing>('monthly');
  const [plan, setPlan] = useState('');
  const [sort, setSort] = useState<TableSort>(defaultTableSort);
  const [row, setRow] = useState('');
  const [empty, setEmpty] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [hold, setHold] = useState(false);
  const [reject, setReject] = useState(false);
  const [lastEvent, setLastEvent] = useState('Ready.');
  const [submissions, setSubmissions] = useState(0);
  function event(name: string, value: unknown) {
    setLastEvent(JSON.stringify({ event: name, value }));
  }
  return (
    <div className="bwm-examples">
      <p>Custom data, controlled state, composition, and callbacks in a small application.</p>
      <div className="example-actions">
        <button type="button" onClick={() => setEmpty(!empty)}>
          {empty ? 'Restore example data' : 'Show empty state'}
        </button>
        <button type="button" onClick={() => setMounted(!mounted)}>
          {mounted ? 'Hide components' : 'Show components'}
        </button>
        <button
          type="button"
          onClick={() => {
            setTab('overview');
            setPage(1);
            setBilling('monthly');
            setPlan('');
            setSort(defaultTableSort);
            setRow('');
            setLastEvent('Ready.');
          }}
        >
          Reset selections
        </button>
        <label>
          <input type="checkbox" checked={hold} onChange={(e) => setHold(e.target.checked)} />
          Hold controlled values
        </label>
      </div>
      <output className="example-events" aria-label="Last component event">
        {lastEvent}
      </output>
      <form
        className="example-form"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmissions((n) => n + 1);
        }}
      >
        {mounted && (
          <div className="example-grid">
            <section data-example="tabs">
              <h2>Project tabs</h2>
              <AnimatedTabs
                items={empty ? [] : exampleTabs}
                value={tab}
                onValueChange={(v) => {
                  event('tab', v);
                  if (!hold) setTab(v);
                }}
                renderPanel={(item) => <strong>Custom panel: {item.content}</strong>}
              />
            </section>
            <section data-example="pagination">
              <h2>Project pages</h2>
              <PrecisionPagination
                page={page}
                pageCount={empty ? 0 : 8}
                onPageChange={(v) => {
                  event('page', v);
                  if (!hold) setPage(v);
                }}
              />
            </section>
            <section data-example="pricing">
              <h2>Project plans</h2>
              <PricingMatrix
                plans={empty ? [] : examplePlans}
                billing={billing}
                selectedPlan={plan}
                onBillingChange={(v) => {
                  event('billing', v);
                  if (!hold) setBilling(v);
                }}
                onPlanSelect={(v) => {
                  event('plan', v);
                  if (!hold) setPlan(v);
                }}
              />
            </section>
            <section data-example="table">
              <h2>Project records</h2>
              <SortableDataTable
                rows={empty ? [] : exampleRows}
                sort={sort}
                selectedId={row}
                onSortChange={(v) => {
                  event('sort', v);
                  if (!hold) setSort(v);
                }}
                onSelect={(v) => {
                  event('row', v);
                  if (!hold) setRow(v.id);
                }}
                renderCell={(record, column) =>
                  column === 'name' ? <strong>{record.name}</strong> : record.status
                }
              />
            </section>
            <section data-example="async">
              <h2>Save with recovery</h2>
              <div className="example-actions">
                <button type="button" onClick={() => setReject(true)}>
                  Reject next save
                </button>
              </div>
              <AsyncStatusButton
                onAction={async () => {
                  await new Promise((resolve) => setTimeout(resolve, 50));
                  if (reject) {
                    setReject(false);
                    throw new Error('Example rejection');
                  }
                  event('save', 'complete');
                }}
              />
            </section>
            <section data-example="actions">
              <h2>Actions inside a form</h2>
              <MagneticButton />
              <BorderTraceButton />
              <PressDepthButton />
              <ShimmerButton />
            </section>
          </div>
        )}
        <div className="example-actions">
          <button type="submit">Submit application form</button>
        </div>
        <output className="example-events" aria-label="Form submissions">
          {submissions}
        </output>
      </form>
    </div>
  );
}
