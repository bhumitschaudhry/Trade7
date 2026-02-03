import { Stock } from '../data/mockData';
import { ArrowUpRight, ArrowDownRight, Briefcase } from 'lucide-react';

interface PortfolioTableProps {
  holdings: Record<string, number>;
  avgCosts: Record<string, number>;
  stocks: Stock[];
  currency?: string;
}

export function PortfolioTable({ holdings, avgCosts, stocks, currency = "$" }: PortfolioTableProps) {
  const activeHoldings = Object.entries(holdings)
    .filter(([, qty]) => qty > 0)
    .map(([symbol, qty]) => {
      const stock = stocks.find(s => s.symbol === symbol);
      if (!stock) return null;
      
      const avgCost = avgCosts[symbol] || stock.price;
      const marketValue = qty * stock.price;
      const totalCost = qty * avgCost;
      const returnValue = marketValue - totalCost;
      const returnPercent = totalCost !== 0 ? (returnValue / totalCost) * 100 : 0;
      
      return {
        symbol,
        name: stock.name,
        qty,
        avgCost,
        currentPrice: stock.price,
        marketValue,
        returnValue,
        returnPercent
      };
    })
    .filter(item => item !== null);

  if (activeHoldings.length === 0) {
    return (
      <div className="aero-window rounded-xl p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-b from-slate-200 to-slate-300 border border-slate-400 flex items-center justify-center shadow-inner">
          <Briefcase className="h-8 w-8 text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-700">Empty Portfolio</h3>
        <p className="mt-2 text-slate-500">Buy some stocks to see your portfolio details.</p>
      </div>
    );
  }

  return (
    <div className="aero-window rounded-xl overflow-hidden">
      {/* Title Bar */}
      <div className="aero-titlebar flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-md bg-gradient-to-b from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md border border-emerald-500/50">
          <Briefcase className="h-4 w-4 text-white drop-shadow" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white text-shadow">Portfolio Holdings</h3>
          <p className="text-[10px] text-white/70">{activeHoldings.length} Active Positions</p>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gradient-to-b from-slate-100/80 to-slate-200/60 text-[10px] uppercase text-slate-600 font-bold tracking-wide border-b border-slate-300/50">
            <tr>
              <th className="px-5 py-3">Asset</th>
              <th className="px-5 py-3 text-right">Shares</th>
              <th className="px-5 py-3 text-right hidden sm:table-cell">Avg Cost</th>
              <th className="px-5 py-3 text-right hidden md:table-cell">Current</th>
              <th className="px-5 py-3 text-right">Value</th>
              <th className="px-5 py-3 text-right">Return</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50">
            {activeHoldings.map((item) => {
              const isPositive = item!.returnValue >= 0;
              return (
                <tr key={item!.symbol} className="hover:bg-white/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {/* Skeuomorphic indicator */}
                      <div className={`
                        w-9 h-9 rounded-lg flex items-center justify-center shadow-sm
                        ${isPositive 
                          ? 'bg-gradient-to-b from-green-100 to-green-200 border border-green-300' 
                          : 'bg-gradient-to-b from-red-100 to-red-200 border border-red-300'
                        }
                      `}>
                        {isPositive 
                          ? <ArrowUpRight className="h-4 w-4 text-green-600" />
                          : <ArrowDownRight className="h-4 w-4 text-red-600" />
                        }
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{item!.symbol}</p>
                        <p className="text-[10px] text-slate-500 hidden sm:block">{item!.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-slate-700">{item!.qty.toFixed(2)}</td>
                  <td className="px-5 py-4 text-right text-slate-600 hidden sm:table-cell">{currency}{item!.avgCost.toFixed(2)}</td>
                  <td className="px-5 py-4 text-right text-slate-600 hidden md:table-cell">{currency}{item!.currentPrice.toFixed(2)}</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800">{currency}{item!.marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-5 py-4 text-right">
                    <div className={`inline-flex items-center gap-1 font-bold ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
                      {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      <span>{currency}{Math.abs(item!.returnValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <span className={`
                        text-[10px] ml-1 px-1.5 py-0.5 rounded
                        ${isPositive 
                          ? 'bg-gradient-to-b from-green-100 to-green-200 border border-green-300' 
                          : 'bg-gradient-to-b from-red-100 to-red-200 border border-red-300'
                        }
                      `}>
                        {item!.returnPercent.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
