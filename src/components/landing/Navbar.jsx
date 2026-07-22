import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Menu, X, Truck, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#why" },
  { label: "Drivers", href: "#benefits" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-300",
      scrolled ? "glass border-b border-border/60 shadow-premium" : "bg-transparent"
    )}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-18 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-float group-hover:scale-105 transition-transform">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <span className="font-heading font-extrabold text-lg text-foreground tracking-tight">Songa</span>
            <span className="block text-[10px] font-medium text-muted-foreground -mt-0.5 tracking-wider uppercase">Fleet Management</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map(l => (
            <a key={l.href} href={l.href} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/60">
              {l.label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          {currentUser ? (
            <Link to="/dashboard" className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:shadow-float">
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-foreground hover:text-primary transition-colors px-4 py-2.5">
                Login
              </Link>
              <Link to="/register" className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:shadow-float hover:-translate-y-0.5">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-foreground p-2" onClick={() => setOpen(o => !o)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden glass border-b border-border/60">
          <div className="px-4 py-4 space-y-1">
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg">
                {l.label}
              </a>
            ))}
            <div className="pt-3 flex gap-2 border-t border-border mt-3">
              {currentUser ? (
                <Link to="/dashboard" onClick={() => setOpen(false)} className="flex-1 text-center bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center border border-border text-sm font-semibold px-5 py-2.5 rounded-full">Login</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="flex-1 text-center bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}