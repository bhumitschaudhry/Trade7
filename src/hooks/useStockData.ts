import { useState, useEffect } from 'react';
import { Stock, usStocks, indianStocks, StockDataPoint } from '../data/mockData';

export function useStockData(marketType: 'US' | 'IN') {
  const [stocks, setStocks] = useState<Stock[]>([]);

  // Initialize stocks when marketType changes
  useEffect(() => {
    setStocks(marketType === 'US' ? usStocks : indianStocks);
  }, [marketType]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prevStocks) => {
        return prevStocks.map((stock) => {
          // Generate a more subtle random fluctuation
          const volatility = 0.0008; // 0.08% max change per tick (more realistic)
          const changePercent = (Math.random() - 0.5) * 2 * volatility;
          const priceChange = stock.price * changePercent;
          
          const prevClose = stock.price;
          const newPrice = Math.max(0.01, stock.price + priceChange);
          
          // Update historical data
          const now = new Date();
          const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
          
          // Simulate OHLC for this tick
          const open = prevClose;
          const close = newPrice;
          // Random high/low around open/close
          const high = Math.max(open, close) + Math.random() * volatility * stock.price * 0.5;
          const low = Math.min(open, close) - Math.random() * volatility * stock.price * 0.5;

          const newDataPoint: StockDataPoint = {
            time: timeString,
            value: newPrice,
            open,
            high,
            low,
            close
          };
          
          // Keep last 100 data points to show a realistic trend
          const newData = [...stock.data, newDataPoint].slice(-100);

          const newChange = stock.change + priceChange;
          const openPrice = stock.price - stock.change;
          const newChangePercent = openPrice !== 0 ? (newChange / openPrice) * 100 : 0;

          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            data: newData
          };
        });
      });
    }, 5000); // Update every 5 seconds for more realistic market simulation

    return () => clearInterval(interval);
  }, [marketType]);

  return { stocks };
}
