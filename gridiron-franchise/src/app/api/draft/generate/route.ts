import { NextResponse } from 'next/server';
import { generateDraftClass } from '@/lib/generators/draft-generator';
import { simulateCombine } from '@/lib/season/combine-event';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const size = parseInt(searchParams.get('size') || '275');
    const year = parseInt(searchParams.get('year') || '2025');
    const week = parseInt(searchParams.get('week') || '19');
    const withCombine = searchParams.get('combine') !== 'false';

    // Generate draft class
    const draftClass = generateDraftClass({ size });

    // Simulate combine if requested
    let combineResults = null;
    if (withCombine) {
      combineResults = simulateCombine(draftClass, year, week);
    }

    return NextResponse.json({
      success: true,
      draftClass,
      combineResults,
    });
  } catch (error) {
    console.error('Error generating draft class:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate draft class' },
      { status: 500 }
    );
  }
}
