import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addEntry } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";

interface AdminFormProps {
  onSuccess: () => void;
}

export const AdminForm = ({ onSuccess }: AdminFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    score: "",
    time: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const score = parseInt(formData.score);
    const time = parseInt(formData.time);

    if (!formData.name || !formData.organization || isNaN(score) || isNaN(time)) {
      toast({
        title: "Invalid input",
        description: "Please fill all fields correctly",
        variant: "destructive",
      });
      return;
    }

    addEntry({
      name: formData.name,
      organization: formData.organization,
      score,
      time,
    });

    toast({
      title: "Entry added",
      description: `${formData.name} has been added to the leaderboard`,
    });

    setFormData({ name: "", organization: "", score: "", time: "" });
    onSuccess();
  };

  return (
    <Card className="border-primary/20 bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary">Add New Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className="border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">University/Company</Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder="MIT / Google"
              className="border-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                type="number"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                placeholder="1000"
                className="border-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time (seconds)</Label>
              <Input
                id="time"
                type="number"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="3600"
                className="border-primary/20"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Add Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
