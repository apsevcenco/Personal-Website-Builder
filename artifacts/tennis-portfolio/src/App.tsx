import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, useScroll } from "framer-motion";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { scrollYProgress } = useScroll();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="film-grain" />
        <motion.div
          className="fixed top-0 right-0 bottom-0 w-[1px] bg-primary origin-top z-[100]"
          style={{ scaleY: scrollYProgress }}
        />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
