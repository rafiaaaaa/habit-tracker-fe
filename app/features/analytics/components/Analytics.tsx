import { useNavigate } from "react-router";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { useHabits } from "@/hooks/useHabits";
import { useAuth } from "@/hooks/useAuth";
// import { SidebarProvider } from "@/components/ui/sidebar";
import { WeeklyChart } from "./WeeklyChart";
import { CategoryChart } from "./CategoryChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Flame,
  Calendar,
  Award,
  BarChart3,
  PieChart,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function Analytics() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { habits, getHabitStats } = useHabits();
  const stats = getHabitStats();

  const handleLogout = () => {
    navigate("/");
  };

  // Generate monthly data for the area chart
  const generateMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, index) => ({
      month,
      completed: Math.floor(Math.random() * 50) + 50 + index * 5,
      target: 100,
    }));
  };

  // Generate streak history data
  const generateStreakData = () => {
    const days = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        streak: Math.floor(Math.random() * 10) + (30 - i) / 3,
      });
    }
    return days;
  };

  const monthlyData = generateMonthlyData();
  const streakData = generateStreakData();

  // Calculate additional metrics
  const bestHabit = habits.reduce(
    (best, current) => (current.streak > (best?.streak || 0) ? current : best),
    habits[0],
  );

  const totalCompletions = habits.reduce(
    (sum, h) => sum + h.history.filter((entry) => entry.completed).length,
    0,
  );

  const avgStreakLength =
    habits.length > 0
      ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length)
      : 0;

  const completionTrend =
    stats.averageCompletion > 70
      ? "up"
      : stats.averageCompletion > 50
        ? "stable"
        : "down";

  if (!user) {
    return null;
  }
  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Track your progress and identify patterns
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Completion Rate
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {stats.averageCompletion}%
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {completionTrend === "up" ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-primary" />
                            <span className="text-xs text-primary">
                              +5% this week
                            </span>
                          </>
                        ) : completionTrend === "down" ? (
                          <>
                            <TrendingDown className="h-4 w-4 text-destructive" />
                            <span className="text-xs text-destructive">
                              -3% this week
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Stable
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Completions
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {totalCompletions}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        All time
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <Award className="h-6 w-6 text-accent-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Average Streak
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {avgStreakLength}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        days per habit
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-secondary/50 flex items-center justify-center">
                      <Flame className="h-6 w-6 text-secondary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Active Days
                      </p>
                      <p className="text-3xl font-bold text-foreground">24</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        this month
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <CardTitle>Weekly Progress</CardTitle>
                  </div>
                  <CardDescription>
                    Habits completed each day this week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WeeklyChart stats={stats} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glass border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    <CardTitle>Category Distribution</CardTitle>
                  </div>
                  <CardDescription>
                    Breakdown of habits by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CategoryChart stats={stats} isPro={user.plan === "pro"} />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Monthly Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle>Monthly Completion Trend</CardTitle>
                <CardDescription>
                  Your habit completion rate over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient
                          id="colorCompleted"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="month"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="completed"
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#colorCompleted)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Streak History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle>Streak History</CardTitle>
                <CardDescription>
                  Your streak progression over the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={streakData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="streak"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Best Performing Habits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle>Top Performing Habits</CardTitle>
                <CardDescription>
                  Your most consistent habits by streak length
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {habits
                    .sort((a, b) => b.streak - a.streak)
                    .slice(0, 5)
                    .map((habit, index) => (
                      <div key={habit.id} className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {habit.title}
                          </p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {habit.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Flame className="h-4 w-4 text-primary" />
                          <span className="font-bold text-foreground">
                            {habit.streak}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            day streak
                          </span>
                        </div>
                        <Badge
                          variant={habit.streak >= 10 ? "default" : "secondary"}
                        >
                          {habit.streak >= 20
                            ? "🏆 Champion"
                            : habit.streak >= 10
                              ? "🔥 On Fire"
                              : "💪 Growing"}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
