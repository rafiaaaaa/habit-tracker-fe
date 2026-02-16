import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createHabitValidationSchema } from "../api/createHabits";
import { useHabits } from "../hooks/useHabits";

interface CreateHabitModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (habit: {
    title: string;
    category: Category;
    frequency: Frequency;
    customDays?: number[];
  }) => Promise<void>;
  // canCreate: boolean;
}

const categories: { value: Category; label: string }[] = [
  { value: "HEALTH", label: "Health" },
  { value: "FITNESS", label: "Fitness" },
  { value: "PRODUCTIVITY", label: "Productivity" },
  { value: "LEARNING", label: "Learning" },
  { value: "MINDFULNESS", label: "Mindfulness" },
  { value: "SOCIAL", label: "Social" },
  { value: "FINANCE", label: "Finance" },
  { value: "OTHER", label: "Other" },
];

const frequencies: { value: Frequency; label: string }[] = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "CUSTOM", label: "Custom" },
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
  // onSubmit,
  // canCreate,
}: CreateHabitModalProps) {
  const [frequency, setFrequency] = useState<Frequency>("DAILY");
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createHabit, isCreateHabitLoading } = useHabits();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(createHabitValidationSchema),
    defaultValues: {
      title: "",
      category: "HEALTH",
      frequency: "DAILY",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    await createHabit(data);
    onClose();
  });

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!title.trim()) return;

  //   setIsSubmitting(true);
  //   await onSubmit({
  //     title: title.trim(),
  //     category,
  //     frequency,
  //     customDays: frequency === "custom" ? customDays : undefined,
  //   });
  //   setIsSubmitting(false);
  //   setTitle("");
  //   setCategory("health");
  //   setFrequency("daily");
  //   setCustomDays([]);
  //   onClose();
  // };

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
          <DialogDescription>
            Create a new habit to track your progress.
          </DialogDescription>
        </DialogHeader>

        {false ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              You've reached the habit limit on the free plan.
            </p>
            <Button variant="glow">Upgrade to Pro</Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Habit Title</Label>
              <Input
                id="title"
                placeholder="e.g., Morning meditation"
                required
                maxLength={100}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
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
                )}
              />
              {errors.category && (
                <p className="text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Controller
                name="frequency"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
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
                )}
              />
              {errors.frequency && (
                <p className="text-red-500">{errors.frequency.message}</p>
              )}
            </div>

            {/* {frequency === "custom" && (
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
            )} */}

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="glow"
                disabled={isCreateHabitLoading}
              >
                {isCreateHabitLoading ? "Creating..." : "Create Habit"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
