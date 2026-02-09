import { useState } from "react";
import { useNavigate } from "react-router";
import { DashboardSidebar } from "./DashboardSidebar";
import { StatsCards } from "./StatsCards";
import { WeeklyChart } from "./WeeklyChart";
import { CategoryChart } from "./CategoryChart";
import { CreateHabitModal } from "./CreateHabitModal";
import { HabitsSection } from "./HabitsSection";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useHabits } from "../hooks/useHabits";
import { useAuth } from "@/hooks/useAuth";
import type { Category, Frequency } from "@/types/habit";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const {
    habits,
    toggleHabitCompletion,
    addHabit,
    updateHabit,
    deleteHabit,
    getHabitStats,
    canAddHabit,
  } = useHabits();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const stats = getHabitStats();
  const isPro = user?.plan === "pro";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleToggle = async (id: string, date: string) => {
    const result = await toggleHabitCompletion(id, date);
    if (result.success) {
      toast.success("Habit updated!");
    }
  };

  const handleCreateHabit = async (
    habitData: Parameters<typeof addHabit>[0],
  ) => {
    const result = await addHabit(habitData);
    if (result.success) {
      toast.success("Habit created!");
    } else {
      toast.error(result.error || "Failed to create habit");
    }
  };

  const handleDeleteHabit = async (id: string) => {
    const result = await deleteHabit(id);
    if (result.success) {
      toast.success("Habit deleted");
    }
  };

  const handleEditHabit = async (
    id: string,
    data: {
      title: string;
      category: Category;
      frequency: Frequency;
      customDays?: number[];
    },
  ) => {
    const result = await updateHabit(id, data);
    if (result.success) {
      toast.success("Habit updated!");
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DashboardSidebar user={user} onLogout={handleLogout} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <span className="font-bold text-lg">Dashboard</span>
          <div className="w-10" />
        </div>

        <div className="p-6 lg:p-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">
              Good {getTimeOfDay()}, {user.name.split(" ")[0]}! 👋
            </h1>
            <p className="text-muted-foreground">
              {stats.completedToday === stats.totalHabits &&
              stats.totalHabits > 0
                ? "You've completed all habits today! 🎉"
                : `You have ${stats.pendingToday} habits left today`}
            </p>
          </div>

          {/* Stats */}
          <StatsCards stats={stats} />

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeeklyChart stats={stats} />
            <CategoryChart stats={stats} isPro={isPro} />
          </div>

          {/* Habits section with filters */}
          <HabitsSection
            habits={habits}
            onToggle={handleToggle}
            onEdit={handleEditHabit}
            onDelete={handleDeleteHabit}
            onCreateClick={() => setShowCreateModal(true)}
          />
        </div>
      </main>

      {/* Create habit modal */}
      <CreateHabitModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateHabit}
        canCreate={canAddHabit(user.plan)}
      />
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
