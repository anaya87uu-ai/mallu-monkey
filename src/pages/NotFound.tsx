import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="glass-panel p-10 md:p-14 text-center max-w-md w-full"
      >
        <p className="font-display text-[8rem] md:text-[10rem] font-bold leading-none gradient-text">404</p>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2 tracking-tight">Page not found</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="rounded-full gap-2 bg-background/60 border-border/60 hover:bg-mint/40"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
          <Link to="/">
            <Button className="rounded-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground glow-primary w-full">
              <Home className="w-4 h-4" /> Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
