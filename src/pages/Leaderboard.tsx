import { useState, useEffect } from "react";
import { LeaderboardEntry } from "@/types/leaderboard";
import { getLeaderboardData } from "@/lib/localStorage";
import { LeaderboardHeader } from "@/components/LeaderboardHeader";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { SearchBar } from "@/components/SearchBar";

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = () => {
      setEntries(getLeaderboardData());
    };
    
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredEntries = entries.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <LeaderboardHeader />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <h2 className="text-2xl font-bold">Live Rankings</h2>

        <div className="space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <LeaderboardTable entries={filteredEntries} />
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
