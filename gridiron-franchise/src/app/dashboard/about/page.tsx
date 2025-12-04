"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

// Feature section component
function FeatureSection({
  title,
  items,
  highlight,
}: {
  title: string;
  items: string[];
  highlight?: string;
}) {
  return (
    <div className="bg-secondary/50 border border-border rounded-xl p-4 space-y-3">
      <h3 className="font-bold text-sm uppercase tracking-wide text-primary">
        {title}
      </h3>
      {highlight && (
        <p className="text-2xl font-bold">{highlight}</p>
      )}
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Stat box component
function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-secondary/30 border border-border rounded-lg p-3 text-center">
      <p className="text-xl sm:text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

// System card component
function SystemCard({
  title,
  description,
  stats,
}: {
  title: string;
  description: string;
  stats: { label: string; value: string }[];
}) {
  return (
    <div className="bg-secondary/50 border border-border rounded-xl p-4 space-y-3">
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <p className="font-bold text-primary">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="px-5 space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4 py-4">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground transition-colors text-xl"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold">About Gridiron Franchise</h1>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-4 py-4">
        <div className="w-20 h-20 mx-auto bg-primary/20 rounded-2xl flex items-center justify-center">
          <span className="text-4xl">🏈</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Gridiron Franchise</h2>
          <p className="text-muted-foreground mt-1">
            The Ultimate Football Management Simulation
          </p>
        </div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Build a dynasty. Develop players. Outsmart the competition.
          Experience the deepest football franchise simulation ever created.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatBox label="Positions" value="18" />
        <StatBox label="Archetypes" value="70" />
        <StatBox label="Traits" value="44" />
        <StatBox label="Badges" value="43" />
      </div>

      {/* Core Philosophy */}
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 space-y-2">
        <h3 className="font-bold text-primary">Our Philosophy</h3>
        <p className="text-sm text-muted-foreground">
          Every decision matters. From scouting a late-round gem to managing your
          salary cap, from choosing your offensive scheme to developing your practice
          squad—Gridiron Franchise gives you complete control over your franchise&apos;s destiny.
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-border pt-4">
        <h2 className="text-lg font-bold mb-4">Deep Simulation Systems</h2>
      </div>

      {/* Player Generation */}
      <FeatureSection
        title="Player Generation"
        highlight="70 Unique Archetypes"
        items={[
          "18 positions with authentic depth chart requirements",
          "Primary + secondary archetypes shape each player's identity",
          "Physical attributes: Speed, Acceleration, Strength, Agility, Jumping",
          "Mental attributes: Awareness, Play Recognition, Decision Making",
          "Position-specific ratings (Route Running, Pass Block, Zone Coverage, etc.)",
          "OVR ranges from 40-99 with weighted calculations per position",
          "Realistic height/weight/age distributions",
        ]}
      />

      {/* Traits System */}
      <FeatureSection
        title="Player Traits"
        highlight="44 Unique Traits"
        items={[
          "7 categories: Leadership, Work Ethic, On-Field, Durability, Contract, Clutch, Character",
          "Positive traits like 'Gym Rat', 'Clutch', 'Field General', 'Iron Man'",
          "Negative traits like 'Diva', 'Lazy', 'Injury Prone', 'Locker Room Cancer'",
          "Hidden traits revealed through scouting and gameplay",
          "Trait synergies: Gym Rat + Focused = Workout Warrior",
          "Traits evolve over a player's career based on performance",
          "Some traits affect chemistry, contracts, and team morale",
        ]}
      />

      {/* Badges System */}
      <FeatureSection
        title="Badge System"
        highlight="4 Tiers of Excellence"
        items={[
          "43 badges unlock situational bonuses in games",
          "Bronze (+2-5), Silver (+4-8), Gold (+6-12), Hall of Fame (+9-15)",
          "Situational activations: Clutch moments, Red Zone, Prime Time, Playoffs",
          "Position-specific badges (Pocket Surgeon, Ball Hawk, Pancake Artist)",
          "Universal badges (Clutch Gene, Prime Time Performer, Playoff Hero)",
          "Earn badges through XP and on-field performance",
        ]}
      />

      {/* Divider */}
      <div className="border-t border-border pt-4">
        <h2 className="text-lg font-bold mb-4">Franchise Management</h2>
      </div>

      {/* GM System */}
      <SystemCard
        title="GM Skills & Perks"
        description="Your GM has a unique background and archetype that shapes how you build your franchise."
        stats={[
          { label: "Backgrounds", value: "5" },
          { label: "Archetypes", value: "5" },
          { label: "Skill Trees", value: "8" },
          { label: "Perk Tiers", value: "3" },
        ]}
      />

      <FeatureSection
        title="GM Backgrounds"
        items={[
          "Scout: Superior player evaluation and draft preparation",
          "Coach: Better player development and scheme understanding",
          "Agent: Contract negotiation advantages and cap management",
          "Executive: Improved trading and front office operations",
          "Analytics: Data-driven insights and advanced metrics",
        ]}
      />

      <FeatureSection
        title="GM Archetypes"
        items={[
          "Builder: Long-term vision, draft-focused dynasty building",
          "Trader: Aggressive deal-making, always looking for value",
          "Developer: Player growth focus, coaching synergies",
          "Negotiator: Contract wizardry, cap space maximization",
          "Talent Scout: Elite evaluation, find diamonds in the rough",
        ]}
      />

      {/* Coaching System */}
      <SystemCard
        title="Coaching Staff"
        description="Hire coordinators, choose schemes, and develop your coaching philosophy."
        stats={[
          { label: "Coaching Roles", value: "4" },
          { label: "Offensive Schemes", value: "6" },
          { label: "Defensive Schemes", value: "5" },
          { label: "Coach Perks", value: "3 Tiers" },
        ]}
      />

      <FeatureSection
        title="Offensive Schemes"
        items={[
          "West Coast: Short/intermediate passing, high completion%",
          "Air Raid: Spread formations, aggressive downfield passing",
          "Power Run: Dominant rushing attack, physical football",
          "Spread Option: Dual-threat QB, RPO-heavy offense",
          "Pro Style: Balanced attack, multiple formations",
          "Smashmouth: Ground-and-pound, time of possession",
        ]}
      />

      <FeatureSection
        title="Defensive Schemes"
        items={[
          "4-3 Under: Balanced front, versatile coverage",
          "3-4 Odd: Two-gap DL, athletic OLBs, pressure packages",
          "Tampa 2: Zone coverage, Cover 2 base, run support safeties",
          "Man Press: Aggressive CBs, tight coverage, risk/reward",
          "Multiple: Hybrid scheme, adapts to opponent strengths",
        ]}
      />

      {/* Scouting System */}
      <SystemCard
        title="Scouting Department"
        description="Build your scouting team to find the best players in the draft and free agency."
        stats={[
          { label: "Scout Roles", value: "4" },
          { label: "Weekly Points", value: "230-290" },
          { label: "Max Staff", value: "5" },
          { label: "Perk Trees", value: "3" },
        ]}
      />

      <FeatureSection
        title="Scouting Features"
        items={[
          "Director of Scouting (required) leads your department",
          "Area Scouts cover specific regions for local knowledge",
          "Pro Scouts evaluate NFL players for trades/FA",
          "National Scout provides broad college coverage",
          "Report quality scales with scout OVR and time invested",
          "Hidden traits and real potential revealed through scouting",
        ]}
      />

      {/* Facilities System */}
      <SystemCard
        title="Facilities"
        description="Upgrade your team's infrastructure for competitive advantages."
        stats={[
          { label: "Facility Types", value: "8" },
          { label: "Upgrade Tiers", value: "5" },
          { label: "Funding Source", value: "Owner" },
          { label: "Max Investment", value: "$$$" },
        ]}
      />

      <FeatureSection
        title="Facility Types"
        items={[
          "Training Center: Player development speed and XP gains",
          "Medical Center: Injury recovery rates and prevention",
          "Stadium: Fan engagement, revenue, and home-field advantage",
          "Practice Facility: Practice quality and efficiency",
          "Film Room: Game preparation and opponent scouting",
          "Weight Room: Physical attribute development",
          "Cafeteria: Player health and conditioning",
          "Team HQ: Front office operations and staff efficiency",
        ]}
      />

      {/* Divider */}
      <div className="border-t border-border pt-4">
        <h2 className="text-lg font-bold mb-4">Season & Gameplay</h2>
      </div>

      {/* Calendar System */}
      <SystemCard
        title="40-Week Season Calendar"
        description="A complete football year with authentic timing and deadlines."
        stats={[
          { label: "Offseason", value: "12 weeks" },
          { label: "Camp/Preseason", value: "6 weeks" },
          { label: "Regular Season", value: "18 weeks" },
          { label: "Playoffs", value: "4 weeks" },
        ]}
      />

      <FeatureSection
        title="Key Season Events"
        items={[
          "Week 1-2: Season Awards, Pro Bowl, Championship reflections",
          "Week 3: Franchise Tag deadline, coaching decisions",
          "Week 5-8: Free agency frenzy (3 phases)",
          "Week 9-11: Scouting Combine, Pro Days, Workouts",
          "Week 12: NFL Draft (7 rounds, 275 prospects)",
          "Week 13-14: UDFA signing, OTAs, Rookie Camp",
          "Week 15-17: Training Camp, Preseason games",
          "Week 18: Final cuts (70→53), Practice Squad formation",
          "Week 19-36: 18-game regular season",
          "Week 37-40: Playoffs and Championship",
        ]}
      />

      {/* Weekly Flow */}
      <FeatureSection
        title="Weekly Flow (In-Season)"
        items={[
          "Sunday: GAME DAY - Watch, simulate, or manage",
          "Monday: Recovery, post-game analysis, XP distribution",
          "Tuesday: Day off, film study, scouting assignments",
          "Wednesday: Practice 1, initial injury report, install gameplan",
          "Thursday: Practice 2, refine gameplan, injury update",
          "Friday: Walkthrough, final injury report, last preparations",
          "Saturday: Travel (away), meetings, matchup review",
          "Special weeks: TNF (short week), MNF (extra prep), Bye (rest/development)",
        ]}
      />

      {/* Offseason */}
      <FeatureSection
        title="18-Phase Offseason"
        items={[
          "Awards & Reflections: Review your season, win awards",
          "Coaching Decisions: Fire/hire coordinators, adjust philosophy",
          "Franchise Tags: Lock up key players before free agency",
          "Free Agency: 3 phases - prioritize, compete, find value",
          "Scouting Process: Senior Bowl, Combine, Pro Days, Workouts",
          "NFL Draft: 7 rounds of prospects with hidden traits",
          "UDFA Signing: Find late-round steals",
          "OTAs & Minicamp: Early development, scheme installation",
          "Training Camp: Position battles, roster competitions",
          "Preseason Games: Evaluate depth, final preparations",
          "Roster Cuts: Trim from 70 to 53-man roster",
          "Practice Squad: Sign 16 developmental players",
        ]}
      />

      {/* Divider */}
      <div className="border-t border-border pt-4">
        <h2 className="text-lg font-bold mb-4">Economy & Roster</h2>
      </div>

      {/* Salary Cap */}
      <SystemCard
        title="Salary Cap System"
        description="Manage a realistic NFL salary cap with authentic mechanics."
        stats={[
          { label: "Year 1 Cap", value: "$225M" },
          { label: "Cap Floor", value: "90%" },
          { label: "Annual Growth", value: "3%" },
          { label: "Draft Pool", value: "Scaled" },
        ]}
      />

      <FeatureSection
        title="Cap Management Tools"
        items={[
          "Rookie wage scale: Pick #1 gets $54.5M/4yr, Pick #224 gets $3.5M/4yr",
          "Signing bonuses spread across contract years",
          "Restructure contracts to create immediate cap space",
          "Franchise and Transition tags to retain key players",
          "Dead money implications from cuts and trades",
          "Cap casualties create FA opportunities",
          "Rollover unused cap space to future years",
        ]}
      />

      {/* Roster */}
      <SystemCard
        title="Roster Management"
        description="Build and maintain your 53-man roster plus practice squad."
        stats={[
          { label: "Active Roster", value: "53" },
          { label: "Practice Squad", value: "16" },
          { label: "Camp Roster", value: "70" },
          { label: "IR Spots", value: "4" },
        ]}
      />

      <FeatureSection
        title="Roster Features"
        items={[
          "53-man active roster with depth chart requirements",
          "16-man practice squad for player development",
          "Protect 4 PS players weekly from poaching",
          "Elevate up to 2 PS players per game (3x limit each)",
          "IR with designated-to-return options",
          "Weekly injury management and game-time decisions",
          "Trade players before deadline (Week 27)",
          "Waiver wire claims (priority by record)",
        ]}
      />

      {/* Draft System */}
      <SystemCard
        title="Draft System"
        description="Evaluate and select from 275 prospects across 7 rounds."
        stats={[
          { label: "Draft Picks", value: "275" },
          { label: "Rounds", value: "7" },
          { label: "R1 OVR Range", value: "72-82" },
          { label: "R7 OVR Range", value: "58-68" },
        ]}
      />

      <FeatureSection
        title="Draft Features"
        items={[
          "Scout prospects at Senior Bowl, Combine, Pro Days, private workouts",
          "Discover hidden traits through thorough scouting",
          "Potential tiers: Superstar, Star, Starter, Backup, Bust Risk",
          "Bust rates increase in later rounds (15% R1, 50% R7)",
          "Trade up or down during the draft",
          "Compensatory picks based on previous FA losses",
          "Sign all picks to rookie-scale contracts",
        ]}
      />

      {/* Footer */}
      <div className="border-t border-border pt-6 space-y-4">
        <div className="text-center space-y-2">
          <p className="text-sm font-bold">Version 0.2.0</p>
          <p className="text-xs text-muted-foreground">
            Built with passion for football and simulation gaming
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/dashboard" className="block">
            <Button variant="outline" className="w-full">
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/dev-tools" className="block">
            <Button variant="outline" className="w-full">
              Dev Tools
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
