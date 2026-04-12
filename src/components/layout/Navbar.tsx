import { Link, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, Bell, Menu, X, User, Shield, LogOut, Download, ChevronDown, Globe, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { usePWA } from "@/hooks/usePWA";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Markets", path: "/markets" },
  { label: "Invest", path: "/#investment-plans", isScroll: true },
  { label: "Real Estate", path: "/real-estate" },
  { label: "Retirement", path: "/retirement" },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { isInstallable, installApp } = usePWA();

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
              item.isScroll ? (
                <button
                  key={item.path}
                  onClick={async () => {
                    if (location.pathname !== '/') {
                      await navigate('/');
                      setTimeout(() => {
                        document.getElementById('investment-plans')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    } else {
                      document.getElementById('investment-plans')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all text-muted-foreground hover:text-foreground hover:bg-white/5"
                >
                  {item.label}
                </button>
              ) : (
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
              )
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isInstallable && (
              <Button variant="outline" size="sm" onClick={installApp} className="bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary group">
                <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                Download App
              </Button>
            )}
            <button
              onClick={() => setLangOpen(true)}
              className="p-2 rounded-lg hover:bg-secondary/50 transition-colors group"
            >
              <Globe className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            {!user ? (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
                <Link to="/signup">
                  <Button size="sm" className="gradient-primary border-0 text-foreground shadow-glow">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <button className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 glass-strong border-white/10">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                          <Shield className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 cursor-pointer text-red-400">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          <button className="md:hidden p-2 active:scale-95 transition-transform" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      <LanguageSwitcher open={langOpen} onOpenChange={setLangOpen} />

      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-border">
          <div className="px-4 py-4 space-y-2">
            <button
              onClick={() => { setLangOpen(true); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-primary bg-primary/10 transition-colors"
            >
              <Globe className="w-5 h-5" /> Change Language
            </button>
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
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground">
                <Shield className="w-4 h-4" /> Admin Dashboard
              </Link>
            )}
            {isInstallable && (
              <button
                onClick={() => { installApp(); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-primary bg-primary/10 mb-2"
              >
                <Download className="w-5 h-5" /> Download App
              </button>
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
