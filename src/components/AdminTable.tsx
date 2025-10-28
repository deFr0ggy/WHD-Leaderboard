import { LeaderboardEntry } from "@/types/leaderboard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteEntry } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";

interface AdminTableProps {
  entries: LeaderboardEntry[];
  onUpdate: () => void;
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const AdminTable = ({ entries, onUpdate }: AdminTableProps) => {
  const { toast } = useToast();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete ${name}?`)) {
      deleteEntry(id);
      toast({
        title: "Entry deleted",
        description: `${name} has been removed from the leaderboard`,
      });
      onUpdate();
    }
  };

  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="rounded-lg border border-primary/20 bg-card/30 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-primary/20 hover:bg-muted/50">
            <TableHead>Name</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEntries.map((entry) => (
            <TableRow key={entry.id} className="border-primary/10 hover:bg-primary/5">
              <TableCell className="font-semibold">{entry.name}</TableCell>
              <TableCell>{entry.organization}</TableCell>
              <TableCell className="font-bold text-primary">{entry.score}</TableCell>
              <TableCell className="font-mono text-sm">{formatTime(entry.time)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(entry.id, entry.name)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {sortedEntries.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No entries yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
