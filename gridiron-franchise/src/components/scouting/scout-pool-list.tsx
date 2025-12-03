'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Scout, ScoutPool, ScoutRole } from '@/lib/scouting/types';
import { SCOUT_ROLES } from '@/lib/scouting/types';
import { cn } from '@/lib/utils';
import { Search, Users, DollarSign, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { ScoutCardCompact } from './scout-card';

// ============================================================================
// SORT OPTIONS
// ============================================================================

type SortField = 'ovr' | 'age' | 'salary' | 'experience';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

const sortScouts = (scouts: Scout[], config: SortConfig): Scout[] => {
  return [...scouts].sort((a, b) => {
    let aVal: number;
    let bVal: number;

    switch (config.field) {
      case 'ovr':
        aVal = a.ovr;
        bVal = b.ovr;
        break;
      case 'age':
        aVal = a.age;
        bVal = b.age;
        break;
      case 'salary':
        aVal = a.contract.salary;
        bVal = b.contract.salary;
        break;
      case 'experience':
        aVal = a.experience;
        bVal = b.experience;
        break;
      default:
        aVal = a.ovr;
        bVal = b.ovr;
    }

    return config.direction === 'desc' ? bVal - aVal : aVal - bVal;
  });
};

// ============================================================================
// FILTER HELPERS
// ============================================================================

const filterScouts = (scouts: Scout[], search: string, minOvr: number): Scout[] => {
  return scouts.filter((scout) => {
    const searchLower = search.toLowerCase();
    const nameMatch =
      `${scout.firstName} ${scout.lastName}`.toLowerCase().includes(searchLower) ||
      scout.positionExpertise.toLowerCase().includes(searchLower) ||
      scout.regionalExpertise.toLowerCase().includes(searchLower);

    const ovrMatch = scout.ovr >= minOvr;

    return nameMatch && ovrMatch;
  });
};

// ============================================================================
// SCOUT POOL LIST
// ============================================================================

interface ScoutPoolListProps {
  pool: ScoutPool;
  onSelectScout?: (scout: Scout) => void;
  selectedScoutId?: string | null;
  canHireRole?: (role: ScoutRole) => boolean;
  className?: string;
}

export function ScoutPoolList({
  pool,
  onSelectScout,
  selectedScoutId,
  canHireRole,
  className,
}: ScoutPoolListProps) {
  const [activeTab, setActiveTab] = useState<ScoutRole>('director');
  const [search, setSearch] = useState('');
  const [minOvr, setMinOvr] = useState(60);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'ovr', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);

  // Get scouts for current tab
  const currentScouts = useMemo(() => {
    let scouts: Scout[] = [];
    switch (activeTab) {
      case 'director':
        scouts = pool.directors;
        break;
      case 'area':
        scouts = pool.areaScouts;
        break;
      case 'pro':
        scouts = pool.proScouts;
        break;
      case 'national':
        scouts = pool.nationalScouts;
        break;
    }
    return sortScouts(filterScouts(scouts, search, minOvr), sortConfig);
  }, [pool, activeTab, search, minOvr, sortConfig]);

  // Count available in each role
  const roleCounts = useMemo(
    () => ({
      director: pool.directors.length,
      area: pool.areaScouts.length,
      pro: pool.proScouts.length,
      national: pool.nationalScouts.length,
    }),
    [pool]
  );

  const toggleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => toggleSort(field)}
      className={cn(
        'text-xs h-7',
        sortConfig.field === field ? 'text-blue-400' : 'text-zinc-400'
      )}
    >
      {label}
      {sortConfig.field === field &&
        (sortConfig.direction === 'desc' ? (
          <ChevronDown className="w-3 h-3 ml-1" />
        ) : (
          <ChevronUp className="w-3 h-3 ml-1" />
        ))}
    </Button>
  );

  return (
    <Card className={cn('bg-zinc-900/50 border-zinc-800', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Scout Market
          </CardTitle>
          <Badge variant="outline" className="bg-zinc-800/50">
            {Object.values(roleCounts).reduce((a, b) => a + b, 0)} Available
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Role Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ScoutRole)}>
          <TabsList className="grid grid-cols-4 bg-zinc-800/50">
            {(['director', 'area', 'pro', 'national'] as ScoutRole[]).map((role) => (
              <TabsTrigger
                key={role}
                value={role}
                className="text-xs data-[state=active]:bg-zinc-700"
                disabled={canHireRole && !canHireRole(role)}
              >
                {SCOUT_ROLES[role].name.replace(' Scout', '').replace('Scouting ', '')}
                <Badge variant="secondary" className="ml-1 text-xs px-1 py-0">
                  {roleCounts[role]}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Search & Filters */}
          <div className="space-y-2 mt-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  placeholder="Search scouts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 bg-zinc-800/50 border-zinc-700 h-9"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'border-zinc-700',
                  showFilters && 'bg-zinc-700'
                )}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {showFilters && (
              <div className="p-3 rounded-lg bg-zinc-800/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Min OVR: {minOvr}</span>
                  <input
                    type="range"
                    min={60}
                    max={95}
                    value={minOvr}
                    onChange={(e) => setMinOvr(parseInt(e.target.value))}
                    className="w-32 accent-blue-500"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-zinc-500 mr-2">Sort:</span>
                  <SortButton field="ovr" label="OVR" />
                  <SortButton field="age" label="Age" />
                  <SortButton field="salary" label="Salary" />
                  <SortButton field="experience" label="Exp" />
                </div>
              </div>
            )}
          </div>

          {/* Scout List */}
          {(['director', 'area', 'pro', 'national'] as ScoutRole[]).map((role) => (
            <TabsContent key={role} value={role} className="mt-4 space-y-2">
              {currentScouts.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No scouts match your filters</p>
                </div>
              ) : (
                currentScouts.map((scout) => (
                  <ScoutCardCompact
                    key={scout.id}
                    scout={scout}
                    selected={selectedScoutId === scout.id}
                    onClick={() => onSelectScout?.(scout)}
                  />
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Pool Refresh Info */}
        <div className="text-xs text-zinc-500 text-center pt-2 border-t border-zinc-800">
          Pool refreshes at end of season •{' '}
          {new Date(pool.lastRefresh).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
