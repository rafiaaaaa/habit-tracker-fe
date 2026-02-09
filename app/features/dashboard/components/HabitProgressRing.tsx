import { motion } from "framer-motion";

interface HabitProgressRingProps {
  completed: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}

export function HabitProgressRing({
  completed,
  total,
  size = 120,
  strokeWidth = 8,
}: HabitProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 overflow-visible"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="drop-shadow-[0_0_6px_hsl(var(--primary))]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{completed}</span>
        <span className="text-xs text-muted-foreground">of {total}</span>
      </div>
    </div>
  );
}
