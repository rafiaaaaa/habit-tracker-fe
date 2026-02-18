import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { loginUserSchema, useLoginUser } from "../api/loginUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { useLoginGoogle } from "../api/loginGoogle";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginUserSchema),
  });

  const onSubmit = handleSubmit((data) => {
    if (honeypot) return;
    loginUserMutation(data);
  });

  const { mutate: loginUserMutation, isPending: loginUserIsPending } =
    useLoginUser({
      mutationConfig: {
        onSuccess: () => {
          toast.success("Welcome back!");
          navigate("/dashboard");
        },
        onError: (err) => {
          toast.error("Login failed" + err.message);
        },
      },
    });

  const { mutate: loginGoogleMutation, isPending: loginGoogleIsPending } =
    useLoginGoogle();

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
          <h1 className="text-2xl font-bold text-center mb-2">Welcome back</h1>
          <p className="text-muted-foreground text-center mb-8">
            Sign in to continue your habit journey
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="pr-10"
                  {...register("password")}
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
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="glow"
              size="lg"
              className="w-full"
              disabled={loginUserIsPending}
            >
              {loginUserIsPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <div className="flex justify-center">
              <GoogleLogin
                type="icon"
                shape="circle"
                theme="filled_blue"
                width="500"
                onSuccess={async (credentialResponse) => {
                  const idToken = credentialResponse.credential;
                  await loginGoogleMutation(idToken!);

                  navigate("/dashboard");
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
                useOneTap
              />
            </div>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Don't have an account?{" "}
            <NavLink to="/register" className="text-primary hover:underline">
              Sign up
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
