export interface DailyUsage {
  userId: string;
  date: string;  // YYYY-MM-DD format
  count: number;
  lastUpdated: Date;
} 