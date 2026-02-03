import { useState, useEffect } from 'react';
import { Sidebar, View } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCard } from './components/MetricCard';
import { StockChart } from './components/StockChart';
import { StockList } from './components/StockList';
import { TradeModal } from './components/TradeModal';
import { PortfolioTable } from './components/PortfolioTable';
import { TransactionHistory, Transaction } from './components/TransactionHistory';
import { useStockData } from './hooks/useStockData';
import { DollarSign, TrendingUp, Activity, PieChart } from 'lucide-react';

const INITIAL_CASH_BALANCE = 50000;

export function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State Initialization with Local Storage Persistence
  const [marketType, setMarketType] = useState<'US' | 'IN'>(() => {
    return (localStorage.getItem('trade7_market_type') as 'US' | 'IN') || 'US';
  });

  const { stocks } = useStockData(marketType);
  const currency = marketType === 'US' ? '$' : '₹';

  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  const [selectedSymbol, setSelectedSymbol] = useState(() => {
    return localStorage.getItem('trade7_selected_symbol') || "AAPL";
  });

  const [holdings, setHoldings] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem(`trade7_holdings_${marketType}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [avgCosts, setAvgCosts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem(`trade7_avg_costs_${marketType}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [cashBalance, setCashBalance] = useState(() => {
    const saved = localStorage.getItem(`trade7_balance_${marketType}`);
    return saved ? parseFloat(saved) : INITIAL_CASH_BALANCE;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`trade7_transactions_${marketType}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((t: Transaction & { date: string }) => ({ ...t, date: new Date(t.date) }));
    }
    return [];
  });
  
  // Trade Modal State
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('trade7_market_type', marketType);
  }, [marketType]);

  useEffect(() => {
    localStorage.setItem('trade7_selected_symbol', selectedSymbol);
  }, [selectedSymbol]);

  useEffect(() => {
    localStorage.setItem(`trade7_holdings_${marketType}`, JSON.stringify(holdings));
  }, [holdings, marketType]);

  useEffect(() => {
    localStorage.setItem(`trade7_avg_costs_${marketType}`, JSON.stringify(avgCosts));
  }, [avgCosts, marketType]);

  useEffect(() => {
    localStorage.setItem(`trade7_balance_${marketType}`, cashBalance.toString());
  }, [cashBalance, marketType]);

  useEffect(() => {
    localStorage.setItem(`trade7_transactions_${marketType}`, JSON.stringify(transactions));
  }, [transactions, marketType]);

  // Handle Market Switch
  const toggleMarket = () => {
    const newMarket = marketType === 'US' ? 'IN' : 'US';
    setMarketType(newMarket);
    // Reset selected symbol when switching markets
    const newStocks = newMarket === 'US' ? ['AAPL', 'TSLA', 'NVDA'] : ['RELIANCE', 'TCS', 'HDFCBANK'];
    setSelectedSymbol(newStocks[0]);
    
    // Load holdings, avgCosts, cashBalance, and transactions for the new market
    const savedHoldings = localStorage.getItem(`trade7_holdings_${newMarket}`);
    setHoldings(savedHoldings ? JSON.parse(savedHoldings) : {});
    
    const savedAvgCosts = localStorage.getItem(`trade7_avg_costs_${newMarket}`);
    setAvgCosts(savedAvgCosts ? JSON.parse(savedAvgCosts) : {});
    
    const savedBalance = localStorage.getItem(`trade7_balance_${newMarket}`);
    setCashBalance(savedBalance ? parseFloat(savedBalance) : INITIAL_CASH_BALANCE);
    
    const savedTransactions = localStorage.getItem(`trade7_transactions_${newMarket}`);
    if (savedTransactions) {
      const parsed = JSON.parse(savedTransactions);
      setTransactions(parsed.map((t: Transaction & { date: string }) => ({ ...t, date: new Date(t.date) })));
    } else {
      setTransactions([]);
    }
  };

  // Ensure selected stock is valid for current market
  const selectedStock = stocks.find(s => s.symbol === selectedSymbol) || stocks[0];
  
  useEffect(() => {
    if (stocks.length > 0 && !stocks.find(s => s.symbol === selectedSymbol)) {
      setSelectedSymbol(stocks[0].symbol);
    }
  }, [stocks, selectedSymbol]);

  if (!selectedStock) return (
    <div className="flex h-screen items-center justify-center">
      <div className="aero-window rounded-xl p-8 text-center">
        <div className="w-12 h-12 border-4 border-sky-300 border-t-sky-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-700 font-semibold">Loading Market Data...</p>
      </div>
    </div>
  );

  // Calculate Portfolio Totals
  const portfolioValue = stocks.reduce((total, stock) => {
    return total + (stock.price * (holdings[stock.symbol] || 0));
  }, 0);

  const totalCostBasis = Object.entries(holdings).reduce((total, [symbol, qty]) => {
    return total + (qty * (avgCosts[symbol] || 0));
  }, 0);

  const totalBalance = cashBalance + portfolioValue;
  const totalProfit = portfolioValue - totalCostBasis;
  const profitPercent = totalCostBasis > 0 ? (totalProfit / totalCostBasis) * 100 : 0;
  
  const activePositions = Object.keys(holdings).filter(key => holdings[key] > 0).length;

  const handleOpenTradeModal = (type: 'buy' | 'sell') => {
    setTradeType(type);
    setIsTradeModalOpen(true);
  };

  const handleTrade = (quantity: number) => {
    if (quantity <= 0) return;

    const price = selectedStock.price;
    const cost = quantity * price;

    if (tradeType === 'buy') {
      if (cost > cashBalance) return; 

      setCashBalance(prev => prev - cost);
      
      const currentQty = holdings[selectedStock.symbol] || 0;
      const currentAvg = avgCosts[selectedStock.symbol] || 0;
      const newQty = currentQty + quantity;
      const newAvg = ((currentQty * currentAvg) + cost) / newQty;

      setAvgCosts(prev => ({ ...prev, [selectedStock.symbol]: newAvg }));
      setHoldings(prev => ({
        ...prev,
        [selectedStock.symbol]: newQty
      }));

    } else {
      if (quantity > (holdings[selectedStock.symbol] || 0)) return;
      
      setCashBalance(prev => prev + cost);
      setHoldings(prev => ({
        ...prev,
        [selectedStock.symbol]: (prev[selectedStock.symbol] || 0) - quantity
      }));
    }
    
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: tradeType,
      symbol: selectedStock.symbol,
      quantity,
      price,
      date: new Date()
    };
    setTransactions(prev => [...prev, newTransaction]);
    
    setIsTradeModalOpen(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-800 text-shadow-light">Dashboard</h1>
              <p className="text-slate-600 mt-1 text-sm">Overview of your market performance.</p>
            </div>
            
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <MetricCard 
                title="Total Balance" 
                value={`${currency}${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                change={`${profitPercent.toFixed(2)}%`}
                isPositive={totalProfit >= 0}
                icon={DollarSign}
                colorClass="bg-emerald-500 text-emerald-500"
              />
              <MetricCard 
                title="Total Profit" 
                value={`${totalProfit >= 0 ? '+' : ''}${currency}${Math.abs(totalProfit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                change={`${(profitPercent).toFixed(2)}%`}
                isPositive={totalProfit >= 0}
                icon={TrendingUp}
                colorClass="bg-blue-500 text-blue-500"
              />
              <MetricCard 
                title="Active Positions" 
                value={activePositions.toString()} 
                icon={Activity}
                colorClass="bg-purple-500 text-purple-500"
              />
              <MetricCard 
                title="Buying Power" 
                value={`${currency}${cashBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
                icon={PieChart}
                colorClass="bg-orange-500 text-orange-500"
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-5">
                <StockChart 
                  stock={selectedStock} 
                  onTrade={handleOpenTradeModal}
                  currency={currency}
                />
                
                {/* Position Summary - Windows 7 Style */}
                <div className="aero-window rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded bg-gradient-to-b from-sky-400 to-sky-600 flex items-center justify-center shadow-sm border border-sky-500/50">
                      <Activity className="h-3.5 w-3.5 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-800">
                      Your Position: <span className="text-sky-700">{selectedStock.symbol}</span>
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="aero-card rounded-lg p-4">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide font-bold mb-1">Shares</p>
                      <p className="text-xl font-bold text-slate-800">{holdings[selectedStock.symbol]?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="aero-card rounded-lg p-4">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide font-bold mb-1">Avg Cost</p>
                      <p className="text-xl font-bold text-slate-800">{currency}{(avgCosts[selectedStock.symbol] || 0).toFixed(2)}</p>
                    </div>
                    <div className="aero-card rounded-lg p-4">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide font-bold mb-1">Market Value</p>
                      <p className="text-xl font-bold text-slate-800">{currency}{((holdings[selectedStock.symbol] || 0) * selectedStock.price).toFixed(2)}</p>
                    </div>
                    <div className="aero-card rounded-lg p-4">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide font-bold mb-1">Return</p>
                      <p className={`text-xl font-bold ${((holdings[selectedStock.symbol] || 0) * (selectedStock.price - (avgCosts[selectedStock.symbol] || 0))) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {currency}{((holdings[selectedStock.symbol] || 0) * (selectedStock.price - (avgCosts[selectedStock.symbol] || 0))).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <StockList 
                  stocks={stocks} 
                  onSelectStock={(stock) => setSelectedSymbol(stock.symbol)} 
                  selectedStockSymbol={selectedStock.symbol}
                  currency={currency}
                />
              </div>
            </div>
          </>
        );
        
      case 'market':
        return (
          <div className="h-full flex flex-col">
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-slate-800 text-shadow-light">Market Overview</h1>
              <p className="text-slate-600 mt-1 text-sm">Explore and trade available stocks.</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3 flex-1 overflow-hidden">
              <div className="lg:col-span-2 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  <StockChart stock={selectedStock} onTrade={handleOpenTradeModal} currency={currency} />
                </div>
              </div>
              <div className="lg:col-span-1 overflow-y-auto scrollbar-hide">
                <StockList 
                  stocks={stocks} 
                  onSelectStock={(stock) => setSelectedSymbol(stock.symbol)} 
                  selectedStockSymbol={selectedStock.symbol}
                  currency={currency}
                />
              </div>
            </div>
          </div>
        );
        
      case 'portfolio':
        return (
          <>
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-slate-800 text-shadow-light">My Portfolio</h1>
              <p className="text-slate-600 mt-1 text-sm">Detailed breakdown of your holdings.</p>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
              <div className="aero-window rounded-xl p-5">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Net Liquidation Value</p>
                <p className="text-2xl font-bold text-slate-800 mt-2">{currency}{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="aero-window rounded-xl p-5">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Total Profit / Loss</p>
                <p className={`text-2xl font-bold mt-2 ${totalProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {totalProfit >= 0 ? '+' : ''}{currency}{Math.abs(totalProfit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="aero-window rounded-xl p-5">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Cash Available</p>
                <p className="text-2xl font-bold text-slate-800 mt-2">{currency}{cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
            
            <PortfolioTable holdings={holdings} avgCosts={avgCosts} stocks={stocks} currency={currency} />
          </>
        );
        
      case 'transactions':
        return (
          <>
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-slate-800 text-shadow-light">Transaction History</h1>
              <p className="text-slate-600 mt-1 text-sm">Log of all your trading activities.</p>
            </div>
            <TransactionHistory transactions={transactions} currency={currency} />
          </>
        );
        
      default:
        return <div>View not implemented</div>;
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <Header 
          marketType={marketType} 
          onToggleMarket={toggleMarket} 
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-3 md:p-4 scrollbar-hide">
          <div className="mx-auto max-w-7xl animate-fade-in">
            {renderContent()}
          </div>
        </main>

        <TradeModal
          isOpen={isTradeModalOpen}
          onClose={() => setIsTradeModalOpen(false)}
          type={tradeType}
          stock={selectedStock}
          currentPrice={selectedStock.price}
          availableBalance={cashBalance}
          currentHoldings={holdings[selectedStock.symbol] || 0}
          onConfirm={handleTrade}
          currency={currency}
        />
      </div>
    </div>
  );
}
