import { NextRequest, NextResponse } from 'next/server';
import {
  generateSchedule,
  getScheduleStats,
  validateSchedule,
} from '@/lib/schedule/schedule-generator';
import { ScheduleGeneratorConfig } from '@/lib/schedule/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const config: ScheduleGeneratorConfig = {
      season: body.season || new Date().getFullYear(),
      randomizeStandings: body.randomizeStandings ?? true,
    };

    const schedule = generateSchedule(config);
    const stats = getScheduleStats(schedule);
    const validation = validateSchedule(schedule);

    return NextResponse.json({
      success: true,
      schedule,
      stats,
      validation,
    });
  } catch (error) {
    console.error('Schedule generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate schedule' },
      { status: 500 }
    );
  }
}
