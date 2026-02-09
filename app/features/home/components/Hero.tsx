import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Target, TrendingUp } from "lucide-react";
import { NavLink } from "react-router";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-secondary/20" />
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[hsl(262,83%,58%)]/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "3s" }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size[64px_64px]" />

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              Build better habits, one day at a time
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Track Your Habits.
            <br />
            <span className="gradient-text glow-text">
              Transform Your Life.
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            The smart habit tracker that helps you build lasting routines with
            powerful analytics and streak tracking.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <NavLink to="/register">
              <Button variant="glow" size="xl" className="group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </NavLink>
            <NavLink to="/login">
              <Button variant="glass" size="xl">
                Sign In
              </Button>
            </NavLink>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Target className="w-6 h-6 text-primary" />
                <span className="text-3xl font-bold">10K+</span>
              </div>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-primary" />
                <span className="text-3xl font-bold">1M+</span>
              </div>
              <p className="text-muted-foreground">Habits Completed</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center justify-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                <span className="text-3xl font-bold">89%</span>
              </div>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
