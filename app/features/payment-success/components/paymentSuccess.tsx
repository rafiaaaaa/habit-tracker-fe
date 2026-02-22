import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Zap,
  BarChart3,
  Download,
  Infinity as InfinityIcon,
  ArrowRight,
  Sparkles,
  Crown,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import confetti from "canvas-confetti";
import { useVerifySession } from "../api/verifySession";

const proFeatures = [
  {
    icon: InfinityIcon,
    title: "Unlimited Habits",
    description: "Track as many habits as you want — no limits.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Full insights, trends, and detailed statistics.",
  },
  {
    icon: Download,
    title: "Export Data",
    description: "Export your data to CSV or PDF anytime.",
  },
  {
    icon: Zap,
    title: "Advanced Charts",
    description: "Category breakdowns and performance charts.",
  },
];

// Loading skeleton shown while session is being verified
function SessionLoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-lg space-y-4"
      >
        {/* Top card skeleton */}
        <div className="rounded-2xl border border-border bg-card p-8 space-y-6">
          <div className="flex justify-center">
            <Skeleton className="w-24 h-24 rounded-full" />
          </div>
          <div className="space-y-3 flex flex-col items-center">
            <Skeleton className="h-4 w-40 rounded-full" />
            <Skeleton className="h-8 w-56 rounded-lg" />
            <Skeleton className="h-4 w-72 rounded" />
            <Skeleton className="h-4 w-52 rounded" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-8 w-44 rounded-full" />
          </div>
        </div>

        {/* Features card skeleton */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-3 w-32 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "hsl(var(--secondary))" }}
              >
                <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24 rounded" />
                  <Skeleton className="h-3 w-36 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="flex justify-center">
            <Skeleton className="h-3 w-48 rounded" />
          </div>
        </div>

        {/* Status pulse */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <Shield className="w-4 h-4" />
          Verifying your session…
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [sessionLoading, setSessionLoading] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const {
    mutateAsync: verifySessionMutation,
    isPending: verifySessionIsLoading,
  } = useVerifySession();
  useEffect(() => {
    const verify = async () => {
      if (!sessionId) {
        navigate("/");
        return;
      }

      try {
        await verifySessionMutation(sessionId);
        console.log("verified");
      } catch (err) {
        navigate("/");
      }
    };

    verify();
  }, [sessionId]);

  // Fire confetti only after session is verified
  useEffect(() => {
    if (sessionLoading) return;
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#2dd4bf", "#38bdf8", "#818cf8"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#2dd4bf", "#38bdf8", "#818cf8"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [sessionLoading]);

  return (
    <AnimatePresence mode="wait">
      {verifySessionIsLoading ? (
        <SessionLoadingScreen key="loading" />
      ) : (
        <div
          key="success"
          className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden"
        >
          {/* Background glow orbs */}
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: "hsl(var(--primary))" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{ background: "hsl(var(--glow-secondary))" }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-lg relative z-10"
          >
            {/* Success card */}
            <div className="gradient-border rounded-2xl overflow-hidden">
              <div className="bg-card p-8 text-center space-y-6">
                {/* Crown badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex justify-center"
                >
                  <div className="relative">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center glow-primary"
                      style={{
                        background:
                          "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--glow-secondary) / 0.2))",
                        border: "2px solid hsl(var(--primary) / 0.5)",
                      }}
                    >
                      <Crown
                        className="w-12 h-12"
                        style={{ color: "hsl(var(--primary))" }}
                      />
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: "hsl(var(--success))" }}
                    >
                      <CheckCircle
                        className="w-5 h-5"
                        style={{ color: "hsl(var(--success-foreground))" }}
                      />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles
                      className="w-5 h-5"
                      style={{ color: "hsl(var(--primary))" }}
                    />
                    <span
                      className="text-sm font-semibold uppercase tracking-widest"
                      style={{ color: "hsl(var(--primary))" }}
                    >
                      Upgrade Successful
                    </span>
                    <Sparkles
                      className="w-5 h-5"
                      style={{ color: "hsl(var(--primary))" }}
                    />
                  </div>
                  <h1 className="text-3xl font-bold gradient-text">
                    Welcome to Pro!
                  </h1>
                  <p className="text-muted-foreground">
                    Your account has been upgraded. All Pro features are now
                    unlocked and ready to use.
                  </p>
                </motion.div>

                {/* Plan badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--glow-secondary) / 0.15))",
                    border: "1px solid hsl(var(--primary) / 0.3)",
                    color: "hsl(var(--primary))",
                  }}
                >
                  <Crown className="w-4 h-4" />
                  Free Plan → Pro Plan
                </motion.div>
              </div>
            </div>

            {/* Features unlocked */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 bg-card rounded-2xl border border-border p-6 space-y-4"
            >
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                What's now unlocked
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {proFeatures.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: "hsl(var(--secondary))" }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "hsl(var(--primary) / 0.15)" }}
                    >
                      <feature.icon
                        className="w-4 h-4"
                        style={{ color: "hsl(var(--primary))" }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mt-4 space-y-3"
            >
              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full h-12 text-base font-semibold glow-primary-sm"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--gradient-end)))",
                  color: "hsl(var(--primary-foreground))",
                }}
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Redirecting automatically in{" "}
                <span
                  className="font-bold"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {countdown}s
                </span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
