import { useRef, useEffect } from "react";
import { LeaderboardEntry } from "@/types/leaderboard";
import { getConferenceSettings } from "@/lib/conferenceSettings";
import QRCode from "qrcode";
import { Trophy, Medal, Award } from "lucide-react";

interface ShareCardProps {
  entry: LeaderboardEntry;
  rank: number;
  onGenerated: (dataUrl: string) => void;
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const ShareCardGenerator = ({ entry, rank, onGenerated }: ShareCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateCard = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const settings = getConferenceSettings();
      const isTopTen = rank <= 10;
      
      // Set canvas size
      canvas.width = 1200;
      canvas.height = 630;

      // Background gradient - vibrant cyberpunk colors
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (rank === 1) {
        gradient.addColorStop(0, "#0a1628");
        gradient.addColorStop(0.5, "#1a0a3a");
        gradient.addColorStop(1, "#0f1a2e");
      } else if (rank === 2) {
        gradient.addColorStop(0, "#0a1628");
        gradient.addColorStop(0.5, "#0a2a3a");
        gradient.addColorStop(1, "#0f1a2e");
      } else if (rank === 3) {
        gradient.addColorStop(0, "#0a1628");
        gradient.addColorStop(0.5, "#2a0a2a");
        gradient.addColorStop(1, "#0f1a2e");
      } else if (isTopTen) {
        gradient.addColorStop(0, "#0a1628");
        gradient.addColorStop(0.5, "#1a1a2a");
        gradient.addColorStop(1, "#0f1a2e");
      } else {
        gradient.addColorStop(0, "#0a0a1a");
        gradient.addColorStop(1, "#0f1a2e");
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add circuit pattern overlay
      ctx.strokeStyle = "rgba(0, 217, 255, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        const y = (canvas.height / 20) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Add glow effect for top ranks
      if (isTopTen) {
        ctx.shadowBlur = 40;
        ctx.shadowColor = rank === 1 ? "#ff0033" : rank === 2 ? "#00d9ff" : rank === 3 ? "#ff1493" : "#ec4899";
      }

      // Border with vibrant colors
      ctx.strokeStyle = isTopTen ? (rank === 1 ? "#ff0033" : rank === 2 ? "#00d9ff" : rank === 3 ? "#ff1493" : "#ec4899") : "#06b6d4";
      ctx.lineWidth = 6;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
      
      ctx.shadowBlur = 0;

      // Rank badge with vibrant colors
      ctx.fillStyle = isTopTen ? (rank === 1 ? "#ff0033" : rank === 2 ? "#00d9ff" : rank === 3 ? "#ff1493" : "#ec4899") : "#06b6d4";
      ctx.beginPath();
      ctx.arc(150, 120, 70, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow to badge
      ctx.shadowBlur = 20;
      ctx.shadowColor = isTopTen ? (rank === 1 ? "#ff0033" : rank === 2 ? "#00d9ff" : rank === 3 ? "#ff1493" : "#ec4899") : "#06b6d4";
      ctx.fill();
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = "#000";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`#${rank}`, 150, 140);

      // Conference name with gradient effect
      const conferenceGradient = ctx.createLinearGradient(250, 80, 250, 120);
      conferenceGradient.addColorStop(0, "#ff0033");
      conferenceGradient.addColorStop(1, "#ff1493");
      ctx.fillStyle = conferenceGradient;
      ctx.font = "bold 42px Arial";
      ctx.textAlign = "left";
      ctx.fillText(settings.conferenceName, 250, 100);

      // Village name
      ctx.fillStyle = "#00d9ff";
      ctx.font = "bold 24px Arial";
      ctx.fillText(settings.villageName, 250, 135);

      // Participant name
      ctx.fillStyle = "#fff";
      ctx.font = "bold 56px Arial";
      ctx.fillText(entry.name, 100, 280);

      // Organization
      ctx.fillStyle = "#aaa";
      ctx.font = "32px Arial";
      ctx.fillText(entry.organization, 100, 330);

      // Score with pink accent
      ctx.fillStyle = "#ff1493";
      ctx.font = "bold 48px Arial";
      ctx.fillText(`Score: ${entry.score}`, 100, 420);

      // Time with cyan accent
      ctx.fillStyle = "#00d9ff";
      ctx.font = "bold 48px Arial";
      ctx.fillText(`Time: ${formatTime(entry.time)}`, 100, 480);

      // Footer
      ctx.fillStyle = "#888";
      ctx.font = "20px Arial";
      ctx.fillText(settings.conferenceDate, 100, 560);
      ctx.fillStyle = "#00d9ff";
      ctx.fillText(settings.conferenceUrl, 100, 590);

      // Generate QR code with vibrant colors
      try {
        const qrDataUrl = await QRCode.toDataURL(settings.conferenceUrl, {
          width: 150,
          margin: 1,
          color: {
            dark: "#00d9ff",
            light: "#000000"
          }
        });
        const qrImage = new Image();
        qrImage.onload = () => {
          ctx.drawImage(qrImage, canvas.width - 200, canvas.height - 200, 150, 150);
          onGenerated(canvas.toDataURL("image/png"));
        };
        qrImage.src = qrDataUrl;
      } catch (error) {
        console.error("Error generating QR code:", error);
        onGenerated(canvas.toDataURL("image/png"));
      }
    };

    generateCard();
  }, [entry, rank, onGenerated]);

  return <canvas ref={canvasRef} style={{ display: "none" }} />;
};
