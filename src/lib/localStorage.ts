import { LeaderboardEntry } from "@/types/leaderboard";

const STORAGE_KEY = "whitehat_leaderboard";

export const getLeaderboardData = (): LeaderboardEntry[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLeaderboardData = (entries: LeaderboardEntry[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const addEntry = (entry: Omit<LeaderboardEntry, "id" | "timestamp">): void => {
  const entries = getLeaderboardData();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  entries.push(newEntry);
  saveLeaderboardData(entries);
};

export const updateEntry = (id: string, updates: Partial<LeaderboardEntry>): void => {
  const entries = getLeaderboardData();
  const index = entries.findIndex((e) => e.id === id);
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updates };
    saveLeaderboardData(entries);
  }
};

export const deleteEntry = (id: string): void => {
  const entries = getLeaderboardData();
  const filtered = entries.filter((e) => e.id !== id);
  saveLeaderboardData(filtered);
};
