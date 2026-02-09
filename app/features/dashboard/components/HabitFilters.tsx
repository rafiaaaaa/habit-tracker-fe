import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/types/habit";
import type { Category } from "@/types/habit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";

export type SortOption = "name" | "streak" | "category" | "recent";
export type FilterStatus = "all" | "completed" | "pending";

interface HabitFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: Category | "all";
  onCategoryChange: (value: Category | "all") => void;
  statusFilter: FilterStatus;
  onStatusChange: (value: FilterStatus) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  totalHabits: number;
  filteredCount: number;
}

const categories: (Category | "all")[] = [
  "all",
  "health",
  "fitness",
  "productivity",
  "learning",
  "mindfulness",
  "social",
  "finance",
  "other",
];

export function HabitFilters({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  totalHabits,
  filteredCount,
}: HabitFiltersProps) {
  const hasActiveFilters =
    search || categoryFilter !== "all" || statusFilter !== "all";

  const clearFilters = () => {
    onSearchChange("");
    onCategoryChange("all");
    onStatusChange("all");
  };

  return (
    <div className="space-y-4">
      {/* Search and main controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search habits..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-secondary/50 border-border"
          />
        </div>

        {/* Category filter */}
        <Select
          value={categoryFilter}
          onValueChange={(v) => onCategoryChange(v as Category | "all")}
        >
          <SelectTrigger className="w-full sm:w-40 bg-secondary/50">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                <span className="flex items-center gap-2">
                  {cat !== "all" && <span>{CATEGORY_ICONS[cat]}</span>}
                  <span className="capitalize">
                    {cat === "all" ? "All Categories" : cat}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select
          value={statusFilter}
          onValueChange={(v) => onStatusChange(v as FilterStatus)}
        >
          <SelectTrigger className="w-full sm:w-35 bg-secondary/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">✓ Completed</SelectItem>
            <SelectItem value="pending">○ Pending</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={sortBy}
          onValueChange={(v) => onSortChange(v as SortOption)}
        >
          <SelectTrigger className="w-full sm:w-35 bg-secondary/50">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="streak">Longest Streak</SelectItem>
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="recent">Recently Added</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count and clear */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {hasActiveFilters
            ? `Showing ${filteredCount} of ${totalHabits} habits`
            : `${totalHabits} habit${totalHabits !== 1 ? "s" : ""}`}
        </span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
