'use client';

import { SimState } from '@/lib/sim/types';

interface FieldViewProps {
  state: SimState;
}

export function FieldView({ state }: FieldViewProps) {
  // Convert ball position (0-100) to percentage on the field display
  // Field display: 10% for each endzone, 80% for the field
  const ballPercent = 10 + state.ball * 0.8;

  // First down marker
  const firstDownPos =
    state.possession === 'away'
      ? Math.min(100, state.ball + state.yardsToGo)
      : Math.max(0, state.ball - state.yardsToGo);
  const firstDownPercent = 10 + firstDownPos * 0.8;

  return (
    <div className="mb-4">
      {/* Field */}
      <div className="relative h-12 overflow-hidden rounded">
        {/* Endzones and field */}
        <div className="absolute inset-0 flex">
          {/* Away endzone */}
          <div className="w-[10%] bg-red-700" />
          {/* Field */}
          <div className="relative w-[80%] bg-green-700">
            {/* Yard lines */}
            <div
              className="absolute inset-0"
              style={{
                background: `repeating-linear-gradient(90deg,
                  transparent,
                  transparent calc(10% - 1px),
                  rgba(255,255,255,0.3) calc(10% - 1px),
                  rgba(255,255,255,0.3) 10%)`,
              }}
            />
          </div>
          {/* Home endzone */}
          <div className="w-[10%] bg-blue-700" />
        </div>

        {/* First down marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-yellow-400 transition-all duration-300"
          style={{ left: `${firstDownPercent}%` }}
        />

        {/* Ball marker */}
        <div
          className="absolute top-1/2 h-3 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50 transition-all duration-300"
          style={{ left: `${ballPercent}%` }}
        />
      </div>

      {/* Yard labels */}
      <div className="mt-1 flex justify-between text-[10px] text-zinc-500">
        <span>AWAY</span>
        <span>20</span>
        <span>40</span>
        <span>50</span>
        <span>40</span>
        <span>20</span>
        <span>HOME</span>
      </div>
    </div>
  );
}
