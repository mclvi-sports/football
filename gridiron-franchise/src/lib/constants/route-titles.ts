/**
 * Route Title Mapping
 *
 * Maps dashboard routes to their display titles for the GameplayHeader.
 * Dev Tools pages are excluded (they keep their own headers).
 */
export const ROUTE_TITLES: Record<string, string> = {
  // Main dashboard pages
  '/dashboard': 'Dashboard',
  '/dashboard/roster': 'Roster',
  '/dashboard/schedule': 'Schedule',
  '/dashboard/draft': 'Draft',
  '/dashboard/facilities': 'Facilities',
  '/dashboard/staff': 'Staff',
  '/dashboard/stats': 'Stats',
  '/dashboard/news': 'News',
  '/dashboard/settings': 'Settings',
  '/dashboard/my-gm': 'My GM',
  '/dashboard/about': 'About',
  '/dashboard/next-task': 'Next Task',
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

  // Default fallback
  return 'Dashboard';
}
