export interface LeaderboardEntry {
  id: string;
  name: string;
  organization: string;
  score: number;
  time: number; // in seconds
  timestamp: number;
}
