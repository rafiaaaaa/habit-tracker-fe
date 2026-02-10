import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { registerUserSchema, useRegisterUser } from "../api/registerUser";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const navigate = useNavigate();

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerUserSchema),
  });

  const onSubmit = handleSubmit((data) => {
    if (honeypot) {
      return;
    }
    registerUserMutation(data);
  });

  const { mutate: registerUserMutation, isPending: isRegisterUserPending } =
    useRegisterUser({
      mutationConfig: {
        onSuccess: () => {
          toast.success("Account created successfully!");
          navigate("/dashboard");
        },
        onError: (err) => {
          toast.error("Registration failed" + err.message);
        },
      },
    });

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-secondary/20" />
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

          <form onSubmit={onSubmit} className="space-y-4">
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
                autoComplete="name"
                maxLength={100}
                {...registerForm("name", { required: true })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                maxLength={255}
                {...registerForm("email", { required: true })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.email?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <InputPassword
                  {...registerForm("password", { required: true })}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm">
                  {errors.password?.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Confirm Password</Label>
              <InputPassword
                {...registerForm("confirmPassword", { required: true })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword?.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="glow"
              size="lg"
              className="w-full"
              disabled={isRegisterUserPending}
            >
              {isRegisterUserPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                "Create Account"
              )}
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

const InputPassword = (props: any) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="new-password"
          className="pr-10"
          {...props}
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
    </>
  );
};
