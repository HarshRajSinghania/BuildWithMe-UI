// Adapted from https://github.com/vercel/registry-starter/blob/main/src/components/ui/pagination.tsx under MIT. Copyright (c) Vercel, Inc..
'use client';
import { useState } from 'react';
import { useAnimation } from '../../shared/use-animation';
import {
  clampPage,
  pageCount as normalizeCount,
  paginationItems,
  type PaginationOptions,
} from '../../shared/component-data';
import '../../shared/base.css';
import './precision-pagination.css';
export default function PrecisionPagination({
  label = 'Precision pagination',
  paused = false,
  page,
  defaultPage = 2,
  pageCount = 4,
  onPageChange,
}: PaginationOptions) {
  const [localPage, setLocalPage] = useState(defaultPage);
  const count = normalizeCount(pageCount);
  const current = clampPage(page ?? localPage, count);
  const { ref, active } = useAnimation(paused);
  function choose(next: number) {
    const clamped = clampPage(next, count);
    if (clamped === current) return;
    if (page === undefined) setLocalPage(clamped);
    onPageChange?.(clamped);
  }
  return (
    <div ref={ref} className="bw-demo" data-active={active}>
      <nav className="adapt-pagination" aria-label={label}>
        <button
          type="button"
          aria-label="Previous page"
          disabled={current === 1}
          onClick={() => choose(current - 1)}
        >
          ←
        </button>
        {paginationItems(current, count).map((n) =>
          typeof n === 'number' ? (
            <button
              type="button"
              aria-current={n === current ? 'page' : undefined}
              key={n}
              onClick={() => choose(n)}
            >
              {n}
            </button>
          ) : (
            <span key={n} aria-hidden="true">
              …
            </span>
          ),
        )}
        <button
          type="button"
          aria-label="Next page"
          disabled={current === count}
          onClick={() => choose(current + 1)}
        >
          →
        </button>
      </nav>
    </div>
  );
}
