'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  GMPointsDisplay,
  EquipmentSlots,
  EquipmentSlotsCompact,
  SkillsMenu,
  SkillsMenuCompact,
  AchievementList,
  AchievementProgress,
  RecentAchievements,
  PrestigeDisplay,
  PrestigeBadge,
  PrestigeRoadmap,
  SkillCard,
} from '@/components/gm';
import { useGMPointsStore } from '@/stores/gm-points-store';
import { useGMEquipmentStore } from '@/stores/gm-equipment-store';
import { useGMPrestigeStore } from '@/stores/gm-prestige-store';
import { allSkills, skillCategories } from '@/data/gm-skills';
import { allAchievements } from '@/data/gm-achievements';
import { teamTierConfigs } from '@/data/gm-team-tiers';
import type { TeamTierLevel } from '@/types/gm-team-tier';
import { RefreshCw, Trophy, Zap, Award } from 'lucide-react';

export default function GMSkillsDevPage() {
  const [selectedTier, setSelectedTier] = useState<TeamTierLevel>('average');

  // Store actions
  const initializePoints = useGMPointsStore((s) => s.initializePoints);
  const earnAchievement = useGMPointsStore((s) => s.earnAchievementPoints);
  const addBonus = useGMPointsStore((s) => s.addBonus);
  const resetPoints = useGMPointsStore((s) => s.reset);
  const availableGP = useGMPointsStore((s) => s.getAvailablePoints());

  const initializeEquipment = useGMEquipmentStore((s) => s.initializeEquipment);
  const updateAfterSeason = useGMEquipmentStore((s) => s.updateAfterSeason);
  const resetEquipment = useGMEquipmentStore((s) => s.reset);

  const addChampionship = useGMPrestigeStore((s) => s.addChampionship);
  const resetPrestige = useGMPrestigeStore((s) => s.reset);

  // Get tier config
  const tierConfig = teamTierConfigs.find((t) => t.tier === selectedTier);

  // Initialize with selected tier
  const handleInitialize = () => {
    if (!tierConfig) return;
    initializePoints(tierConfig.startingGP);
    initializeEquipment(tierConfig.startingSlots);
  };

  // Reset all stores
  const handleResetAll = () => {
    resetPoints();
    resetEquipment();
    resetPrestige();
  };

  // Simulate earning random achievement
  const handleEarnRandomAchievement = () => {
    const randomAchievement =
      allAchievements[Math.floor(Math.random() * allAchievements.length)];
    earnAchievement(randomAchievement.id, 2025);
  };

  // Simulate winning a championship
  const handleWinChampionship = () => {
    earnAchievement('championship_win', 2025);
    addChampionship();
    updateAfterSeason({ wins: 14, playoffWins: 4, wonChampionship: true });
  };

  // Simulate completing a season
  const handleCompleteSeason = () => {
    const wins = Math.floor(Math.random() * 12) + 5;
    const playoffWins = wins >= 10 ? Math.floor(Math.random() * 3) : 0;
    updateAfterSeason({ wins, playoffWins, wonChampionship: false });

    if (wins >= 10) {
      earnAchievement('ten_win_season', 2025);
    }
    if (playoffWins > 0) {
      earnAchievement('playoff_appearance', 2025);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="px-5 pt-12 pb-4">
        <Link
          href="/dashboard/dev-tools"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          Back to Dev Tools
        </Link>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold">GM Skills System</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Test GM Points, Skills, Equipment, and Prestige
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PrestigeBadge />
            <GMPointsDisplay />
          </div>
        </div>
      </header>

      <main className="px-5 space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tier Selection */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Select Team Tier:</p>
              <div className="flex flex-wrap gap-2">
                {teamTierConfigs.map((tier) => (
                  <Button
                    key={tier.tier}
                    variant={selectedTier === tier.tier ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTier(tier.tier)}
                  >
                    {tier.name}
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {tier.startingGP} GP
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleInitialize} variant="default">
                <Zap className="h-4 w-4 mr-1" />
                Initialize ({tierConfig?.name})
              </Button>
              <Button onClick={handleEarnRandomAchievement} variant="outline">
                <Award className="h-4 w-4 mr-1" />
                Random Achievement
              </Button>
              <Button onClick={handleCompleteSeason} variant="outline">
                Complete Season
              </Button>
              <Button onClick={handleWinChampionship} variant="outline">
                <Trophy className="h-4 w-4 mr-1" />
                Win Championship
              </Button>
              <Button onClick={() => addBonus(100, 'Dev Bonus', 2025)} variant="outline">
                +100 GP
              </Button>
              <Button onClick={handleResetAll} variant="destructive">
                <RefreshCw className="h-4 w-4 mr-1" />
                Reset All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="prestige">Prestige</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Points Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">GM Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <GMPointsDisplay showBreakdown className="mb-4" />
                  <RecentAchievements limit={3} />
                </CardContent>
              </Card>

              {/* Equipment Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                  <EquipmentSlotsCompact className="mb-4" />
                  <SkillsMenuCompact />
                </CardContent>
              </Card>

              {/* Prestige Summary */}
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Prestige Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <PrestigeDisplay showProgress />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <SkillsMenu />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Equipment Slots</CardTitle>
              </CardHeader>
              <CardContent>
                <EquipmentSlots />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <AchievementProgress />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">All Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <AchievementList />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prestige Tab */}
          <TabsContent value="prestige" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Current Status</CardTitle>
              </CardHeader>
              <CardContent>
                <PrestigeDisplay showProgress />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Prestige Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                <PrestigeRoadmap />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Stats Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">System Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{allSkills.length}</div>
                <div className="text-xs text-muted-foreground">Total Skills</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{skillCategories.length}</div>
                <div className="text-xs text-muted-foreground">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{allAchievements.length}</div>
                <div className="text-xs text-muted-foreground">Achievements</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{teamTierConfigs.length}</div>
                <div className="text-xs text-muted-foreground">Team Tiers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
