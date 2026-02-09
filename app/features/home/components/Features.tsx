import {
  CheckCircle,
  Flame,
  BarChart3,
  Calendar,
  Bell,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    title: "Easy Habit Tracking",
    description:
      "Mark habits complete with a single tap. Track daily, weekly, or custom schedules.",
  },
  {
    icon: Flame,
    title: "Streak Tracking",
    description:
      "Build momentum with visual streak counters. Never break the chain!",
  },
  {
    icon: BarChart3,
    title: "Powerful Analytics",
    description:
      "Visualize your progress with beautiful charts and detailed statistics.",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Set daily, weekly, or custom frequencies for each habit.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description:
      "Get gentle nudges to stay on track with customizable notifications.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is encrypted and never shared. Privacy-first approach.",
  },
];

export function Features() {
  return (
    <section className="py-24 relative" id="features">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />

      <div className="container relative z-10 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything you need to{" "}
            <span className="gradient-text">build better habits</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you succeed in your
            habit-building journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass p-8 rounded-2xl hover:glow-primary-sm transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
