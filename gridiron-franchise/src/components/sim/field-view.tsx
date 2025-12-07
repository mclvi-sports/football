'use client';

import { SimState } from '@/lib/sim/types';

interface FieldViewProps {
  state: SimState;
  awayAbbrev?: string;
  homeAbbrev?: string;
}

export function FieldView({ state, awayAbbrev = 'AWAY', homeAbbrev = 'HOME' }: FieldViewProps) {
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
      <div className="relative h-16 overflow-hidden rounded-lg border border-zinc-700">
        {/* Endzones and field */}
        <div className="absolute inset-0 flex">
          {/* Away endzone */}
          <div className="flex w-[10%] items-center justify-center bg-red-700">
            <span className="text-[10px] font-bold tracking-wider text-white/80 [writing-mode:vertical-rl] rotate-180">
              {awayAbbrev}
            </span>
          </div>
          {/* Field */}
          <div className="relative w-[80%] bg-green-700">
            {/* Field stripes */}
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
            {/* 50-yard line accent */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-white/50" />
          </div>
          {/* Home endzone */}
          <div className="flex w-[10%] items-center justify-center bg-blue-700">
            <span className="text-[10px] font-bold tracking-wider text-white/80 [writing-mode:vertical-rl] rotate-180">
              {homeAbbrev}
            </span>
          </div>
        </div>

        {/* First down marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-yellow-400 transition-all duration-300"
          style={{ left: `${firstDownPercent}%` }}
        />

        {/* Ball marker */}
        <div
          className="absolute top-1/2 h-4 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50 transition-all duration-300"
          style={{ left: `${ballPercent}%` }}
        />
      </div>

      {/* Yard labels */}
      <div className="mt-1 flex justify-between px-[10%] text-[10px] text-zinc-500">
        <span>20</span>
        <span>40</span>
        <span className="font-semibold text-zinc-400">50</span>
        <span>40</span>
        <span>20</span>
      </div>
    </div>
  );
}
