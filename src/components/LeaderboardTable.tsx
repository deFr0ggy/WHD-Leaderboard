import { useState } from "react";
import { LeaderboardEntry } from "@/types/leaderboard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Award, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareCardGenerator } from "./ShareCardGenerator";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getConferenceSettings } from "@/lib/conferenceSettings";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const LeaderboardTable = ({ entries }: LeaderboardTableProps) => {
  const [shareEntry, setShareEntry] = useState<{ entry: LeaderboardEntry; rank: number } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDownloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `${shareEntry?.entry.name}_leaderboard_card.png`;
    link.click();
    
    toast({
      title: "Image downloaded!",
      description: "Share your achievement on social media.",
    });
  };

  const handleSocialShare = (platform: "twitter" | "facebook" | "linkedin") => {
    if (!shareEntry) return;
    
    const settings = getConferenceSettings();
    const text = `Just ranked #${shareEntry.rank} at ${settings.conferenceName} with a score of ${shareEntry.entry.score}! 🏆`;
    const url = settings.conferenceUrl;
    
    let shareUrl = "";
    
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-primary" />;
      case 2:
        return <Medal className="h-5 w-5 text-secondary" />;
      case 3:
        return <Award className="h-5 w-5 text-accent" />;
      default:
        return <span className="text-muted-foreground">#{rank}</span>;
    }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.time - b.time;
  });

  return (
    <div className="rounded-lg border border-primary/20 bg-card/30 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-primary/20 hover:bg-muted/50">
            <TableHead className="w-20">Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>University/Company</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="text-right">Time</TableHead>
            <TableHead className="w-24">Share</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEntries.map((entry, index) => (
            <TableRow
              key={entry.id}
              className={`border-primary/10 transition-all hover:bg-primary/5 ${
                index < 3 ? "bg-primary/5" : ""
              }`}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {getRankIcon(index + 1)}
                </div>
              </TableCell>
              <TableCell className="font-semibold">{entry.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {entry.organization}
              </TableCell>
              <TableCell className="text-right">
                <span className="text-lg font-bold text-primary">
                  {entry.score}
                </span>
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {formatTime(entry.time)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShareEntry({ entry, rank: index + 1 });
                    setGeneratedImage(null);
                  }}
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {sortedEntries.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No entries yet. Check back soon!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={shareEntry !== null} onOpenChange={() => setShareEntry(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share Your Achievement</DialogTitle>
            <DialogDescription>
              Download and share your leaderboard card on social media
            </DialogDescription>
          </DialogHeader>
          
          {shareEntry && (
            <>
              <ShareCardGenerator
                entry={shareEntry.entry}
                rank={shareEntry.rank}
                onGenerated={setGeneratedImage}
              />
              
              {generatedImage && (
                <div className="space-y-4">
                  <img
                    src={generatedImage}
                    alt="Leaderboard card"
                    className="w-full rounded-lg border border-primary/20"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleDownloadImage} className="flex-1">
                      Download Image
                    </Button>
                  </div>
                  <div className="border-t border-primary/20 pt-4">
                    <p className="text-sm text-muted-foreground mb-3">Share on social media:</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSocialShare("twitter")}
                        variant="outline"
                        className="flex-1 gap-2 border-primary/20"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        Twitter
                      </Button>
                      <Button
                        onClick={() => handleSocialShare("facebook")}
                        variant="outline"
                        className="flex-1 gap-2 border-primary/20"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </Button>
                      <Button
                        onClick={() => handleSocialShare("linkedin")}
                        variant="outline"
                        className="flex-1 gap-2 border-primary/20"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
