import { Zap } from "lucide-react";
import { NavLink } from "react-router";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Habit Tracker</span>
          </NavLink>

          <nav className="flex items-center gap-6">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <NavLink
              to="/login"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </NavLink>
          </nav>

          <p className="text-sm text-muted-foreground">
            © 2026 Habit Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
