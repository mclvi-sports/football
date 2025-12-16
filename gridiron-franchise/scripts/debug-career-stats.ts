/**
 * Debug script to check career stats data
 *
 * BROWSER CONSOLE USAGE:
 * Copy and paste the code below into your browser console when on the app.
 */

const BROWSER_DEBUG_CODE = `
// ============================================
// CAREER STATS DEBUG HELPERS
// Paste this entire block into browser console
// ============================================

window.debugCareerStats = function() {
  const key = 'gridiron-career-stats';
  const stored = localStorage.getItem(key);

  if (!stored) {
    console.log('❌ No career stats found in localStorage');
    console.log('Key used:', key);
    console.log('All localStorage keys:', Object.keys(localStorage));
    return null;
  }

  const data = JSON.parse(stored);
  const playerIds = Object.keys(data.players);
  const sizeKB = (stored.length / 1024).toFixed(1);

  console.log('✅ Career stats found!');
  console.log('Storage size:', sizeKB, 'KB');
  console.log('Total players with stats:', playerIds.length);
  console.log('Last updated:', data.lastUpdated);
  console.log('Version:', data.version);

  // Sample some player IDs
  console.log('\\nSample player IDs in career stats:');
  playerIds.slice(0, 5).forEach(id => {
    const player = data.players[id];
    console.log('  ' + id + ': ' + player.playerName + ' (' + player.position + ') - ' + player.seasons.length + ' seasons');
  });

  return data;
};

window.debugRosterPlayers = function() {
  const key = 'dev-generated-players';
  const stored = sessionStorage.getItem(key);

  if (!stored) {
    console.log('❌ No dev players found in sessionStorage');
    console.log('All sessionStorage keys:', Object.keys(sessionStorage));
    return null;
  }

  const players = JSON.parse(stored);
  const experiencedCount = players.filter(p => p.experience > 0).length;

  console.log('\\n=== ROSTER PLAYERS ===');
  console.log('Total roster players:', players.length);
  console.log('With experience > 0:', experiencedCount);
  console.log('\\nSample player IDs:');
  players.slice(0, 5).forEach(p => {
    console.log('  ' + p.id + ': ' + p.firstName + ' ' + p.lastName + ' (exp: ' + p.experience + ')');
  });

  return players;
};

window.compareCareerIds = function() {
  const careerStats = window.debugCareerStats();
  const rosterPlayers = window.debugRosterPlayers();

  if (!careerStats || !rosterPlayers) {
    console.log('\\n❌ Cannot compare - missing data');
    return;
  }

  const careerIds = new Set(Object.keys(careerStats.players));
  const experiencedRoster = rosterPlayers.filter(p => p.experience > 0);

  console.log('\\n=== ID COMPARISON ===');
  console.log('Players with experience > 0 in roster:', experiencedRoster.length);
  console.log('Players in career stats store:', careerIds.size);

  // Check first 10 experienced players
  let matches = 0;
  let misses = 0;
  console.log('\\nChecking first 10 experienced players:');
  experiencedRoster.slice(0, 10).forEach(p => {
    const hasStats = careerIds.has(p.id);
    const status = hasStats ? '✅' : '❌';
    console.log('  ' + status + ' ' + p.firstName + ' ' + p.lastName + ' (' + p.id.slice(0, 8) + '...)');
    if (hasStats) matches++;
    else misses++;
  });

  console.log('\\nResult: ' + matches + ' matches, ' + misses + ' misses');

  if (misses > 0 && careerIds.size > 0) {
    console.log('\\n⚠️ ID MISMATCH DETECTED!');
    console.log('This suggests career stats were generated with different player IDs.');
  }
};

window.findPlayerStats = function(searchTerm) {
  const careerStats = JSON.parse(localStorage.getItem('gridiron-career-stats') || '{"players":{}}');
  const results = [];

  for (const [id, stats] of Object.entries(careerStats.players)) {
    if (stats.playerName.toLowerCase().includes(searchTerm.toLowerCase())) {
      results.push({ id, ...stats });
    }
  }

  if (results.length === 0) {
    console.log('No players found matching:', searchTerm);
  } else {
    console.log('Found', results.length, 'players:');
    results.forEach(p => {
      console.log('  ' + p.playerName + ' (' + p.position + ') - ' + p.seasons.length + ' seasons');
      console.log('    ID:', p.playerId);
    });
  }

  return results;
};

console.log('✅ Debug helpers loaded! Available commands:');
console.log('  debugCareerStats()     - Check career stats in localStorage');
console.log('  debugRosterPlayers()   - Check roster players in sessionStorage');
console.log('  compareCareerIds()     - Compare IDs between roster and career stats');
console.log('  findPlayerStats("name") - Search for a player by name');
`;

console.log('=== BROWSER CONSOLE DEBUG SCRIPT ===\n');
console.log('Copy and paste the following code into your browser console:\n');
console.log(BROWSER_DEBUG_CODE);
