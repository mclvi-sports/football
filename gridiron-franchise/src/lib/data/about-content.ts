/**
 * About page content data
 * Organized by tab sections for the About page redesign
 */

export type AboutTabId = "overview" | "players" | "staff" | "teams" | "systems" | "season";

export interface AboutTab {
  id: AboutTabId;
  label: string;
  sections: AboutSection[];
}

export interface AboutSection {
  title: string;
  description?: string;
  items?: string[];
  stats?: { label: string; value: string }[];
  highlight?: string;
}

// Key stats for the hero section
export const ABOUT_STATS = [
  { label: "Positions", value: "18" },
  { label: "Archetypes", value: "70" },
  { label: "Traits", value: "44" },
  { label: "Badges", value: "43" },
];

// Tab content organized by section
export const ABOUT_TABS: AboutTab[] = [
  {
    id: "overview",
    label: "Overview",
    sections: [
      {
        title: "What is Gridiron Franchise?",
        description:
          "Gridiron Franchise is the ultimate football management simulation. Build a dynasty, develop players, and outsmart the competition. You control every aspect of your franchise - from scouting and drafting to coaching decisions and salary cap management.",
      },
      {
        title: "Our Philosophy",
        description:
          "Every decision matters. From scouting a late-round gem to managing your salary cap, from choosing your offensive scheme to developing your practice squad — you have complete control over your franchise's destiny.",
      },
      {
        title: "Getting Started",
        items: [
          "Generate a league with 32 teams and full rosters",
          "Select your team and take over as GM",
          "Review your roster, staff, and facilities",
          "Navigate the offseason or regular season calendar",
          "Make decisions that shape your franchise's future",
        ],
      },
      {
        title: "Key Features",
        items: [
          "Deep player generation with 70 unique archetypes",
          "44 traits that affect behavior and performance",
          "43 badges with 4 tiers of bonuses",
          "Complete coaching staff with schemes",
          "Scouting department with multiple scout types",
          "Facility upgrades for competitive advantages",
          "40-week season calendar with key events",
          "Full salary cap and contract management",
        ],
      },
    ],
  },
  {
    id: "players",
    label: "Players",
    sections: [
      {
        title: "Player Generation",
        highlight: "70 Unique Archetypes",
        description:
          "Every player is uniquely generated with realistic attributes, physical traits, and mental characteristics. Players have primary and secondary archetypes that shape their identity and playing style.",
        items: [
          "18 positions with authentic depth chart requirements",
          "Physical attributes like Speed, Acceleration, Strength, and Agility",
          "Mental attributes including Awareness and Play Recognition",
          "Position-specific ratings tailored to each role",
          "Overall ratings from 40 to 99 based on position weights",
          "Realistic height, weight, and age distributions",
        ],
      },
      {
        title: "Player Traits",
        highlight: "44 Unique Traits",
        description:
          "Traits define who a player really is. They affect performance, chemistry, contracts, and team morale. Some traits are hidden until revealed through scouting or gameplay.",
        items: [
          "7 categories: Leadership, Work Ethic, On-Field, Durability, Contract, Clutch, Character",
          "Positive traits like Gym Rat, Clutch, Field General, and Iron Man",
          "Negative traits like Diva, Lazy, Injury Prone, and Locker Room Cancer",
          "Trait synergies unlock when players have complementary traits",
          "Traits can evolve over a player's career",
        ],
      },
      {
        title: "Badge System",
        highlight: "4 Tiers of Excellence",
        description:
          "Badges unlock situational bonuses during games. Earn them through performance and XP. Higher tiers provide bigger advantages.",
        items: [
          "43 badges available across all positions",
          "Bronze (+2-5), Silver (+4-8), Gold (+6-12), Hall of Fame (+9-15) bonuses",
          "Situational activations: Clutch moments, Red Zone, Prime Time, Playoffs",
          "Position-specific badges like Pocket Surgeon and Ball Hawk",
          "Universal badges like Clutch Gene and Playoff Hero",
        ],
      },
      {
        title: "Positions",
        stats: [
          { label: "Offense", value: "9" },
          { label: "Defense", value: "7" },
          { label: "Special Teams", value: "2" },
          { label: "Total", value: "18" },
        ],
        items: [
          "Offense: QB, RB, WR, TE, LT, LG, C, RG, RT",
          "Defense: DE, DT, MLB, OLB, CB, FS, SS",
          "Special Teams: K, P",
        ],
      },
    ],
  },
  {
    id: "staff",
    label: "Staff",
    sections: [
      {
        title: "General Manager",
        description:
          "Your GM has a unique background and archetype that shapes how you build your franchise. Choose wisely — their skills affect everything from scouting to negotiations.",
        stats: [
          { label: "Backgrounds", value: "5" },
          { label: "Archetypes", value: "5" },
          { label: "Skill Trees", value: "8" },
          { label: "Perk Tiers", value: "3" },
        ],
      },
      {
        title: "GM Backgrounds",
        items: [
          "Scout: Superior player evaluation and draft preparation",
          "Coach: Better player development and scheme understanding",
          "Agent: Contract negotiation advantages and cap management",
          "Executive: Improved trading and front office operations",
          "Analytics: Data-driven insights and advanced metrics",
        ],
      },
      {
        title: "GM Archetypes",
        items: [
          "Builder: Long-term vision, draft-focused dynasty building",
          "Trader: Aggressive deal-making, always looking for value",
          "Developer: Player growth focus, coaching synergies",
          "Negotiator: Contract wizardry, cap space maximization",
          "Talent Scout: Elite evaluation, find diamonds in the rough",
        ],
      },
      {
        title: "Coaching Staff",
        description:
          "Hire coordinators, choose schemes, and develop your coaching philosophy. Your coaches directly impact player performance and development.",
        stats: [
          { label: "Coaching Roles", value: "4" },
          { label: "Offensive Schemes", value: "6" },
          { label: "Defensive Schemes", value: "5" },
          { label: "Coach Perks", value: "3 Tiers" },
        ],
      },
      {
        title: "Offensive Schemes",
        items: [
          "West Coast: Short and intermediate passing with high completion rates",
          "Air Raid: Spread formations with aggressive downfield passing",
          "Power Run: Dominant rushing attack with physical football",
          "Spread Option: Dual-threat QB with RPO-heavy offense",
          "Pro Style: Balanced attack with multiple formations",
          "Smashmouth: Ground-and-pound with time of possession focus",
        ],
      },
      {
        title: "Defensive Schemes",
        items: [
          "4-3 Under: Balanced front with versatile coverage",
          "3-4 Odd: Two-gap DL with athletic OLBs and pressure packages",
          "Tampa 2: Zone coverage with Cover 2 base and run support safeties",
          "Man Press: Aggressive CBs with tight coverage and high risk/reward",
          "Multiple: Hybrid scheme that adapts to opponent strengths",
        ],
      },
      {
        title: "Scouting Department",
        description:
          "Build your scouting team to find the best players in the draft and free agency. Better scouts reveal hidden traits and true potential.",
        stats: [
          { label: "Scout Roles", value: "4" },
          { label: "Weekly Points", value: "230-290" },
          { label: "Max Staff", value: "5" },
          { label: "Perk Trees", value: "3" },
        ],
      },
      {
        title: "Scout Types",
        items: [
          "Director of Scouting: Required leader of your scouting department",
          "Area Scouts: Cover specific regions for local college knowledge",
          "Pro Scouts: Evaluate NFL players for trades and free agency",
          "National Scout: Provides broad coverage across all colleges",
        ],
      },
    ],
  },
  {
    id: "teams",
    label: "Teams",
    sections: [
      {
        title: "League Structure",
        description:
          "The league features 32 teams organized into 2 conferences with 4 divisions each. Compete for division titles, conference championships, and the ultimate prize.",
        stats: [
          { label: "Teams", value: "32" },
          { label: "Conferences", value: "2" },
          { label: "Divisions", value: "8" },
          { label: "Per Division", value: "4" },
        ],
      },
      {
        title: "Facilities",
        description:
          "Upgrade your team's infrastructure for competitive advantages. Better facilities mean faster development, quicker recovery, and improved performance.",
        stats: [
          { label: "Facility Types", value: "8" },
          { label: "Upgrade Tiers", value: "5" },
          { label: "Funding Source", value: "Owner" },
          { label: "Max Investment", value: "$$$" },
        ],
      },
      {
        title: "Facility Types",
        items: [
          "Training Center: Boosts player development speed and XP gains",
          "Medical Center: Improves injury recovery rates and prevention",
          "Stadium: Increases fan engagement, revenue, and home-field advantage",
          "Practice Facility: Enhances practice quality and efficiency",
          "Film Room: Improves game preparation and opponent scouting",
          "Weight Room: Accelerates physical attribute development",
          "Cafeteria: Supports player health and conditioning",
          "Team HQ: Improves front office operations and staff efficiency",
        ],
      },
      {
        title: "Roster Management",
        description:
          "Build and maintain your roster through the draft, free agency, trades, and development. Make tough decisions during roster cuts.",
        stats: [
          { label: "Active Roster", value: "53" },
          { label: "Practice Squad", value: "16" },
          { label: "Camp Roster", value: "70" },
          { label: "IR Spots", value: "4" },
        ],
      },
      {
        title: "Roster Features",
        items: [
          "53-man active roster with depth chart requirements",
          "16-man practice squad for player development",
          "Protect 4 practice squad players weekly from poaching",
          "Elevate up to 2 practice squad players per game",
          "IR with designated-to-return options",
          "Trade players before the deadline in Week 27",
          "Waiver wire claims prioritized by record",
        ],
      },
    ],
  },
  {
    id: "systems",
    label: "Systems",
    sections: [
      {
        title: "Salary Cap",
        description:
          "Manage a realistic NFL salary cap with authentic mechanics. Balance immediate needs against long-term flexibility.",
        stats: [
          { label: "Year 1 Cap", value: "$225M" },
          { label: "Cap Floor", value: "90%" },
          { label: "Annual Growth", value: "3%" },
          { label: "Draft Pool", value: "Scaled" },
        ],
      },
      {
        title: "Cap Management Tools",
        items: [
          "Rookie wage scale: Pick #1 gets $54.5M/4yr, Pick #224 gets $3.5M/4yr",
          "Signing bonuses spread across contract years",
          "Restructure contracts to create immediate cap space",
          "Franchise and Transition tags to retain key players",
          "Dead money implications from cuts and trades",
          "Rollover unused cap space to future years",
        ],
      },
      {
        title: "NFL Draft",
        description:
          "Evaluate and select from 275 prospects across 7 rounds. Thorough scouting reveals hidden traits and true potential.",
        stats: [
          { label: "Total Picks", value: "275" },
          { label: "Rounds", value: "7" },
          { label: "R1 OVR Range", value: "72-82" },
          { label: "R7 OVR Range", value: "58-68" },
        ],
      },
      {
        title: "Draft Features",
        items: [
          "Scout prospects at Senior Bowl, Combine, Pro Days, and private workouts",
          "Discover hidden traits through thorough scouting",
          "Potential tiers: Superstar, Star, Starter, Backup, Bust Risk",
          "Bust rates increase in later rounds (15% in R1, 50% in R7)",
          "Trade up or down during the draft",
          "Compensatory picks based on previous free agent losses",
        ],
      },
      {
        title: "Player Development",
        description:
          "Players improve through practice, games, and focused training. Coaches, facilities, and traits all affect development speed.",
        items: [
          "XP earned through games and weekly practice",
          "Spend XP on attributes and badge upgrades",
          "Development archetypes affect growth potential",
          "Young players develop faster than veterans",
          "Injuries can impact long-term development",
        ],
      },
    ],
  },
  {
    id: "season",
    label: "Season",
    sections: [
      {
        title: "40-Week Calendar",
        description:
          "A complete football year with authentic timing and deadlines. Navigate the offseason, preseason, regular season, and playoffs.",
        stats: [
          { label: "Offseason", value: "12 weeks" },
          { label: "Camp/Preseason", value: "6 weeks" },
          { label: "Regular Season", value: "18 weeks" },
          { label: "Playoffs", value: "4 weeks" },
        ],
      },
      {
        title: "Key Season Events",
        items: [
          "Week 1-2: Season Awards, Pro Bowl, Championship reflections",
          "Week 3: Franchise Tag deadline and coaching decisions",
          "Week 5-8: Free agency frenzy across 3 phases",
          "Week 9-11: Scouting Combine, Pro Days, and Workouts",
          "Week 12: NFL Draft with 7 rounds and 275 prospects",
          "Week 13-14: UDFA signing, OTAs, and Rookie Camp",
          "Week 15-17: Training Camp and Preseason games",
          "Week 18: Final cuts from 70 to 53, Practice Squad formation",
          "Week 19-36: 18-game regular season",
          "Week 37-40: Playoffs and Championship",
        ],
      },
      {
        title: "Weekly Flow During Season",
        items: [
          "Sunday: GAME DAY - Watch, simulate, or manage",
          "Monday: Recovery, post-game analysis, XP distribution",
          "Tuesday: Day off, film study, scouting assignments",
          "Wednesday: Practice 1, initial injury report, install gameplan",
          "Thursday: Practice 2, refine gameplan, injury update",
          "Friday: Walkthrough, final injury report, last preparations",
          "Saturday: Travel (away games), meetings, matchup review",
        ],
      },
      {
        title: "Special Weeks",
        items: [
          "Thursday Night Football: Short week with less preparation time",
          "Monday Night Football: Extra prep time for your matchup",
          "Bye Week: Rest and development focus, no game",
          "Playoff Weeks: Higher stakes with elimination pressure",
        ],
      },
      {
        title: "Offseason Phases",
        items: [
          "Awards & Reflections: Review your season and win awards",
          "Coaching Decisions: Fire or hire coordinators, adjust philosophy",
          "Franchise Tags: Lock up key players before free agency",
          "Free Agency: 3 phases to prioritize, compete, and find value",
          "Scouting Process: Senior Bowl, Combine, Pro Days, Workouts",
          "NFL Draft: 7 rounds of prospects with hidden traits",
          "UDFA Signing: Find late-round steals",
          "OTAs & Minicamp: Early development and scheme installation",
          "Training Camp: Position battles and roster competitions",
          "Preseason Games: Evaluate depth and final preparations",
          "Roster Cuts: Trim from 70 to 53-man roster",
          "Practice Squad: Sign 16 developmental players",
        ],
      },
    ],
  },
];
