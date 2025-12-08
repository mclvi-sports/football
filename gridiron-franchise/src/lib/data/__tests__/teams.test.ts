import { describe, it, expect } from 'vitest';
import {
  LEAGUE_TEAMS,
  getTeamById,
  getTeamsByDivision,
  getTeamsByConference,
  type TeamInfo,
} from '../teams';

describe('LEAGUE_TEAMS data integrity', () => {
  it('has exactly 32 teams', () => {
    expect(LEAGUE_TEAMS).toHaveLength(32);
  });

  it('all teams have unique IDs', () => {
    const ids = LEAGUE_TEAMS.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(32);
  });

  it('all teams have required properties', () => {
    LEAGUE_TEAMS.forEach((team) => {
      expect(team.id).toBeDefined();
      expect(team.id.length).toBe(3);
      expect(team.city).toBeDefined();
      expect(team.name).toBeDefined();
      expect(team.conference).toBeDefined();
      expect(team.division).toBeDefined();
      expect(team.colors).toBeDefined();
      expect(team.colors.primary).toBeDefined();
      expect(team.colors.secondary).toBeDefined();
    });
  });

  it('has exactly 2 conferences', () => {
    const conferences = new Set(LEAGUE_TEAMS.map((t) => t.conference));
    expect(conferences.size).toBe(2);
    expect(conferences).toContain('Atlantic');
    expect(conferences).toContain('Pacific');
  });

  it('has exactly 8 divisions', () => {
    const divisions = new Set(LEAGUE_TEAMS.map((t) => t.division));
    expect(divisions.size).toBe(8);
  });

  it('each division has exactly 4 teams', () => {
    const divisionCounts = new Map<string, number>();
    LEAGUE_TEAMS.forEach((team) => {
      const count = divisionCounts.get(team.division) || 0;
      divisionCounts.set(team.division, count + 1);
    });

    divisionCounts.forEach((count, division) => {
      expect(count).toBe(4);
    });
  });

  it('each conference has 16 teams', () => {
    const atlantic = LEAGUE_TEAMS.filter((t) => t.conference === 'Atlantic');
    const pacific = LEAGUE_TEAMS.filter((t) => t.conference === 'Pacific');
    expect(atlantic).toHaveLength(16);
    expect(pacific).toHaveLength(16);
  });

  it('all colors are valid hex colors', () => {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    LEAGUE_TEAMS.forEach((team) => {
      expect(team.colors.primary).toMatch(hexColorRegex);
      expect(team.colors.secondary).toMatch(hexColorRegex);
    });
  });
});

describe('getTeamById', () => {
  it('returns team for valid ID', () => {
    const team = getTeamById('BOS');
    expect(team).toBeDefined();
    expect(team?.city).toBe('Boston');
    expect(team?.name).toBe('Rebels');
  });

  it('returns undefined for invalid ID', () => {
    const team = getTeamById('INVALID');
    expect(team).toBeUndefined();
  });

  it('is case-sensitive', () => {
    const team = getTeamById('bos');
    expect(team).toBeUndefined();
  });
});

describe('getTeamsByDivision', () => {
  it('returns 4 teams for valid division', () => {
    const teams = getTeamsByDivision('Atlantic North');
    expect(teams).toHaveLength(4);
  });

  it('returns correct teams for Atlantic North', () => {
    const teams = getTeamsByDivision('Atlantic North');
    const ids = teams.map((t) => t.id);
    expect(ids).toContain('BOS');
    expect(ids).toContain('PHI');
    expect(ids).toContain('PIT');
    expect(ids).toContain('BAL');
  });

  it('returns empty array for invalid division', () => {
    const teams = getTeamsByDivision('Invalid Division');
    expect(teams).toHaveLength(0);
  });
});

describe('getTeamsByConference', () => {
  it('returns 16 teams for Atlantic conference', () => {
    const teams = getTeamsByConference('Atlantic');
    expect(teams).toHaveLength(16);
  });

  it('returns 16 teams for Pacific conference', () => {
    const teams = getTeamsByConference('Pacific');
    expect(teams).toHaveLength(16);
  });

  it('returns empty array for invalid conference', () => {
    const teams = getTeamsByConference('Invalid');
    expect(teams).toHaveLength(0);
  });

  it('all returned teams belong to requested conference', () => {
    const atlanticTeams = getTeamsByConference('Atlantic');
    atlanticTeams.forEach((team) => {
      expect(team.conference).toBe('Atlantic');
    });
  });
});
