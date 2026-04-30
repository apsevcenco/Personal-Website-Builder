import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowUpRight } from "lucide-react";
import { adminLogout } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AdminShellProps {
  children: React.ReactNode;
  onLoggedOut?: () => void;
}

export function AdminShell({ children, onLoggedOut }: AdminShellProps) {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await adminLogout();
      queryClient.setQueryData(["admin", "me"], { authenticated: false });
      queryClient.removeQueries({ queryKey: ["inquiries"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "me"] });
      onLoggedOut?.();
      navigate("/admin");
      toast({ title: "Signed out" });
    } catch (err) {
      toast({
        title: "Logout failed",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      });
    }
  };

  const tabs = [
    { href: "/admin", label: "Content" },
    { href: "/admin/inquiries", label: "Inquiries" },
  ];

  return (
    <div className="min-h-screen bg-background text-white">
      <header className="border-b border-white/10 bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="container px-6 md:px-8 mx-auto flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <span className="font-display text-lg uppercase tracking-tight font-extrabold">
              Admin
            </span>
            <nav className="flex items-center gap-6">
              {tabs.map((tab) => {
                const active = location === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`font-mono text-xs uppercase tracking-widest transition-colors ${
                      active ? "text-primary" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="font-mono text-xs uppercase tracking-widest text-white/70 hover:text-white"
            >
              <a href="/" target="_blank" rel="noreferrer">
                View site <ArrowUpRight size={14} className="ml-1" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="font-mono text-xs uppercase tracking-widest text-white/70 hover:text-white"
            >
              <LogOut size={14} className="mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="container px-6 md:px-8 mx-auto py-10">{children}</main>
    </div>
  );
}
