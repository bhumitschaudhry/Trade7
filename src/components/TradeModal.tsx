import { useState, useEffect } from 'react';
import { X, TrendingUp, Wallet, ShoppingCart, ArrowRightLeft } from 'lucide-react';
import { Stock } from '../data/mockData';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'buy' | 'sell';
  stock: Stock;
  currentPrice: number;
  availableBalance: number;
  currentHoldings: number;
  onConfirm: (quantity: number) => void;
  currency?: string;
}

export function TradeModal({ 
  isOpen, 
  onClose, 
  type, 
  stock, 
  currentPrice, 
  availableBalance, 
  currentHoldings,
  onConfirm,
  currency = "$"
}: TradeModalProps) {
  const [quantity, setQuantity] = useState<string>('1');
  
  useEffect(() => {
    if (isOpen) setQuantity('1');
  }, [isOpen]);

  if (!isOpen) return null;

  const numQuantity = parseFloat(quantity) || 0;
  const estimatedTotal = numQuantity * currentPrice;
  const canAfford = type === 'buy' ? estimatedTotal <= availableBalance : true;
  const hasEnoughShares = type === 'sell' ? numQuantity <= currentHoldings : true;
  const isValid = numQuantity > 0 && canAfford && hasEnoughShares;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal - Windows 7 Dialog Style */}
      <div className="relative w-full max-w-md aero-window rounded-xl overflow-hidden animate-slide-up">
        {/* Title Bar */}
        <div className="aero-titlebar flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-b ${type === 'buy' ? 'from-green-400 to-green-600 border-green-500/50' : 'from-blue-400 to-blue-600 border-blue-500/50'} flex items-center justify-center shadow-md border`}>
              <div className="absolute inset-0.5 rounded-md bg-gradient-to-b from-white/30 to-transparent"></div>
              {type === 'buy' ? (
                <ShoppingCart className="h-4 w-4 text-white relative z-10 drop-shadow" />
              ) : (
                <ArrowRightLeft className="h-4 w-4 text-white relative z-10 drop-shadow" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white text-shadow">
                {type === 'buy' ? 'Buy' : 'Sell'} {stock.symbol}
              </h2>
              <p className="text-[10px] text-white/70">{stock.name}</p>
            </div>
          </div>
          
          {/* Close Button - Windows Style */}
          <button 
            onClick={onClose} 
            className="w-7 h-7 rounded flex items-center justify-center bg-gradient-to-b from-red-400 to-red-600 border border-red-700 hover:from-red-500 hover:to-red-700 transition-all shadow-sm"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="aero-card rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-gradient-to-b from-sky-400 to-sky-600 flex items-center justify-center shadow-sm border border-sky-500/50">
                  <TrendingUp className="h-3 w-3 text-white" />
                </div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Current Price</p>
              </div>
              <p className="text-xl font-bold text-slate-800">{currency}{currentPrice.toFixed(2)}</p>
            </div>
            <div className="aero-card rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-gradient-to-b from-purple-400 to-purple-600 flex items-center justify-center shadow-sm border border-purple-500/50">
                  <Wallet className="h-3 w-3 text-white" />
                </div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">
                  {type === 'buy' ? 'Available' : 'Holdings'}
                </p>
              </div>
              <p className="text-xl font-bold text-slate-800">
                {type === 'buy' 
                  ? `${currency}${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` 
                  : `${currentHoldings} Shares`}
              </p>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="mb-5">
            <label className="mb-2 block text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Quantity
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="aero-input w-full rounded-lg p-4 text-xl font-bold placeholder-slate-400"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">Shares</span>
            </div>
          </div>

          {/* Estimated Total */}
          <div className="aero-card rounded-lg p-4 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-semibold">Estimated Total</span>
              <span className="text-2xl font-bold text-slate-800">
                {currency}{estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          {/* Error Messages */}
          {type === 'buy' && !canAfford && (
            <div className="mb-4 p-3 rounded-lg bg-gradient-to-b from-red-100 to-red-200 border border-red-300 shadow-inner">
              <p className="text-sm font-semibold text-red-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Insufficient funds
              </p>
            </div>
          )}
          {type === 'sell' && !hasEnoughShares && (
            <div className="mb-4 p-3 rounded-lg bg-gradient-to-b from-red-100 to-red-200 border border-red-300 shadow-inner">
              <p className="text-sm font-semibold text-red-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Insufficient shares
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 aero-button rounded-lg py-3 font-bold text-slate-700 transition-all active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (isValid) {
                  onConfirm(numQuantity);
                }
              }}
              disabled={!isValid}
              className={`
                flex-1 rounded-lg py-3 font-bold transition-all active:scale-95 cursor-pointer
                ${isValid 
                  ? type === 'buy' 
                    ? 'aero-button-green' 
                    : 'aero-button-blue'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-400'
                }
              `}
            >
              {type === 'buy' ? 'Confirm Buy' : 'Confirm Sell'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
