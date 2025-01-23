import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SearchFilter = "domain" | "organization" | "fingerprint" | "id" | "root";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  filter: SearchFilter;
  onFilterChange: (filter: SearchFilter) => void;
}

export const SearchBar = ({ onSearch, isLoading, filter, onFilterChange }: SearchBarProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("query") as string;
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-2xl">
      <Select value={filter} onValueChange={(value) => onFilterChange(value as SearchFilter)}>
        <SelectTrigger className="w-[200px] bg-gray-900 border-gray-700 text-white">
          <SelectValue placeholder="Search by..." />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-700 text-white">
          <SelectItem value="domain">Domain Name</SelectItem>
          <SelectItem value="organization">Organization</SelectItem>
          <SelectItem value="fingerprint">Certificate Fingerprint</SelectItem>
          <SelectItem value="id">Certificate ID</SelectItem>
          <SelectItem value="root">Root Domains</SelectItem>
        </SelectContent>
      </Select>
      <Input
        name="query"
        placeholder="Enter search query..."
        className="flex-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
      />
      <Button 
        type="submit" 
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? (
          "Searching..."
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" /> Search
          </>
        )}
      </Button>
    </form>
  );
};