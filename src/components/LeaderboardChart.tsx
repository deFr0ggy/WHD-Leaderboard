import { LeaderboardEntry } from "@/types/leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface LeaderboardChartProps {
  entries: LeaderboardEntry[];
}

export const LeaderboardChart = ({ entries }: LeaderboardChartProps) => {
  const topEntries = [...entries]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.time - b.time;
    })
    .slice(0, 10)
    .map((entry) => ({
      name: entry.name.split(" ")[0],
      score: entry.score,
    }));

  return (
    <Card className="border-primary/20 bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">Top 10 Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topEntries}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
            <YAxis stroke="hsl(var(--foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Bar dataKey="score" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
