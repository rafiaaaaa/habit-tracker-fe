import {
  LayoutDashboard,
  Target,
  BarChart3,
  Settings,
  LogOut,
  Crown,
  Zap,
} from "lucide-react";
import { NavLink } from "react-router";
import type { User } from "@/types/habit";
import { PLAN_LIMITS } from "@/types/habit";
import { Button } from "@/components/ui/button";

interface DashboardSidebarProps {
  user: User;
  onLogout: () => void;
}

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/dashboard/habits", icon: Target, label: "My Habits" },
  {
    to: "/dashboard/analytics",
    icon: BarChart3,
    label: "Analytics",
    proOnly: true,
  },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function DashboardSidebar({ user, onLogout }: DashboardSidebarProps) {
  const limits = PLAN_LIMITS[user.plan];
  const isPro = user.plan === "pro";

  return (
    <aside className="w-64 h-screen glass border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary-sm">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">Habit Tracker</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              } ${item.proOnly && !isPro ? "opacity-50" : ""}`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
            {item.proOnly && !isPro && (
              <Crown className="w-4 h-4 text-warning ml-auto" />
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info & upgrade */}
      <div className="p-4 border-t border-border space-y-4">
        {!isPro && (
          <div className="glass rounded-xl p-4 text-center">
            <Crown className="w-8 h-8 text-warning mx-auto mb-2" />
            <p className="text-sm font-medium mb-1">Upgrade to Pro</p>
            <p className="text-xs text-muted-foreground mb-3">
              Get unlimited habits & analytics
            </p>
            <Button variant="glow" size="sm" className="w-full">
              Upgrade Now
            </Button>
          </div>
        )}

        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-lg font-semibold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {isPro && <Crown className="w-3 h-3 text-warning" />}
              {user.plan === "pro" ? "Pro Plan" : "Free Plan"}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
