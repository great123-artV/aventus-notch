import { Link, useLocation } from "react-router-dom";
import { BarChart3, Bell, Menu, X, User, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Markets", path: "/markets" },
  { label: "Real Estate", path: "/real-estate" },
  { label: "Retirement", path: "/retirement" },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = location.pathname === "/";
  const { user, isAdmin, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow neon-glow-primary group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight">Aventus-Notch</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all ${
                  location.pathname === item.path
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all ${
                  location.pathname === "/admin"
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Admin</span>
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="gradient-primary border-0 text-foreground shadow-glow">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <button className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                </button>
                <Link to="/profile" className="p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <User className="w-5 h-5 text-muted-foreground" />
                </Link>
                <button onClick={signOut} className="p-2 rounded-lg hover:bg-secondary/50 transition-colors" title="Sign out">
                  <LogOut className="w-5 h-5 text-muted-foreground" />
                </button>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-border">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                  location.pathname === item.path ? "bg-primary/10 text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground">
                🛡️ Admin Dashboard
              </Link>
            )}
            <div className="pt-2 flex gap-2">
              {!user ? (
                <>
                  <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">Log In</Button>
                  </Link>
                  <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full gradient-primary border-0">Get Started</Button>
                  </Link>
                </>
              ) : (
                <Button variant="outline" className="w-full" onClick={() => { signOut(); setMobileOpen(false); }}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
