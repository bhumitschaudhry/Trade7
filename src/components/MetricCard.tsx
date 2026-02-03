import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  colorClass: string;
}

export function MetricCard({ title, value, change, isPositive, icon: Icon, colorClass }: MetricCardProps) {
  // Extract color for the icon gradient
  const colorMap: Record<string, { from: string; to: string; border: string }> = {
    'bg-emerald-500': { from: 'from-emerald-400', to: 'to-emerald-600', border: 'border-emerald-500/50' },
    'bg-blue-500': { from: 'from-blue-400', to: 'to-blue-600', border: 'border-blue-500/50' },
    'bg-purple-500': { from: 'from-purple-400', to: 'to-purple-600', border: 'border-purple-500/50' },
    'bg-orange-500': { from: 'from-orange-400', to: 'to-orange-600', border: 'border-orange-500/50' },
  };
  
  const colors = colorMap[colorClass.split(' ')[0]] || colorMap['bg-blue-500'];

  return (
    <div className="group relative aero-card rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      {/* Glossy shine overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-800 text-shadow-light">{value}</p>
        </div>
        
        {/* Skeuomorphic Icon */}
        <div className="relative">
          <div className={`w-11 h-11 rounded-lg bg-gradient-to-b ${colors.from} ${colors.to} flex items-center justify-center shadow-lg border ${colors.border}`}>
            {/* Glossy highlight */}
            <div className="absolute inset-0.5 rounded-md bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
            <Icon className="h-5 w-5 text-white relative z-10 drop-shadow-md" />
          </div>
        </div>
      </div>
      
      {change && (
        <div className="relative mt-4 flex items-center">
          {/* Skeuomorphic badge */}
          <span className={`
            inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold
            ${isPositive 
              ? 'bg-gradient-to-b from-green-100 to-green-200 text-green-800 border border-green-300 shadow-inner' 
              : 'bg-gradient-to-b from-red-100 to-red-200 text-red-800 border border-red-300 shadow-inner'
            }
          `}>
            <span className={`w-0 h-0 border-l-[4px] border-r-[4px] border-transparent ${isPositive ? 'border-b-[5px] border-b-green-600' : 'border-t-[5px] border-t-red-600'}`}></span>
            {change}
          </span>
          <span className="ml-2 text-xs text-slate-500 font-medium">from yesterday</span>
        </div>
      )}
    </div>
  );
}
