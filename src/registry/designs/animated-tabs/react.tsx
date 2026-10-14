// MIT · BuildWithMe-UI contributors. Original implementation.

'use client';

import { useState, useId, type ReactNode } from 'react';

import { motion } from 'motion/react';

import { useAnimation } from '../../shared/use-animation';

import {
  defaultTabs,
  selectedTab,
  type TabsOptions,
  type TabItem,
} from '../../shared/component-data';

import '../../shared/base.css';

import './animated-tabs.css';

export interface AnimatedTabsProps extends TabsOptions {
  renderPanel?: (item: TabItem) => ReactNode;
}

export default function AnimatedTabs({
  paused = false,
  items = defaultTabs,
  value,
  defaultValue,
  label = 'Workflow',
  onValueChange,
  renderPanel,
}: AnimatedTabsProps) {
  const { ref, active } = useAnimation(paused);

  const [localValue, setLocalValue] = useState(defaultValue ?? items[0]?.id);

  const selected = selectedTab(items, value ?? localValue);

  const id = useId();

  function choose(next: string) {
    if (value === undefined) setLocalValue(next);

    onValueChange?.(next);
  }

  return (
    <div ref={ref} className="bw-demo" data-active={active}>
      <div className="bw-tab-box">
        {selected ? (
          <>
            <div role="tablist" aria-label={label} className="bw-tabs">
              {items.map((item, i) => (
                <button
                  type="button"
                  key={item.id}
                  id={`${id}-tab-${i}`}
                  role="tab"

                  aria-selected={selected.id === item.id}
                  aria-controls={`${id}-panel`}

                  tabIndex={selected.id === item.id ? 0 : -1}
                  onClick={() => choose(item.id)}

                  onKeyDown={(e) => {
                    const n =
                      e.key === 'ArrowRight'
                        ? (i + 1) % items.length
                        : e.key === 'ArrowLeft'
                          ? (i + items.length - 1) % items.length
                          : e.key === 'Home'
                            ? 0
                            : e.key === 'End'
                              ? items.length - 1
                              : -1;

                    if (n < 0) return;

                    e.preventDefault();
                    choose(items[n].id);

                    document.getElementById(`${id}-tab-${n}`)?.focus();
                  }}
                >
                  {selected.id === item.id ? (
                    <motion.span
                      className="bw-tab-indicator"
                      layoutId={`${id}-indicator`}
                      transition={{ duration: active ? 0.2 : 0 }}
                    />
                  ) : null}

                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div
              role="tabpanel"
              id={`${id}-panel`}
              aria-labelledby={`${id}-tab-${items.indexOf(selected)}`}
              tabIndex={0}
              className="bw-description bw-tab-copy"
            >
              {renderPanel ? renderPanel(selected) : selected.content}
            </div>
          </>
        ) : (
          <p className="bw-description">No tabs available.</p>
        )}
      </div>
    </div>
  );
}
