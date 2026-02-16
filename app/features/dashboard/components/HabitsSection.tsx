import { useState, useMemo } from "react";
import type { Habit, Category } from "@/types/habit";
import { HabitCard } from "./HabitCard";
import type { SortOption, FilterStatus } from "./HabitFilters";
import { HabitFilters } from "./HabitFilters";
import { HabitProgressRing } from "./HabitProgressRing";
import { EditHabitModal } from "./EditHabitModal";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HabitsSectionProps {
  habits: Habit[];
  onToggle: (id: string, date: string) => void;
  onEdit: (
    id: string,
    data: {
      title: string;
      category: Category;
      frequency: any;
      customDays?: number[];
    },
  ) => void;
  onDelete: (id: string) => void;
  onCreateClick: () => void;
}

export function HabitsSection({
  habits,
  onToggle,
  onEdit,
  onDelete,
  onCreateClick,
}: HabitsSectionProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const today = new Date().toISOString().split("T")[0];

  // Calculate today's progress
  const todayProgress = useMemo(() => {
    const completed = habits.filter((h) => h.todayCompleted).length;
    return { completed, total: habits.length };
  }, [habits, today]);

  // Filter and sort habits
  const filteredHabits = useMemo(() => {
    let result = [...habits];

    // Search filter
    if (search) {
      const query = search.toLowerCase();
      result = result.filter((h) => h.title.toLowerCase().includes(query));
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter((h) => h.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((h) => {
        const isCompleted = h.todayCompleted;
        return statusFilter === "completed" ? isCompleted : !isCompleted;
      });
    }

    // Sort
    switch (sortBy) {
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "streak":
        result.sort((a, b) => b.streak - a.streak);
        break;
      case "category":
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "recent":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }

    return result;
  }, [habits, search, categoryFilter, statusFilter, sortBy, today]);

  const handleEditClick = (habit: Habit) => {
    setEditingHabit(habit);
  };

  const handleEditSubmit = (id: string, data: any) => {
    onEdit(id, data);
    setEditingHabit(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with progress ring */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center gap-6">
          <HabitProgressRing
            completed={todayProgress.completed}
            total={todayProgress.total}
          />
          <div>
            <h2 className="text-2xl font-bold">Today's Habits</h2>
            <p className="text-muted-foreground">
              {todayProgress.completed === todayProgress.total &&
              todayProgress.total > 0
                ? "🎉 All done! Great work!"
                : `${todayProgress.total - todayProgress.completed} remaining`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <Button variant="glow" onClick={onCreateClick}>
            <Plus className="w-4 h-4 mr-2" />
            New Habit
          </Button>
        </div>
      </div>

      {/* Filters */}
      <HabitFilters
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalHabits={habits.length}
        filteredCount={filteredHabits.length}
      />

      {/* Habits display */}
      {habits.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No habits yet</h3>
          <p className="text-muted-foreground mb-6">
            Start building better habits by creating your first one!
          </p>
          <Button variant="glow" onClick={onCreateClick}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Habit
          </Button>
        </div>
      ) : filteredHabits.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-muted-foreground">
            No habits match your filters. Try adjusting your search criteria.
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              : "flex flex-col gap-3"
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredHabits.map((habit) => (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <HabitCard
                  habit={habit}
                  onToggle={onToggle}
                  onEdit={handleEditClick}
                  onDelete={onDelete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Edit modal */}
      <EditHabitModal
        open={!!editingHabit}
        habit={editingHabit}
        onClose={() => setEditingHabit(null)}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
}
