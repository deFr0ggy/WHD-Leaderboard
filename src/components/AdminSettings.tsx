import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getConferenceSettings, saveConferenceSettings, ConferenceSettings } from "@/lib/conferenceSettings";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";

export const AdminSettings = () => {
  const [settings, setSettings] = useState<ConferenceSettings>(getConferenceSettings());
  const { toast } = useToast();

  const handleSave = () => {
    saveConferenceSettings(settings);
    toast({
      title: "Settings saved",
      description: "Conference settings have been updated successfully.",
    });
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Conference Settings
        </CardTitle>
        <CardDescription>Configure conference and village details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="conferenceName">Conference Name</Label>
          <Input
            id="conferenceName"
            value={settings.conferenceName}
            onChange={(e) => setSettings({ ...settings, conferenceName: e.target.value })}
            placeholder="WhiteHatDesert Conference 2025"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="villageName">Village Name</Label>
          <Input
            id="villageName"
            value={settings.villageName}
            onChange={(e) => setSettings({ ...settings, villageName: e.target.value })}
            placeholder="Hospitalizing Malware Village"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="conferenceDate">Conference Date</Label>
          <Input
            id="conferenceDate"
            value={settings.conferenceDate}
            onChange={(e) => setSettings({ ...settings, conferenceDate: e.target.value })}
            placeholder="15th November 2025"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="conferenceUrl">Conference URL</Label>
          <Input
            id="conferenceUrl"
            value={settings.conferenceUrl}
            onChange={(e) => setSettings({ ...settings, conferenceUrl: e.target.value })}
            placeholder="https://whitehatdesert.com"
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};
