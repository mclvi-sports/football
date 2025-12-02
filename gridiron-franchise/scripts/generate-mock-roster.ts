import { generateTeamRoster, getRosterStats } from '../src/lib/generators/roster-generator';
import { Tier, Position, Player } from '../src/lib/types';
import { heightToString, weightToString } from '../src/lib/data/physical-ranges';
import { TRAITS } from '../src/lib/data/traits';
import { BADGES } from '../src/lib/data/badges';

// Helper to get trait name from ID
function getTraitName(traitId: string): string {
    const trait = TRAITS.find(t => t.id === traitId);
    return trait?.name || traitId;
}

// Helper to get badge name from ID
function getBadgeName(badgeId: string): string {
    const badge = BADGES.find(b => b.id === badgeId);
    return badge?.name || badgeId;
}

// Generate rosters for different tiers to demonstrate range
const tiers = [Tier.Elite, Tier.Average, Tier.Rebuilding];

for (const tier of tiers) {
    const teamId = `test-team-${tier}`;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`GENERATING ${tier.toUpperCase()} TIER ROSTER`);
    console.log('='.repeat(60));

    const roster = generateTeamRoster(teamId, tier);
    const stats = getRosterStats(roster);

    console.log(`\nTeam Stats:`);
    console.log(`  Total Players: ${stats.totalPlayers}`);
    console.log(`  Average OVR: ${stats.avgOvr}`);
    console.log(`  Average Age: ${stats.avgAge}`);

    // Group by position for display
    const grouped: Record<string, Player[]> = {};
    roster.players.forEach(p => {
        if (!grouped[p.position]) grouped[p.position] = [];
        grouped[p.position].push(p);
    });

    // Sort by OVR within each position
    Object.keys(grouped).forEach(pos => {
        grouped[pos].sort((a, b) => b.overall - a.overall);
    });

    // Display first 10 players with full details
    console.log(`\n--- TOP 10 PLAYERS (by OVR) ---`);
    const allPlayers = [...roster.players].sort((a, b) => b.overall - a.overall);
    allPlayers.slice(0, 10).forEach((p, i) => {
        console.log(`\n${i + 1}. ${p.firstName} ${p.lastName} (${p.position})`);
        console.log(`   OVR: ${p.overall} | POT: ${p.potential} | Age: ${p.age} | Exp: ${p.experience} yrs`);
        console.log(`   Archetype: ${p.archetype}`);
        console.log(`   Physical: ${heightToString(p.height)} / ${weightToString(p.weight)} / ${p.fortyTime.toFixed(2)}s 40yd`);

        if (p.traits.length > 0) {
            const traitNames = p.traits.map(id => getTraitName(id)).join(', ');
            console.log(`   Traits: ${traitNames}`);
        }

        if (p.badges.length > 0) {
            const badgeStr = p.badges.map(b => `${getBadgeName(b.id)} (${b.tier})`).join(', ');
            console.log(`   Badges: ${badgeStr}`);
        }
    });

    // Position summary
    console.log(`\n--- POSITION BREAKDOWN ---`);
    const posOrder: Position[] = [
        Position.QB, Position.RB, Position.WR, Position.TE,
        Position.LT, Position.LG, Position.C, Position.RG, Position.RT,
        Position.DE, Position.DT, Position.MLB, Position.OLB,
        Position.CB, Position.FS, Position.SS, Position.K, Position.P
    ];

    posOrder.forEach(pos => {
        const players = grouped[pos];
        if (players) {
            const avgOvr = Math.round(players.reduce((sum, p) => sum + p.overall, 0) / players.length);
            const ovrs = players.map(p => p.overall).join(', ');
            console.log(`${pos.padEnd(3)}: ${players.length} players | Avg OVR: ${avgOvr} | [${ovrs}]`);
        }
    });

    // Trait and badge statistics
    let totalTraits = 0;
    let totalBadges = 0;
    const traitCounts: Record<string, number> = {};
    const badgeCounts: Record<string, number> = {};

    roster.players.forEach(p => {
        totalTraits += p.traits.length;
        totalBadges += p.badges.length;
        p.traits.forEach(traitId => {
            const name = getTraitName(traitId);
            traitCounts[name] = (traitCounts[name] || 0) + 1;
        });
        p.badges.forEach(b => {
            const name = getBadgeName(b.id);
            badgeCounts[name] = (badgeCounts[name] || 0) + 1;
        });
    });

    console.log(`\n--- TRAIT & BADGE STATS ---`);
    console.log(`Total Traits: ${totalTraits} (avg ${(totalTraits / roster.players.length).toFixed(1)} per player)`);
    console.log(`Total Badges: ${totalBadges} (avg ${(totalBadges / roster.players.length).toFixed(1)} per player)`);

    // Top 5 most common traits
    const sortedTraits = Object.entries(traitCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (sortedTraits.length > 0) {
        console.log(`Most Common Traits: ${sortedTraits.map(([name, count]) => `${name} (${count})`).join(', ')}`);
    }

    // Top 5 most common badges
    const sortedBadges = Object.entries(badgeCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (sortedBadges.length > 0) {
        console.log(`Most Common Badges: ${sortedBadges.map(([name, count]) => `${name} (${count})`).join(', ')}`);
    }
}

console.log(`\n${'='.repeat(60)}`);
console.log('ROSTER GENERATION COMPLETE');
console.log('='.repeat(60) + '\n');
