/** Start of today in UTC, used as the lower bound of "upcoming" games. */
export function startOfToday(): string {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  return now.toISOString();
}

export type RatingPeriod = "all" | "year" | "month";

export const RATING_PERIODS: RatingPeriod[] = ["all", "year", "month"];

/** Lower bound for the rating period, or undefined for all time. */
export function periodStart(period: RatingPeriod): string | undefined {
  const now = new Date();
  switch (period) {
    case "year":
      return new Date(Date.UTC(now.getUTCFullYear(), 0, 1)).toISOString();
    case "month":
      return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
    case "all":
      return undefined;
  }
}

export function parsePeriod(value: string | string[] | undefined): RatingPeriod {
  return RATING_PERIODS.includes(value as RatingPeriod) ? (value as RatingPeriod) : "all";
}
