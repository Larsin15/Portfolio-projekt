/**
 * Pattern detection utilities ported from the Python personality-miner scripts.
 */

export interface PatternMatch {
  pattern: string;
  indicator: string;
  evidence: string;
  position: number;
}

const PATTERN_INDICATORS = {
  defense_mechanism: {
    avoidance: [
      /anyway/i,
      /whatever/i,
      /doesn't matter/i,
      /not important/i,
      /let's move on/i,
      /changing topic/i,
    ],
    rationalization: [
      /makes sense because/i,
      /it's logical/i,
      /the reason is/i,
      /obviously/i,
      /clearly/i,
    ],
    projection: [
      /they always/i,
      /people are/i,
      /everyone does/i,
      /it's their fault/i,
    ],
  },
  validation_seeking: {
    approval: [
      /what do you think/i,
      /is that okay/i,
      /do you agree/i,
      /am I right/i,
      /does that make sense/i,
    ],
    people_pleasing: [
      /I didn't want to/i,
      /to make them happy/i,
      /they expected/i,
      /I had to/i,
    ],
  },
  self_victimization: {
    helplessness: [
      /I can't/i,
      /it's impossible/i,
      /there's nothing I can do/i,
      /I have no choice/i,
    ],
    blame_external: [
      /they made me/i,
      /it's because of/i,
      /if only they/i,
      /it's not my fault/i,
    ],
  },
  emotional_avoidance: {
    intellectualizing: [
      /logically/i,
      /rationally/i,
      /objectively/i,
      /from a logical standpoint/i,
    ],
    deflection: [
      /never mind/i,
      /it's fine/i,
      /I'm okay/i,
      /not a big deal/i,
    ],
  },
  boundary_issues: {
    endurance: [
      /I endure/i,
      /I put up with/i,
      /I tolerate/i,
      /until I crack/i,
      /until I can't anymore/i,
    ],
    indirectness: [
      /hard to be direct/i,
      /I hint/i,
      /I hope they understand/i,
      /without saying it/i,
    ],
  },
};

/**
 * Detect psychological patterns in text.
 */
export function detectPatterns(text: string): PatternMatch[] {
  const matches: PatternMatch[] = [];

  for (const [pattern, indicators] of Object.entries(PATTERN_INDICATORS)) {
    for (const [indicatorName, regexList] of Object.entries(indicators)) {
      for (const regex of regexList) {
        const match = text.match(regex);
        if (match) {
          // Extract surrounding context
          const start = Math.max(0, (match.index ?? 0) - 50);
          const end = Math.min(text.length, (match.index ?? 0) + match[0].length + 50);
          const evidence = text.slice(start, end);

          matches.push({
            pattern,
            indicator: indicatorName,
            evidence: `...${evidence}...`,
            position: match.index ?? 0,
          });
        }
      }
    }
  }

  return matches;
}

/**
 * Aggregate pattern matches into a summary.
 */
export function summarizePatterns(
  matches: PatternMatch[]
): Record<string, { count: number; indicators: string[] }> {
  const summary: Record<string, { count: number; indicators: string[] }> = {};

  for (const match of matches) {
    if (!summary[match.pattern]) {
      summary[match.pattern] = { count: 0, indicators: [] };
    }
    summary[match.pattern].count++;
    if (!summary[match.pattern].indicators.includes(match.indicator)) {
      summary[match.pattern].indicators.push(match.indicator);
    }
  }

  return summary;
}

