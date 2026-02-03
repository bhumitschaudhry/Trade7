import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Cell } from 'recharts';
import { Stock } from '../data/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StockChartProps {
  stock: Stock;
  onTrade: (type: 'buy' | 'sell') => void;
  currency?: string;
}

const TIMEFRAMES = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

export function StockChart({ stock, onTrade, currency = "$" }: StockChartProps) {
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState<'area' | 'candle'>('area');
  
  const isPositive = stock.change >= 0;
  const color = isPositive ? "#22c55e" : "#ef4444";

  // Filter data based on timeframe
  const getFilteredData = () => {
    const dataPoints = stock.data.length;
    let pointsToShow: number;

    switch (timeframe) {
      case '1D':
        pointsToShow = Math.min(50, dataPoints);
        break;
      case '1W':
        pointsToShow = Math.min(75, dataPoints);
        break;
      case '1M':
        pointsToShow = Math.min(100, dataPoints);
        break;
      case '3M':
        pointsToShow = dataPoints; // Show all available
        break;
      case '1Y':
        pointsToShow = dataPoints; // Show all available
        break;
      case 'ALL':
        pointsToShow = dataPoints;
        break;
      default:
        pointsToShow = dataPoints;
    }

    return stock.data.slice(-pointsToShow);
  };

  const filteredData = getFilteredData();

  // Prepare data for candlestick chart
  const candleData = filteredData.map(d => ({
    ...d,
    candleBody: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
    candleWick: [d.low, d.high],
    color: d.close >= d.open ? '#22c55e' : '#ef4444'
  }));

  return (
    <div className="relative aero-window rounded-xl overflow-hidden">
      {/* Window Title Bar */}
      <div className="aero-titlebar flex items-center justify-between px-4 py-3 rounded-t-xl">
        <div className="flex items-center gap-3">
          {/* Stock Icon */}
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-b ${isPositive ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'} flex items-center justify-center shadow-md border ${isPositive ? 'border-green-500/50' : 'border-red-500/50'}`}>
            <div className="absolute inset-0.5 rounded-md bg-gradient-to-b from-white/30 to-transparent"></div>
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-white relative z-10 drop-shadow" />
            ) : (
              <TrendingDown className="h-5 w-5 text-white relative z-10 drop-shadow" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white text-shadow">
              {stock.name}
            </h3>
            <p className="text-xs text-white/70">{stock.symbol} • Intraday</p>
          </div>
        </div>
        
        {/* Window Controls */}
        <div className="flex items-center gap-4">
          {/* Chart Type Toggle */}
          <div className="aero-card rounded-md p-1 flex gap-1">
            <button
              type="button"
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer select-none z-10 ${
                chartType === 'area'
                  ? 'aero-button-blue'
                  : 'text-slate-600 hover:bg-white/40 bg-white/20'
              }`}
            >
              Line
            </button>
            <button
              type="button"
              onClick={() => setChartType('candle')}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer select-none z-10 ${
                chartType === 'candle'
                  ? 'aero-button-blue'
                  : 'text-slate-600 hover:bg-white/40 bg-white/20'
              }`}
            >
              Candle
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="hidden md:flex aero-card rounded-md p-1 gap-1">
            {TIMEFRAMES.map((tf) => (
              <button
                type="button"
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer select-none z-10 ${
                  timeframe === tf
                    ? 'aero-button-blue'
                    : 'text-slate-600 hover:bg-white/40 bg-white/20'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-5">
        {/* Price Display */}
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-4">
            <h2 className="text-4xl font-bold text-slate-800 text-shadow-light">
              {currency}{stock.price.toFixed(2)}
            </h2>
            {/* Skeuomorphic change badge */}
            <div className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold
              ${isPositive 
                ? 'bg-gradient-to-b from-green-100 to-green-200 text-green-800 border border-green-300 shadow-inner' 
                : 'bg-gradient-to-b from-red-100 to-red-200 text-red-800 border border-red-300 shadow-inner'
              }
            `}>
              <span className={`w-0 h-0 border-l-[5px] border-r-[5px] border-transparent ${isPositive ? 'border-b-[6px] border-b-green-600' : 'border-t-[6px] border-t-red-600'}`}></span>
              {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </div>
          </div>
          
          {/* Trade Buttons */}
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => onTrade('sell')}
              className="aero-button rounded-lg px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-red-100/50 transition-all active:scale-95 cursor-pointer z-10"
            >
              Sell
            </button>
            <button 
              type="button"
              onClick={() => onTrade('buy')}
              className="aero-button-green rounded-lg px-6 py-2.5 text-sm font-bold transition-all active:scale-95 cursor-pointer z-10"
            >
              Buy
            </button>
          </div>
        </div>
        
        {/* Chart */}
        <div className="h-[280px] md:h-[320px] w-full aero-card rounded-lg p-3">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id={`colorValue-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                    <stop offset="50%" stopColor={color} stopOpacity={0.15}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,120,150,0.15)" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(100,120,150,0.5)" 
                  tick={{ fill: 'rgba(50,70,90,0.7)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  stroke="rgba(100,120,150,0.5)"
                  tick={{ fill: 'rgba(50,70,90,0.7)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${currency}${value}`}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,245,255,0.95) 100%)',
                    border: '1px solid rgba(150,170,200,0.5)',
                    borderRadius: '8px',
                    color: '#1a1a2e',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                  itemStyle={{ color: '#1a1a2e' }}
                  cursor={{ stroke: 'rgba(100,140,200,0.4)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color} 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill={`url(#colorValue-${stock.symbol})`} 
                  isAnimationActive={false}
                />
              </AreaChart>
            ) : (
              <ComposedChart data={candleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,120,150,0.15)" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(100,120,150,0.5)" 
                  tick={{ fill: 'rgba(50,70,90,0.7)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  stroke="rgba(100,120,150,0.5)"
                  tick={{ fill: 'rgba(50,70,90,0.7)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${currency}${value}`}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{ 
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,245,255,0.95) 100%)',
                    border: '1px solid rgba(150,170,200,0.5)',
                    borderRadius: '8px',
                    color: '#1a1a2e',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                  }}
                  cursor={{ stroke: 'rgba(100,140,200,0.3)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="aero-card p-3 rounded-lg text-xs">
                          <p className="text-slate-500 mb-2 font-mono">{data.time}</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <span className="text-slate-500">Open:</span>
                            <span className="text-slate-800 font-mono font-semibold">{currency}{data.open.toFixed(2)}</span>
                            <span className="text-slate-500">High:</span>
                            <span className="text-green-700 font-mono font-semibold">{currency}{data.high.toFixed(2)}</span>
                            <span className="text-slate-500">Low:</span>
                            <span className="text-red-700 font-mono font-semibold">{currency}{data.low.toFixed(2)}</span>
                            <span className="text-slate-500">Close:</span>
                            <span className="text-slate-800 font-mono font-semibold">{currency}{data.close.toFixed(2)}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="candleWick" barSize={2} fill="#8884d8" isAnimationActive={false}>
                  {candleData.map((entry, index) => (
                    <Cell key={`cell-wick-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <Bar dataKey="candleBody" barSize={8} fill="#8884d8" isAnimationActive={false}>
                  {candleData.map((entry, index) => (
                    <Cell key={`cell-body-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
