import { useState } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLogin } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AdminLoginProps {
  onLoggedIn: () => void;
}

export function AdminLogin({ onLoggedIn }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsSubmitting(true);
    try {
      await adminLogin(password);
      await queryClient.invalidateQueries({ queryKey: ["admin", "me"] });
      toast({ title: "Welcome back" });
      onLoggedIn();
      navigate("/admin");
    } catch (err) {
      toast({
        title: "Login failed",
        description: err instanceof Error ? err.message : "Invalid password",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
            Victor Crosetto
          </p>
          <h1 className="font-display text-4xl uppercase font-extrabold tracking-tight">
            Admin Access
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/10 text-white text-base h-12"
              placeholder="Enter admin password"
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !password}
            className="w-full h-12 bg-white text-black hover:bg-white/90 font-mono text-xs uppercase tracking-widest font-bold"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Sign In"}
          </Button>
        </form>
        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
