/**
 * Script to analyze FA experience distribution
 * Run with: npx tsx scripts/analyze-fa-distribution.ts
 */

import { generateFAPool } from '../src/lib/generators/fa-generator';

function analyzeFADistribution() {
  const faPool = generateFAPool({ size: 175 });

  const ages: number[] = faPool.map(fa => fa.age);
  const experiences: number[] = faPool.map(fa => fa.experience);

  const avgAge = ages.reduce((a, b) => a + b, 0) / ages.length;
  const avgExp = experiences.reduce((a, b) => a + b, 0) / experiences.length;
  const rookieCount = experiences.filter(e => e === 0).length;
  const experiencedCount = experiences.filter(e => e > 0).length;

  console.log('\n=== FREE AGENT POOL ANALYSIS ===\n');
  console.log(`Total FAs: ${faPool.length}`);
  console.log(`Avg Age: ${avgAge.toFixed(1)}`);
  console.log(`Avg Experience: ${avgExp.toFixed(1)}`);
  console.log(`Rookies (exp=0): ${rookieCount} (${(rookieCount/faPool.length*100).toFixed(1)}%)`);
  console.log(`Experienced (exp>0): ${experiencedCount} (${(experiencedCount/faPool.length*100).toFixed(1)}%)`);

  // Age breakdown
  const ageBrackets = {
    '22': ages.filter(a => a === 22).length,
    '23-25': ages.filter(a => a >= 23 && a <= 25).length,
    '26-29': ages.filter(a => a >= 26 && a <= 29).length,
    '30-33': ages.filter(a => a >= 30 && a <= 33).length,
    '34+': ages.filter(a => a >= 34).length,
  };

  console.log('\nAge Distribution:');
  for (const [bracket, count] of Object.entries(ageBrackets)) {
    console.log(`  ${bracket}: ${count} (${(count/faPool.length*100).toFixed(1)}%)`);
  }

  // Experience breakdown
  console.log('\nExperience Distribution:');
  for (let exp = 0; exp <= 15; exp++) {
    const count = experiences.filter(e => e === exp).length;
    if (count > 0) {
      console.log(`  ${exp} years: ${count} (${(count/faPool.length*100).toFixed(1)}%)`);
    }
  }

  // Analyze why some FAs have exp=0
  console.log('\n=== WHY exp=0? ===');
  const youngFAs = faPool.filter(fa => fa.experience === 0);
  console.log(`FAs with exp=0: ${youngFAs.length}`);

  const ageDistOfRookies = {
    '22': youngFAs.filter(fa => fa.age === 22).length,
    '23': youngFAs.filter(fa => fa.age === 23).length,
    '24+': youngFAs.filter(fa => fa.age >= 24).length,
  };
  console.log('Age distribution of exp=0 FAs:');
  for (const [age, count] of Object.entries(ageDistOfRookies)) {
    console.log(`  Age ${age}: ${count}`);
  }
}

analyzeFADistribution();
