export interface StockDataPoint {
  time: string;
  value: number; // Keeping 'value' for backward compatibility (same as close)
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  data: StockDataPoint[];
}

function generateIntradayData(basePrice: number, points: number = 50): StockDataPoint[] {
  const data: StockDataPoint[] = [];
  let currentPrice = basePrice;
  const startTime = new Date();
  startTime.setHours(9, 30, 0, 0);

  // Generate a random walk
  for (let i = 0; i < points; i++) {
    const time = new Date(startTime.getTime() + i * 5 * 60000); // 5 minute intervals
    const volatility = basePrice * 0.002; // 0.2% volatility
    const change = (Math.random() - 0.5) * volatility;
    
    const prevClose = currentPrice;
    currentPrice += change;
    
    // Simulate OHLC within the interval
    const open = prevClose;
    const close = currentPrice;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;

    data.push({
      time: `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`,
      value: close,
      open,
      high,
      low,
      close
    });
  }
  return data;
}

export const usStocks: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 173.50,
    change: 2.35,
    changePercent: 1.37,
    volume: "54.2M",
    marketCap: "2.7T",
    data: generateIntradayData(173.50),
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 205.60,
    change: -4.20,
    changePercent: -2.00,
    volume: "98.5M",
    marketCap: "650B",
    data: generateIntradayData(205.60),
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 880.15,
    change: 15.40,
    changePercent: 1.78,
    volume: "42.1M",
    marketCap: "2.2T",
    data: generateIntradayData(880.15),
  },
  {
    symbol: "AMZN",
    name: "Amazon.com",
    price: 178.22,
    change: 1.12,
    changePercent: 0.63,
    volume: "33.8M",
    marketCap: "1.8T",
    data: generateIntradayData(178.22),
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    price: 415.50,
    change: 3.45,
    changePercent: 0.84,
    volume: "22.5M",
    marketCap: "3.1T",
    data: generateIntradayData(415.50),
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 142.65,
    change: -1.25,
    changePercent: -0.87,
    volume: "18.4M",
    marketCap: "1.7T",
    data: generateIntradayData(142.65),
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    price: 485.20,
    change: 5.60,
    changePercent: 1.17,
    volume: "15.1M",
    marketCap: "1.2T",
    data: generateIntradayData(485.20),
  },
  {
    symbol: "NFLX",
    name: "Netflix, Inc.",
    price: 605.30,
    change: -8.45,
    changePercent: -1.38,
    volume: "4.2M",
    marketCap: "260B",
    data: generateIntradayData(605.30),
  },
  {
    symbol: "AMD",
    name: "Adv. Micro Devices",
    price: 180.45,
    change: 4.20,
    changePercent: 2.38,
    volume: "65.3M",
    marketCap: "290B",
    data: generateIntradayData(180.45),
  },
  {
    symbol: "INTC",
    name: "Intel Corp.",
    price: 42.15,
    change: -0.85,
    changePercent: -1.98,
    volume: "32.1M",
    marketCap: "178B",
    data: generateIntradayData(42.15),
  },
];

export const indianStocks: Stock[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    price: 2985.50,
    change: 45.20,
    changePercent: 1.54,
    volume: "8.5M",
    marketCap: "19.5T",
    data: generateIntradayData(2985.50),
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Svcs",
    price: 3950.25,
    change: -15.40,
    changePercent: -0.39,
    volume: "2.1M",
    marketCap: "14.2T",
    data: generateIntradayData(3950.25),
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    price: 1450.75,
    change: 12.30,
    changePercent: 0.85,
    volume: "12.4M",
    marketCap: "11.1T",
    data: generateIntradayData(1450.75),
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd",
    price: 1620.40,
    change: 8.60,
    changePercent: 0.53,
    volume: "5.6M",
    marketCap: "6.8T",
    data: generateIntradayData(1620.40),
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    price: 1080.15,
    change: -5.25,
    changePercent: -0.48,
    volume: "9.2M",
    marketCap: "7.5T",
    data: generateIntradayData(1080.15),
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    price: 760.30,
    change: 14.20,
    changePercent: 1.90,
    volume: "15.8M",
    marketCap: "6.8T",
    data: generateIntradayData(760.30),
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel",
    price: 1210.50,
    change: 22.40,
    changePercent: 1.88,
    volume: "4.5M",
    marketCap: "6.9T",
    data: generateIntradayData(1210.50),
  },
  {
    symbol: "ITC",
    name: "ITC Ltd",
    price: 430.25,
    change: 1.15,
    changePercent: 0.27,
    volume: "8.9M",
    marketCap: "5.4T",
    data: generateIntradayData(430.25),
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro",
    price: 3650.80,
    change: -25.40,
    changePercent: -0.69,
    volume: "1.8M",
    marketCap: "5.1T",
    data: generateIntradayData(3650.80),
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors",
    price: 985.40,
    change: 32.60,
    changePercent: 3.42,
    volume: "18.5M",
    marketCap: "3.6T",
    data: generateIntradayData(985.40),
  },
];
