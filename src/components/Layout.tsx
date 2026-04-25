import { Outlet, NavLink } from 'react-router-dom';
import { useGameStore } from '../store';
import { FlaskConical, Component, LayoutDashboard } from 'lucide-react';
import { cn } from '../utils';

export default function Layout() {
  const { xp, level } = useGameStore();

  return (
    <div className="min-h-screen flex flex-col font-sans border-4 border-[#1a1c2c] bg-[var(--color-dark-bg)] text-white overflow-hidden">
      <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-[#080914] backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <span className="text-2xl font-bold italic tracking-tighter mix-blend-overlay">CW</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-widest uppercase leading-none">ChemiWorld</h1>
            <span className="text-[10px] text-[var(--color-neon-cyan)] tracking-[0.3em] font-medium uppercase">Infinite Lab Odyssey</span>
          </div>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <NavItem to="/" icon={<LayoutDashboard size={18}/>} label="Roadmap" />
          <NavItem to="/periodic-table" icon={<Component size={18}/>} label="Periodic Table" />
          <NavItem to="/sandbox" icon={<FlaskConical size={18}/>} label="Sandbox" />
          <NavItem to="/practice" icon={<FlaskConical size={18}/>} label="Path" />
        </nav>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Level {level}</span>
              <span className="text-sm font-bold text-[var(--color-neon-cyan)]">Atomic Master</span>
            </div>
            <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${Math.min((xp / 1000) * 100, 100)}%` }}></div>
            </div>
          </div>
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <div className="text-center">
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">XP</div>
              <div className="text-lg font-mono text-[var(--color-neon-purple)]">{xp}</div>
            </div>
            <div className="w-10 h-10 rounded-full border border-cyan-500/30 p-0.5 shadow-inner hidden md:block">
              <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden p-6 gap-6 relative max-w-screen-2xl mx-auto w-full">
        <Outlet />
      </main>
      
      {/* Mobile nav */}
      <nav className="glass-panel md:hidden fixed bottom-0 w-full flex justify-around p-4 z-50 border-t border-b-0 border-l-0 border-r-0">
         <NavItem to="/" icon={<LayoutDashboard size={20}/>} label="Roadmap" mobile />
         <NavItem to="/periodic-table" icon={<Component size={20}/>} label="Table" mobile />
         <NavItem to="/sandbox" icon={<FlaskConical size={20}/>} label="Sandbox" mobile />
         <NavItem to="/practice" icon={<FlaskConical size={20}/>} label="Path" mobile />
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label, mobile = false }: { to: string, icon: React.ReactNode, label: string, mobile?: boolean }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center space-x-2 text-sm font-medium transition-all duration-300",
        mobile ? "flex-col space-x-0 space-y-1" : "hover:text-[var(--color-neon-cyan)]",
        isActive 
          ? "text-[var(--color-neon-cyan)] drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]" 
          : "text-gray-400"
      )}
    >
      {icon}
      <span className={cn(mobile && "text-[10px] uppercase")}>{label}</span>
    </NavLink>
  );
}
