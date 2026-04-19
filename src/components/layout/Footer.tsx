import { Link } from "react-router-dom";
import { Cat, Github, Twitter, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="mt-auto border-t border-primary/10 bg-background/40 backdrop-blur-xl">
    <div className="container px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
              <Cat className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold gradient-text tracking-tight">Mallu Monkey</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Connect with strangers worldwide through video chat. Safe, anonymous, and fun.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Explore</h4>
          <div className="flex flex-col gap-2.5">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Follow</h4>
          <div className="flex gap-2">
            {[Github, Twitter, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-muted-foreground hover:text-primary hover:-translate-y-0.5 transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="divider-soft mt-10 mb-6" />
      <p className="text-xs text-muted-foreground text-center">© 2026 Mallu Monkey. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
