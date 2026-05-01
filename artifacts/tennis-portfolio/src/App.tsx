import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, useScroll } from "framer-motion";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { ContentProvider } from "@/hooks/useContent";
import { LanguageProvider } from "@/hooks/useLanguage";
import { AdminLogin } from "@/pages/admin/AdminLogin";
import { AdminEditor } from "@/pages/admin/AdminEditor";
import { AdminInquiries } from "@/pages/admin/AdminInquiries";
import { adminMe } from "@/lib/api";

const queryClient = new QueryClient();

function AdminGate({ children }: { children: React.ReactNode }) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", "me"],
    queryFn: adminMe,
    retry: false,
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-white/40" size={24} />
      </div>
    );
  }
  if (!data?.authenticated) {
    return <AdminLogin onLoggedIn={() => refetch()} />;
  }
  return <>{children}</>;
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin">
        <AdminGate>
          <AdminEditor />
        </AdminGate>
      </Route>
      <Route path="/admin/inquiries">
        <AdminGate>
          <AdminInquiries />
        </AdminGate>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { scrollYProgress } = useScroll();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <ContentProvider>
            <div className="film-grain" />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-[1px] bg-primary origin-top z-[100]"
              style={{ scaleY: scrollYProgress }}
            />
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AppRouter />
            </WouterRouter>
            <Toaster />
          </ContentProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
