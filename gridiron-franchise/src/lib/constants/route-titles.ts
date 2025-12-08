/**
 * Route Title Mapping
 *
 * Maps dashboard routes to their display titles for the GameplayHeader.
 * Dev Tools pages are excluded (they keep their own headers).
 */
export const ROUTE_TITLES: Record<string, string> = {
  // Main dashboard pages
  '/dashboard': 'Dashboard',
  '/dashboard/roster-management': 'Roster',
  '/dashboard/roster-management/roster': 'Team Roster',
  '/dashboard/roster-management/fa': 'Free Agency',
  '/dashboard/roster-management/ps': 'Practice Squad',
  '/dashboard/roster-management/trades': 'Trades',
  '/dashboard/roster-management/depth-chart': 'Depth Chart',
  '/dashboard/roster-management/injuries': 'Injuries',
  '/dashboard/schedule': 'Schedule',
  '/dashboard/draft': 'Draft',
  '/dashboard/facilities': 'Facilities',
  '/dashboard/staff': 'Staff',
  '/dashboard/stats': 'Stats',
  '/dashboard/news': 'News',
  '/dashboard/settings': 'Settings',
  '/dashboard/saves': 'Cloud Saves',
  '/dashboard/my-gm': 'My GM',
  '/dashboard/about': 'About',
  '/dashboard/my-team': 'My Team',
  '/dashboard/next-task': 'Next',
};

/**
 * Get title for a route path
 * Falls back to "Dashboard" if not found
 */
export function getRouteTitle(pathname: string): string {
  // Exact match first
  if (ROUTE_TITLES[pathname]) {
    return ROUTE_TITLES[pathname];
  }

  // Dynamic route patterns
  if (pathname.startsWith('/dashboard/player/')) {
    return 'Player Details';
  }

  // Default fallback
  return 'Dashboard';
}
