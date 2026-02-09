import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, Frequency } from "@/types/habit";
import { CATEGORY_ICONS } from "@/types/habit";

interface CreateHabitModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (habit: {
    title: string;
    category: Category;
    frequency: Frequency;
    customDays?: number[];
  }) => Promise<void>;
  canCreate: boolean;
}

const categories: { value: Category; label: string }[] = [
  { value: "health", label: "Health" },
  { value: "fitness", label: "Fitness" },
  { value: "productivity", label: "Productivity" },
  { value: "learning", label: "Learning" },
  { value: "mindfulness", label: "Mindfulness" },
  { value: "social", label: "Social" },
  { value: "finance", label: "Finance" },
  { value: "other", label: "Other" },
];

const frequencies: { value: Frequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom" },
];

const weekdays = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

export function CreateHabitModal({
  open,
  onClose,
  onSubmit,
  canCreate,
}: CreateHabitModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("health");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !canCreate) return;

    setIsSubmitting(true);
    await onSubmit({
      title: title.trim(),
      category,
      frequency,
      customDays: frequency === "custom" ? customDays : undefined,
    });
    setIsSubmitting(false);
    setTitle("");
    setCategory("health");
    setFrequency("daily");
    setCustomDays([]);
    onClose();
  };

  const toggleDay = (day: number) => {
    setCustomDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort(),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
        </DialogHeader>

        {!canCreate ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              You've reached the habit limit on the free plan.
            </p>
            <Button variant="glow">Upgrade to Pro</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Habit Title</Label>
              <Input
                id="title"
                placeholder="e.g., Morning meditation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as Category)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {CATEGORY_ICONS[cat.value]} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={frequency}
                onValueChange={(v) => setFrequency(v as Frequency)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
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

            {frequency === "custom" && (
              <div className="space-y-2">
                <Label>Select Days</Label>
                <div className="flex gap-2 flex-wrap">
                  {weekdays.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        customDays.includes(day.value)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="glow"
                disabled={isSubmitting || !title.trim()}
              >
                {isSubmitting ? "Creating..." : "Create Habit"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
