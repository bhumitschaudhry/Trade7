import { Stock } from '../data/mockData';
import { ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';

interface StockListProps {
  stocks: Stock[];
  onSelectStock: (stock: Stock) => void;
  selectedStockSymbol: string;
  currency?: string;
}

export function StockList({ stocks, onSelectStock, selectedStockSymbol, currency = "$" }: StockListProps) {
  return (
    <div className="relative aero-window rounded-xl h-full flex flex-col overflow-hidden">
      {/* Window Title Bar */}
      <div className="aero-titlebar flex items-center gap-3 px-4 py-3 rounded-t-xl">
        {/* Icon */}
        <div className="w-8 h-8 rounded-md bg-gradient-to-b from-purple-400 to-purple-600 flex items-center justify-center shadow-md border border-purple-500/50">
          <div className="absolute inset-0.5 rounded bg-gradient-to-b from-white/30 to-transparent"></div>
          <BarChart3 className="h-4 w-4 text-white relative z-10 drop-shadow" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white text-shadow">Market Watch</h3>
          <p className="text-[10px] text-white/70">Live Prices</p>
        </div>
      </div>
      
      {/* Stock List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide divide-y divide-slate-200/30">
        {stocks.map((stock, index) => {
          const isPositive = stock.change >= 0;
          const isSelected = selectedStockSymbol === stock.symbol;
          
          return (
            <button
              type="button"
              key={stock.symbol}
              onClick={() => onSelectStock(stock)}
              className={`
                relative w-full flex items-center justify-between p-3 transition-all duration-200 group cursor-pointer
                ${isSelected 
                  ? 'bg-gradient-to-r from-sky-200/50 via-sky-100/30 to-transparent' 
                  : 'hover:bg-white/30'
                }
              `}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-400 to-sky-600 rounded-r shadow-md"></div>
              )}
              
              <div className="flex items-center gap-3 text-left">
                {/* Stock indicator with skeuomorphic style */}
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center transition-all shadow-sm
                  ${isPositive 
                    ? 'bg-gradient-to-b from-green-100 to-green-200 border border-green-300' 
                    : 'bg-gradient-to-b from-red-100 to-red-200 border border-red-300'
                  }
                  ${isSelected ? 'shadow-md scale-105' : 'group-hover:shadow-md group-hover:scale-105'}
                `}>
                  {isPositive 
                    ? <ArrowUpRight className="h-5 w-5 text-green-600" /> 
                    : <ArrowDownRight className="h-5 w-5 text-red-600" />
                  }
                </div>
                <div>
                  <p className={`font-bold text-sm transition-colors ${isSelected ? 'text-sky-800' : 'text-slate-700 group-hover:text-slate-900'}`}>
                    {stock.symbol}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate max-w-[100px]">
                    {stock.name}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-bold text-sm ${isSelected ? 'text-slate-800' : 'text-slate-700'}`}>
                  {currency}{stock.price.toFixed(2)}
                </p>
                {/* Skeuomorphic percent badge */}
                <span className={`
                  inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5
                  ${isPositive 
                    ? 'bg-gradient-to-b from-green-100 to-green-200 text-green-700 border border-green-300' 
                    : 'bg-gradient-to-b from-red-100 to-red-200 text-red-700 border border-red-300'
                  }
                `}>
                  {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
