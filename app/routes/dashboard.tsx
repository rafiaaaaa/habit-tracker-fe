import Dashboard from "@/features/dashboard/components/Dashboard";
import { HabitProvider } from "@/features/dashboard/context/useHabits";

export default function DashboardPage() {
  return (
    <HabitProvider>
      <Dashboard />
    </HabitProvider>
  );
}
