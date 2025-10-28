import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search by name or organization..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 border-primary/20 bg-card/30 backdrop-blur-sm focus-visible:ring-primary"
      />
    </div>
  );
};
