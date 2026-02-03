import { Search, Menu, Globe } from 'lucide-react';

interface HeaderProps {
  marketType: 'US' | 'IN';
  onToggleMarket: () => void;
  onMenuClick?: () => void;
}

export function Header({ marketType, onToggleMarket, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 p-3 md:p-4">
      <div className="aero-window rounded-xl px-4 py-3">
        {/* Title bar stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-xl"></div>
        
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button 
              type="button"
              onClick={onMenuClick}
              className="md:hidden aero-button rounded-lg p-2.5 transition-all active:scale-95 cursor-pointer"
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </button>
            
            {/* Search Bar - Windows 7 Style */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 z-10" />
              <input
                type="search"
                placeholder="Search stocks..."
                className="aero-input h-10 w-56 lg:w-72 rounded-lg pl-10 pr-4 text-sm placeholder-slate-400 focus:w-64 lg:focus:w-80 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Market Toggle - Skeuomorphic Toggle */}
            <button 
              type="button"
              onClick={onToggleMarket}
              className="aero-button flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition-all active:scale-95 cursor-pointer"
            >
              {/* Globe Icon with 3D effect */}
              <div className="w-6 h-6 rounded-full bg-gradient-to-b from-sky-400 to-sky-600 flex items-center justify-center shadow-inner border border-sky-500/50">
                <Globe className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="hidden sm:inline font-semibold">{marketType === 'US' ? 'US Market' : 'Indian Market'}</span>
              <span className="sm:hidden font-semibold">{marketType}</span>
            </button>

            {/* Live Indicator - LED Style */}
            <div className="aero-card flex items-center gap-2 px-4 py-2.5 rounded-lg">
              {/* Skeuomorphic LED */}
              <div className="relative w-3 h-3">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-green-300 via-green-500 to-green-700"></div>
                <div className="absolute inset-0.5 rounded-full bg-gradient-to-b from-green-300 to-green-500"></div>
                <div className="absolute top-0.5 left-0.5 w-1 h-0.5 rounded-full bg-white/70"></div>
                <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-40"></div>
              </div>
              <span className="text-xs font-bold text-green-700 uppercase tracking-wide hidden md:inline">Live</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
