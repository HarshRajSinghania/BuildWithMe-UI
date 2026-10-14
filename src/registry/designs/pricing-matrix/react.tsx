// MIT · BuildWithMe-UI contributors. Original implementation.
'use client';
import { useState } from 'react';
import {
  defaultPlans,
  planPrice,
  type Billing,
  type PricingOptions,
} from '../../shared/component-data';
import '../../shared/base.css';
import './pricing-matrix.css';
export type PricingMatrixProps = PricingOptions;
export default function PricingMatrix({
  label = 'Pricing matrix',
  className = '',
  plans = defaultPlans,
  billing,
  defaultBilling = 'monthly',
  selectedPlan,
  onBillingChange,
  onPlanSelect,
}: PricingMatrixProps) {
  const [localBilling, setLocalBilling] = useState<Billing>(defaultBilling);
  const [localSelected, setLocalSelected] = useState('');
  const currentBilling = billing ?? localBilling;
  const selected = plans.find((plan) => plan.id === (selectedPlan ?? localSelected));
  function toggle() {
    const next = currentBilling === 'monthly' ? 'yearly' : 'monthly';
    if (billing === undefined) setLocalBilling(next);
    onBillingChange?.(next);
  }
  function choose(id: string) {
    if (selectedPlan === undefined) setLocalSelected(id);
    onPlanSelect?.(id);
  }
  return (
    <section className={`bw-demo bwm-pricing-matrix ${className}`}>
      <div className="bwm-pricing">
        <h3>{label}</h3>
        <div className="bwm-row">
          <small>Example plans · no checkout</small>
          <button
            type="button"
            className="bwm-control"
            aria-pressed={currentBilling === 'yearly'}
            onClick={toggle}
          >
            Yearly billing {currentBilling === 'yearly' ? '✓' : '○'}
          </button>
        </div>
        <div className="bwm-plans">
          {plans.map((plan) => (
            <article className="bwm-panel" key={plan.id}>
              <h4>{plan.name}</h4>
              <strong>
                ${planPrice(plan, currentBilling)}
                <small> / month</small>
              </strong>
              <ul>
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <button
                type="button"
                aria-pressed={selected?.id === plan.id}
                onClick={() => choose(plan.id)}
              >
                Choose {plan.name}
              </button>
            </article>
          ))}
        </div>
        <p role="status">
          {!plans.length
            ? 'No plans available.'
            : selected
              ? `${selected.name} selected locally.`
              : 'Find room for your next idea.'}
        </p>
      </div>
    </section>
  );
}
