import { LeaderboardEntry } from "@/types/leaderboard";
import { ConferenceSettings } from "./conferenceSettings";
import jsPDF from "jspdf";

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const exportToCSV = (entries: LeaderboardEntry[], settings: ConferenceSettings) => {
  const sortedEntries = [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.time - b.time;
  });

  const headers = ["Rank", "Name", "University/Company", "Score", "Time"];
  const rows = sortedEntries.map((entry, index) => [
    index + 1,
    entry.name,
    entry.organization,
    entry.score,
    formatTime(entry.time),
  ]);

  const csvContent = [
    [settings.conferenceName],
    [settings.villageName],
    [`Date: ${settings.conferenceDate}`],
    [`URL: ${settings.conferenceUrl}`],
    [],
    headers,
    ...rows,
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${settings.villageName}_Leaderboard.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (entries: LeaderboardEntry[], settings: ConferenceSettings) => {
  const sortedEntries = [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.time - b.time;
  });

  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(34, 197, 94); // cyber green
  doc.text(settings.conferenceName, 105, 20, { align: "center" });
  
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(settings.villageName, 105, 30, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(settings.conferenceDate, 105, 37, { align: "center" });
  doc.text(settings.conferenceUrl, 105, 42, { align: "center" });
  
  // Line separator
  doc.setDrawColor(34, 197, 94);
  doc.line(20, 48, 190, 48);
  
  // Table headers
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  let y = 58;
  doc.text("Rank", 25, y);
  doc.text("Name", 45, y);
  doc.text("University/Company", 95, y);
  doc.text("Score", 155, y);
  doc.text("Time", 175, y);
  
  y += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, y, 190, y);
  
  // Table rows
  doc.setFontSize(10);
  y += 8;
  
  sortedEntries.forEach((entry, index) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    
    // Highlight top 3
    if (index < 3) {
      doc.setFillColor(34, 197, 94, 0.1);
      doc.rect(20, y - 5, 170, 8, "F");
    }
    
    doc.setTextColor(0, 0, 0);
    doc.text(`#${index + 1}`, 25, y);
    doc.text(entry.name, 45, y);
    doc.text(entry.organization.substring(0, 30), 95, y);
    doc.text(entry.score.toString(), 155, y);
    doc.text(formatTime(entry.time), 175, y);
    
    y += 10;
  });
  
  doc.save(`${settings.villageName}_Leaderboard.pdf`);
};
