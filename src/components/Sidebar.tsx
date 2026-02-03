import { LayoutDashboard, BarChart2, Wallet, TrendingUp, LucideIcon, History, X } from 'lucide-react';

export type View = 'dashboard' | 'market' | 'portfolio' | 'transactions';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ currentView, onNavigate, isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64
        flex flex-col 
        aero-window rounded-r-xl
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:relative md:flex
        md:m-3 md:rounded-xl md:h-[calc(100vh-24px)]
      `}>
        {/* Title Bar */}
        <div className="aero-titlebar flex h-14 items-center justify-between px-4 rounded-t-xl">
          <div className="flex items-center gap-3">
            {/* App Icon - Skeuomorphic */}
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-b from-green-400 via-green-500 to-green-600 flex items-center justify-center shadow-md border border-green-600/50">
                <div className="absolute inset-0.5 rounded-md bg-gradient-to-b from-white/30 to-transparent"></div>
                <TrendingUp className="h-5 w-5 text-white relative z-10 drop-shadow-md" />
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold text-white text-shadow">Trade7</span>
            </div>
          </div>
          
          {/* Close button - Windows style */}
          <button 
            type="button"
            onClick={onClose} 
            className="md:hidden w-7 h-7 rounded flex items-center justify-center bg-gradient-to-b from-red-400 to-red-600 border border-red-700 hover:from-red-500 hover:to-red-700 transition-all cursor-pointer"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto scrollbar-hide">
          <p className="text-[10px] uppercase tracking-wider text-slate-700/60 font-semibold mb-2 px-3">Navigation</p>
          <NavItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={currentView === 'dashboard'} 
            onClick={() => {
              onNavigate('dashboard');
              onClose?.();
            }}
          />
          <NavItem 
            icon={BarChart2} 
            label="Market" 
            active={currentView === 'market'} 
            onClick={() => {
              onNavigate('market');
              onClose?.();
            }}
          />
          <NavItem 
            icon={Wallet} 
            label="Portfolio" 
            active={currentView === 'portfolio'} 
            onClick={() => {
              onNavigate('portfolio');
              onClose?.();
            }}
          />
          <NavItem 
            icon={History} 
            label="Transactions" 
            active={currentView === 'transactions'} 
            onClick={() => {
              onNavigate('transactions');
              onClose?.();
            }}
          />
        </nav>

        {/* Status Card */}
        <div className="p-3">
          <div className="aero-card rounded-lg p-4">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wide mb-2">Market Status</p>
            <div className="flex items-center gap-2">
              {/* Skeuomorphic LED indicator */}
              <div className="relative w-4 h-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-green-300 via-green-500 to-green-700 shadow-inner"></div>
                <div className="absolute inset-0.5 rounded-full bg-gradient-to-b from-green-300 to-green-500"></div>
                <div className="absolute top-0.5 left-1 w-1.5 h-1 rounded-full bg-white/60"></div>
                <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-50"></div>
              </div>
              <span className="text-sm font-semibold text-green-700">Market Open</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function NavItem({ icon: Icon, label, active = false, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium 
        transition-all duration-150 cursor-pointer
        ${active
          ? "aero-button bg-gradient-to-b from-sky-300/50 to-sky-500/30 border-sky-400/60 text-slate-800"
          : "hover:bg-white/20 text-slate-700 hover:text-slate-900"
        }
      `}
    >
      {/* Icon with skeuomorphic treatment */}
      <div className={`
        w-8 h-8 rounded-md flex items-center justify-center transition-all
        ${active 
          ? 'bg-gradient-to-b from-sky-400 to-sky-600 shadow-md border border-sky-500/50' 
          : 'bg-white/30 border border-white/40 group-hover:bg-white/50'
        }
      `}>
        <div className={`absolute inset-0.5 rounded bg-gradient-to-b from-white/30 to-transparent pointer-events-none ${active ? 'block' : 'hidden'}`}></div>
        <Icon className={`h-4 w-4 relative z-10 ${active ? 'text-white drop-shadow' : 'text-slate-600 group-hover:text-slate-800'}`} />
      </div>
      <span className={active ? 'text-shadow-light font-semibold' : ''}>{label}</span>
      
      {/* Active indicator */}
      {active && (
        <div className="absolute right-2 w-2 h-2 rounded-full bg-gradient-to-b from-green-400 to-green-600 shadow-sm"></div>
      )}
    </button>
  );
}
