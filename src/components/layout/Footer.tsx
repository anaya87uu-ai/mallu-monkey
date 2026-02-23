import { Link } from "react-router-dom";
import { Cat, Github, Twitter, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/30 glass mt-auto">
    <div className="container px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Cat className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold gradient-text">Mallu Monkey</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Connect with strangers worldwide through video chat. Safe, anonymous, and fun.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-foreground mb-4">Follow Us</h4>
          <div className="flex gap-3">
            {[Github, Twitter, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border/30 mt-8 pt-6 text-center">
        <p className="text-xs text-muted-foreground">© 2026 Mallu Monkey. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
