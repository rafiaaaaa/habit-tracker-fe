import type { Habit } from "@/types/habit";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/types/habit";
import { Check, Flame, MoreVertical, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatLocalDate } from "@/utils/date";
import { useHabits } from "../context/useHabits";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string, date: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export function HabitCard({
  habit,
  onToggle,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const today = new Date().toISOString().split("T")[0];
  const isCompletedToday = habit.habitRecords[today];

  const categoryColor = CATEGORY_COLORS[habit.category];
  const categoryIcon = CATEGORY_ICONS[habit.category];

  const {
    toggleHabitCompletion,
    isToggleCompleteHabitLoading,
    deleteHabit,
    isDeleteHabitLoading,
  } = useHabits();

  // Get last 7 days for mini calendar
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0); // normalize
    date.setDate(date.getDate() - (6 - i));

    return { date: formatLocalDate(date), name: DAY_NAMES[date.getDay()] };
  });

  return (
    <div className="glass rounded-2xl p-5 hover:glow-primary-sm transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 lowercase">
          <span className="text-2xl">{categoryIcon}</span>
          <div>
            <h3 className="font-semibold text-lg">{habit.title}</h3>
            <div className="flex gap-2">
              <span
                className="text-xs rounded-full capitalize"
                style={{
                  backgroundColor: `${categoryColor}20`,
                  color: categoryColor,
                }}
              >
                {habit.category}
              </span>
              <span className="text-muted-foreground text-xs capitalize">
                {habit.frequency}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(habit)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => deleteHabit(habit.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Streak info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5 text-warning">
          <Flame className="w-4 h-4" />
          <span className="font-medium">{habit.streak}</span>
          <span className="text-muted-foreground text-sm">streak</span>
        </div>
        <span className="text-muted-foreground text-sm">
          Best: {habit.longestStreak}
        </span>
      </div>

      {/* Mini calendar */}
      <div className="flex items-center gap-1.5 mb-4">
        {last7Days.map((day) => {
          const entry = habit.habitRecords[day.date];
          const isCompleted = entry;
          const isToday = day.date === today;

          return (
            <div className="flex-col items-center flex-1" key={day.date}>
              <span className="text-xs">{day.name}</span>
              <div
                key={day.date}
                className={`w-6 h-6 rounded-md flex items-center justify-center text-xs transition-all ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isToday
                      ? "bg-secondary border border-primary/50"
                      : "bg-secondary"
                }`}
              >
                {isCompleted && <Check className="w-3 h-3" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Complete button */}
      <Button
        variant={isCompletedToday ? "default" : "outline"}
        className="w-full"
        disabled={isToggleCompleteHabitLoading}
        onClick={() => toggleHabitCompletion(habit.id)}
      >
        {isCompletedToday ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Completed
          </>
        ) : (
          "Mark Complete"
        )}
      </Button>
    </div>
  );
}
