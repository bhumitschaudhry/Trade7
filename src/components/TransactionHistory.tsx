import { ArrowUpRight, ArrowDownRight, Clock, History } from 'lucide-react';

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  quantity: number;
  price: number;
  date: Date;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  currency?: string;
}

export function TransactionHistory({ transactions, currency = "$" }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <div className="aero-window rounded-xl p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-b from-slate-200 to-slate-300 border border-slate-400 flex items-center justify-center shadow-inner">
          <Clock className="h-8 w-8 text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-700">No transactions yet</h3>
        <p className="mt-2 text-slate-500">Start trading to see your history here.</p>
      </div>
    );
  }

  return (
    <div className="aero-window rounded-xl overflow-hidden">
      {/* Title Bar */}
      <div className="aero-titlebar flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-md bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center shadow-md border border-blue-500/50">
          <History className="h-4 w-4 text-white drop-shadow" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white text-shadow">Transaction History</h3>
          <p className="text-[10px] text-white/70">{transactions.length} Total Transactions</p>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gradient-to-b from-slate-100/80 to-slate-200/60 text-[10px] uppercase text-slate-600 font-bold tracking-wide border-b border-slate-300/50">
            <tr>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Symbol</th>
              <th className="px-5 py-3 hidden sm:table-cell">Date</th>
              <th className="px-5 py-3 text-right">Quantity</th>
              <th className="px-5 py-3 text-right hidden md:table-cell">Price</th>
              <th className="px-5 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50">
            {transactions.slice().reverse().map((tx) => (
              <tr key={tx.id} className="hover:bg-white/40 transition-colors">
                <td className="px-5 py-4">
                  {/* Skeuomorphic badge */}
                  <span className={`
                    inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold shadow-sm
                    ${tx.type === 'buy' 
                      ? 'bg-gradient-to-b from-green-100 to-green-200 text-green-800 border border-green-300' 
                      : 'bg-gradient-to-b from-blue-100 to-blue-200 text-blue-800 border border-blue-300'
                    }
                  `}>
                    {tx.type === 'buy' ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                    {tx.type === 'buy' ? 'Buy' : 'Sell'}
                  </span>
                </td>
                <td className="px-5 py-4 font-bold text-slate-800">{tx.symbol}</td>
                <td className="px-5 py-4 text-slate-500 text-xs hidden sm:table-cell">
                  <div>{tx.date.toLocaleDateString()}</div>
                  <div className="text-slate-400">{tx.date.toLocaleTimeString()}</div>
                </td>
                <td className="px-5 py-4 text-right font-semibold text-slate-700">{tx.quantity}</td>
                <td className="px-5 py-4 text-right text-slate-600 hidden md:table-cell">{currency}{tx.price.toFixed(2)}</td>
                <td className="px-5 py-4 text-right font-bold text-slate-800">
                  {currency}{(tx.quantity * tx.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
