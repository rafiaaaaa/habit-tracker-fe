import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // Bot protection
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = {
    length: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
  };

  const isPasswordStrong =
    passwordStrength.length && passwordStrength.hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (honeypot) {
      return; // Bot detected
    }

    // Validation
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isPasswordStrong) {
      toast.error("Password must be at least 8 characters with a number");
      return;
    }

    const result = await register(email, password, name);

    if (result.success) {
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } else {
      toast.error(result.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[hsl(262,83%,58%)]/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="glass rounded-2xl p-8 animate-scale-in">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center justify-center gap-2 mb-8"
          >
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl">Habit Tracker</span>
          </NavLink>

          <h1 className="text-2xl font-bold text-center mb-2">
            Create your account
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Start building better habits today
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot field - hidden from users */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password strength indicators */}
              {password && (
                <div className="space-y-1 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check
                      className={`w-4 h-4 ${passwordStrength.length ? "text-success" : "text-muted-foreground"}`}
                    />
                    <span
                      className={
                        passwordStrength.length
                          ? "text-success"
                          : "text-muted-foreground"
                      }
                    >
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check
                      className={`w-4 h-4 ${passwordStrength.hasNumber ? "text-success" : "text-muted-foreground"}`}
                    />
                    <span
                      className={
                        passwordStrength.hasNumber
                          ? "text-success"
                          : "text-muted-foreground"
                      }
                    >
                      Contains a number
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="glow"
              size="lg"
              className="w-full"
              disabled={isLoading || !isPasswordStrong}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <NavLink to="/login" className="text-primary hover:underline">
              Sign in
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
