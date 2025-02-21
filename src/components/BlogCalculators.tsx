'use client';

import { LifePathCalculator, ExpressionCalculator } from './NumerologyCalculator';

export default function BlogCalculators() {
  return (
    <div className="space-y-8">
      <LifePathCalculator />
      <ExpressionCalculator />
    </div>
  );
} 