import { useState, useEffect } from "react";
import type { Habit, Category, Frequency } from "@/types/habit";
import { CATEGORY_ICONS } from "@/types/habit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";

interface EditHabitModalProps {
  open: boolean;
  habit: Habit | null;
  onClose: () => void;
  onSubmit: (
    id: string,
    data: {
      title: string;
      category: Category;
      frequency: Frequency;
      customDays?: number[];
    },
  ) => void;
}

const categories: Category[] = [
  "health",
  "fitness",
  "productivity",
  "learning",
  "mindfulness",
  "social",
  "finance",
  "other",
];

const frequencies: { value: Frequency; label: string }[] = [
  { value: "daily", label: "Every day" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom days" },
];

const weekDays = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

export function EditHabitModal({
  open,
  habit,
  onClose,
  onSubmit,
}: EditHabitModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("health");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [customDays, setCustomDays] = useState<number[]>([1, 2, 3, 4, 5]);

  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setCategory(habit.category);
      setFrequency(habit.frequency);
      setCustomDays(habit.customDays || [1, 2, 3, 4, 5]);
    }
  }, [habit]);

  const handleSubmit = () => {
    if (!habit || !title.trim()) return;

    onSubmit(habit.id, {
      title: title.trim(),
      category,
      frequency,
      customDays: frequency === "custom" ? customDays : undefined,
    });

    onClose();
  };

  const toggleDay = (day: number) => {
    setCustomDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort(),
    );
  };

  if (!habit) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">Habit Name</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning Meditation"
              className="bg-secondary/50"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as Category)}
            >
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <span className="flex items-center gap-2">
                      <span>{CATEGORY_ICONS[cat]}</span>
                      <span className="capitalize">{cat}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select
              value={frequency}
              onValueChange={(v) => setFrequency(v as Frequency)}
            >
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((freq) => (
                  <SelectItem key={freq.value} value={freq.value}>
                    {freq.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom days */}
          {frequency === "custom" && (
            <div className="space-y-2">
              <Label>Select Days</Label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => (
                  <div
                    key={day.value}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                      customDays.includes(day.value)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                    onClick={() => toggleDay(day.value)}
                  >
                    <span className="text-sm font-medium">{day.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="glow"
            onClick={handleSubmit}
            disabled={!title.trim()}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
