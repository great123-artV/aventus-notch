import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, BarChart2, PlusCircle, Briefcase, User } from 'lucide-react';
import { InvestMenu } from './InvestMenu';

export const BottomNav = () => {
  const [isInvestMenuOpen, setIsInvestMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-white/10 px-6 py-3 pb-6">
        <div className="flex items-center justify-between">
          <NavLink
            to="/"
            className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
          </NavLink>

          <NavLink
            to="/markets"
            className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <BarChart2 className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Markets</span>
          </NavLink>

          <button
            onClick={(e) => {
              e.preventDefault();
              setIsInvestMenuOpen(true);
            }}
            className={`flex flex-col items-center gap-1 -mt-8 transition-transform active:scale-95 ${
              location.pathname === '/real-estate' || location.pathname === '/retirement' ? 'text-primary' : ''
            }`}
          >
            <div className="w-14 h-14 rounded-full gradient-primary shadow-glow neon-glow-primary flex items-center justify-center border-4 border-[#020617]">
              <PlusCircle className="w-8 h-8 text-[#050505]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-primary mt-1">Invest</span>
          </button>

          <NavLink
            to="/dashboard"
            className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Briefcase className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Portfolio</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
          </NavLink>
        </div>
      </div>
      <InvestMenu isOpen={isInvestMenuOpen} onClose={() => setIsInvestMenuOpen(false)} />
    </>
  );
};
