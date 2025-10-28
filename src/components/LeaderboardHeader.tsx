import { Trophy } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export const LeaderboardHeader = () => {
  return (
    <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary text-glow-green" />
            <div>
              <h1 className="text-3xl font-bold text-primary text-glow-green">
                WhiteHatDesert Conference 2025
              </h1>
              <p className="text-sm text-muted-foreground">
                Hospitalizing Malware Leaderboard
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
