# Trade7 - Stock Trading Dashboard

A sophisticated stock trading simulator with a unique dark theme inspired by Frutiger Aero and Windows 7 aesthetics. Practice trading with virtual money in both US and Indian markets.

![Trade7 Dashboard](https://img.shields.io/badge/React-19.2.3-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-06B6D4?logo=tailwindcss)

## Features

- **Dual Market Support**: Switch between US (NASDAQ, NYSE) and Indian (BSE, NSE) stock markets
- **Real-time Price Simulation**: Mock stock prices update every 5 seconds with realistic fluctuations
- **Portfolio Management**: Track holdings, average cost basis, and profit/loss
- **Transaction History**: Complete log of all your trading activities
- **Interactive Charts**: Candlestick charts showing stock price movements
- **Dark Theme**: Unique retro-futuristic aesthetic with glassmorphism effects
- **Fully Responsive**: Works on desktop and mobile devices

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19.2.3 with TypeScript |
| **Build Tool** | Vite 7.2.4 |
| **Styling** | Tailwind CSS 4.1.17 |
| **Charts** | Recharts 3.7.0 |
| **Icons** | Lucide React 0.563.0 |
| **Utilities** | clsx, tailwind-merge, date-fns |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Trade7.git
cd Trade7

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

The build outputs to the `dist/` directory as a single HTML file using `vite-plugin-singlefile`.

## Project Structure

```
Trade7/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx       # Header with market switcher
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── StockChart.tsx   # Interactive candlestick chart
│   │   ├── StockList.tsx    # List of available stocks
│   │   ├── TradeModal.tsx   # Buy/sell modal
│   │   ├── PortfolioTable.tsx   # Holdings breakdown
│   │   ├── TransactionHistory.tsx # Trade log
│   │   └── MetricCard.tsx   # Dashboard metric cards
│   ├── data/
│   │   └── mockData.ts      # Mock stock data
│   ├── hooks/
│   │   └── useStockData.ts  # Stock data management hook
│   ├── App.tsx              # Main application
│   ├── main.tsx             # Entry point
│   └── index.css            # Custom styles
├── .github/workflows/
│   └── deploy.yml           # GitHub Pages deployment
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Usage

1. **Select a Market**: Use the dropdown in the header to switch between US and Indian markets
2. **View Stocks**: Browse available stocks with real-time price updates
3. **Trade Stocks**: Click on any stock to open the trade modal and buy/sell
4. **Track Portfolio**: Monitor your holdings in the Portfolio tab
5. **Review History**: Check all your past transactions in the History tab

## Deployment

This project is configured for GitHub Pages deployment. The workflow automatically deploys to the `gh-pages` branch when you push to `master`.

To deploy manually:

```bash
npm run build
# Upload contents of dist/ folder to your hosting provider
```

## License

This project is open source and available under the MIT License.
