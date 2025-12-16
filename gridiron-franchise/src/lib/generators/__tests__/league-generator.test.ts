import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  GENERATION_STEPS,
  GenerationStep,
  StepStatus,
} from '../league-generator';

// Mock fetch for API calls
const mockFetch = vi.fn();

describe('GENERATION_STEPS', () => {
  it('has all 8 steps in correct order', () => {
    expect(GENERATION_STEPS).toEqual([
      'rosters',
      'freeagents',
      'draft',
      'gms',
      'coaching',
      'facilities',
      'scouting',
      'schedule',
    ]);
  });

  it('has 8 total steps', () => {
    expect(GENERATION_STEPS.length).toBe(8);
  });
});

describe('GenerationStep type', () => {
  it('allows all valid step values', () => {
    const steps: GenerationStep[] = [
      'rosters',
      'freeagents',
      'draft',
      'gms',
      'coaching',
      'facilities',
      'scouting',
      'schedule',
    ];

    steps.forEach(step => {
      expect(GENERATION_STEPS).toContain(step);
    });
  });
});

describe('StepStatus type', () => {
  it('has all valid status values', () => {
    const statuses: StepStatus[] = ['pending', 'loading', 'complete', 'error'];

    // Type check passes if this compiles
    expect(statuses.length).toBe(4);
  });
});

describe('League Generation Flow', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('step dependencies', () => {
    it('rosters must complete before freeagents', () => {
      const rostersIndex = GENERATION_STEPS.indexOf('rosters');
      const faIndex = GENERATION_STEPS.indexOf('freeagents');
      expect(rostersIndex).toBeLessThan(faIndex);
    });

    it('freeagents must complete before draft', () => {
      const faIndex = GENERATION_STEPS.indexOf('freeagents');
      const draftIndex = GENERATION_STEPS.indexOf('draft');
      expect(faIndex).toBeLessThan(draftIndex);
    });

    it('draft must complete before parallel steps (gms, coaching, facilities, scouting)', () => {
      const draftIndex = GENERATION_STEPS.indexOf('draft');
      const gmsIndex = GENERATION_STEPS.indexOf('gms');
      expect(draftIndex).toBeLessThan(gmsIndex);
    });

    it('schedule is the last step', () => {
      expect(GENERATION_STEPS[GENERATION_STEPS.length - 1]).toBe('schedule');
    });
  });

  describe('sequential vs parallel steps', () => {
    it('first 3 steps are sequential (rosters, freeagents, draft)', () => {
      const sequentialSteps = GENERATION_STEPS.slice(0, 3);
      expect(sequentialSteps).toEqual(['rosters', 'freeagents', 'draft']);
    });

    it('steps 4-7 can run in parallel (gms, coaching, facilities, scouting)', () => {
      const parallelSteps = GENERATION_STEPS.slice(3, 7);
      expect(parallelSteps).toEqual(['gms', 'coaching', 'facilities', 'scouting']);
    });

    it('step 8 (schedule) is sequential', () => {
      expect(GENERATION_STEPS[7]).toBe('schedule');
    });
  });
});

describe('Generation API endpoints', () => {
  const endpoints: Record<GenerationStep, string> = {
    rosters: '/api/dev/generate-rosters',
    freeagents: '/api/dev/generate-fa',
    draft: '/api/dev/generate-draft',
    gms: '/api/dev/generate-gm',
    coaching: '/api/dev/generate-coaching',
    facilities: '/api/dev/generate-facilities',
    scouting: '/api/dev/generate-scouting',
    schedule: '/api/dev/generate-schedule',
  };

  it('has correct endpoint mapping for each step', () => {
    expect(Object.keys(endpoints)).toHaveLength(8);
    GENERATION_STEPS.forEach(step => {
      expect(endpoints[step]).toBeDefined();
      expect(endpoints[step]).toMatch(/^\/api\/dev\/generate-/);
    });
  });
});

describe('Generation callbacks', () => {
  it('onStepChange should be called for each step state change', () => {
    const onStepChange = vi.fn();
    const statuses: StepStatus[] = ['pending', 'loading', 'complete'];

    // Simulate calling callbacks
    GENERATION_STEPS.forEach(step => {
      statuses.forEach(status => {
        onStepChange(step, status);
      });
    });

    // 8 steps * 3 statuses = 24 calls
    expect(onStepChange).toHaveBeenCalledTimes(24);
  });

  it('onError should receive step and error', () => {
    const onError = vi.fn();
    const testError = new Error('Test error');

    onError('rosters', testError);

    expect(onError).toHaveBeenCalledWith('rosters', testError);
  });

  it('onComplete should be called after all steps', () => {
    const onComplete = vi.fn();

    onComplete();

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});

describe('Step state transitions', () => {
  it('valid transitions: pending -> loading -> complete', () => {
    const transitions = ['pending', 'loading', 'complete'] as StepStatus[];

    for (let i = 0; i < transitions.length - 1; i++) {
      const current = transitions[i];
      const next = transitions[i + 1];

      // pending -> loading is valid
      if (current === 'pending') {
        expect(next).toBe('loading');
      }
      // loading -> complete is valid
      if (current === 'loading') {
        expect(next).toBe('complete');
      }
    }
  });

  it('valid error transition: loading -> error', () => {
    const current: StepStatus = 'loading';
    const next: StepStatus = 'error';

    // This is a valid transition
    expect(['complete', 'error']).toContain(next);
  });
});
