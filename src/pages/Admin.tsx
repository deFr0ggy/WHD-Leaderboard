import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LeaderboardEntry } from "@/types/leaderboard";
import { getLeaderboardData } from "@/lib/localStorage";
import { LeaderboardHeader } from "@/components/LeaderboardHeader";
import { AdminForm } from "@/components/AdminForm";
import { AdminTable } from "@/components/AdminTable";
import { AdminSettings } from "@/components/AdminSettings";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, LogOut } from "lucide-react";
import { exportToCSV, exportToPDF } from "@/lib/exportUtils";
import { getConferenceSettings } from "@/lib/conferenceSettings";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin_authenticated");
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [navigate]);

  const loadData = () => {
    setEntries(getLeaderboardData());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportCSV = () => {
    const settings = getConferenceSettings();
    exportToCSV(entries, settings);
    toast({
      title: "CSV exported",
      description: "Leaderboard data has been exported to CSV.",
    });
  };

  const handleExportPDF = () => {
    const settings = getConferenceSettings();
    exportToPDF(entries, settings);
    toast({
      title: "PDF exported",
      description: "Leaderboard data has been exported to PDF.",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    navigate("/admin");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <LeaderboardHeader />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Admin Dashboard</h2>
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="outline" className="gap-2 border-primary/20">
                <ArrowLeft className="h-4 w-4" />
                View Leaderboard
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} className="gap-2 border-primary/20">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <AdminSettings />
            <AdminForm onSuccess={loadData} />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Recent Entries ({entries.length})</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  className="gap-2 border-primary/20"
                >
                  <Download className="h-4 w-4" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPDF}
                  className="gap-2 border-primary/20"
                >
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
              </div>
            </div>
            <AdminTable entries={entries} onUpdate={loadData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
