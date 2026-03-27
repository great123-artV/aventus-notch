export const mockStocks = [
  { id: "aapl", name: "Apple Inc.", symbol: "AAPL", price: 189.84, change: 2.34, changePercent: 1.25, marketCap: "2.95T", volume: "54.2M", category: "stocks" },
  { id: "tsla", name: "Tesla Inc.", symbol: "TSLA", price: 248.42, change: -5.12, changePercent: -2.02, marketCap: "789B", volume: "112.5M", category: "stocks" },
  { id: "msft", name: "Microsoft Corp.", symbol: "MSFT", price: 378.91, change: 4.56, changePercent: 1.22, marketCap: "2.81T", volume: "22.1M", category: "stocks" },
  { id: "amzn", name: "Amazon.com Inc.", symbol: "AMZN", price: 178.25, change: 1.89, changePercent: 1.07, marketCap: "1.85T", volume: "45.3M", category: "stocks" },
  { id: "googl", name: "Alphabet Inc.", symbol: "GOOGL", price: 141.80, change: -0.95, changePercent: -0.67, marketCap: "1.76T", volume: "28.7M", category: "stocks" },
  { id: "nvda", name: "NVIDIA Corp.", symbol: "NVDA", price: 495.22, change: 12.45, changePercent: 2.58, marketCap: "1.22T", volume: "41.8M", category: "stocks" },
  { id: "meta", name: "Meta Platforms", symbol: "META", price: 354.23, change: 6.78, changePercent: 1.95, marketCap: "910B", volume: "18.2M", category: "stocks" },
  { id: "jpm", name: "JPMorgan Chase", symbol: "JPM", price: 172.40, change: -1.23, changePercent: -0.71, marketCap: "498B", volume: "9.5M", category: "stocks" },
];

export const mockForex = [
  { id: "eurusd", name: "EUR/USD", symbol: "EUR/USD", price: 1.0892, change: 0.0023, changePercent: 0.21, volume: "1.2B", category: "forex" },
  { id: "gbpusd", name: "GBP/USD", symbol: "GBP/USD", price: 1.2734, change: -0.0045, changePercent: -0.35, volume: "890M", category: "forex" },
  { id: "usdjpy", name: "USD/JPY", symbol: "USD/JPY", price: 149.52, change: 0.78, changePercent: 0.52, volume: "1.5B", category: "forex" },
  { id: "usdchf", name: "USD/CHF", symbol: "USD/CHF", price: 0.8821, change: -0.0012, changePercent: -0.14, volume: "450M", category: "forex" },
  { id: "audusd", name: "AUD/USD", symbol: "AUD/USD", price: 0.6543, change: 0.0034, changePercent: 0.52, volume: "320M", category: "forex" },
];

export const mockRealEstate = [
  { id: "re1", name: "Manhattan Luxury Condo", location: "New York, NY", price: 2500000, minInvestment: 50000, roi: 8.5, funded: 72, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop", type: "Residential" },
  { id: "re2", name: "Silicon Valley Office Park", location: "Palo Alto, CA", price: 12000000, minInvestment: 100000, roi: 11.2, funded: 45, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop", type: "Commercial" },
  { id: "re3", name: "Miami Beach Resort", location: "Miami, FL", price: 8500000, minInvestment: 75000, roi: 9.8, funded: 88, image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop", type: "Hospitality" },
  { id: "re4", name: "Austin Tech Campus", location: "Austin, TX", price: 15000000, minInvestment: 50000, roi: 12.5, funded: 34, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", type: "Commercial" },
  { id: "re5", name: "Chicago Waterfront Apt", location: "Chicago, IL", price: 3200000, minInvestment: 50000, roi: 7.3, funded: 91, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop", type: "Residential" },
  { id: "re6", name: "Denver Mountain Lodge", location: "Denver, CO", price: 5800000, minInvestment: 60000, roi: 10.1, funded: 56, image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop", type: "Hospitality" },
];

export const mockTransactions = [
  { id: 1, type: "buy", asset: "Bitcoin", amount: 0.15, value: 6420, date: "2026-03-27", status: "completed" },
  { id: 2, type: "sell", asset: "Apple Inc.", amount: 10, value: 1898, date: "2026-03-26", status: "completed" },
  { id: 3, type: "buy", asset: "EUR/USD", amount: 5000, value: 5446, date: "2026-03-26", status: "completed" },
  { id: 4, type: "deposit", asset: "USD", amount: 10000, value: 10000, date: "2026-03-25", status: "completed" },
  { id: 5, type: "buy", asset: "Manhattan Condo", amount: 1, value: 50000, date: "2026-03-24", status: "pending" },
  { id: 6, type: "sell", asset: "Ethereum", amount: 2.5, value: 8750, date: "2026-03-23", status: "completed" },
];

export const portfolioData = {
  totalBalance: 284750.32,
  totalProfit: 32450.18,
  profitPercent: 12.85,
  distribution: [
    { name: "Stocks", value: 95200, color: "hsl(217, 91%, 60%)" },
    { name: "Crypto", value: 68400, color: "hsl(270, 80%, 60%)" },
    { name: "Forex", value: 42300, color: "hsl(45, 93%, 58%)" },
    { name: "Real Estate", value: 52000, color: "hsl(160, 84%, 39%)" },
    { name: "Retirement", value: 26850, color: "hsl(340, 82%, 52%)" },
  ],
};

export const profitLossData = [
  { month: "Oct", value: 245000 },
  { month: "Nov", value: 252000 },
  { month: "Dec", value: 248000 },
  { month: "Jan", value: 261000 },
  { month: "Feb", value: 275000 },
  { month: "Mar", value: 284750 },
];

export const generateChartData = (days: number, basePrice: number, volatility: number) => {
  const data = [];
  let price = basePrice;
  const now = Date.now();
  for (let i = days; i >= 0; i--) {
    price += (Math.random() - 0.48) * volatility;
    price = Math.max(price * 0.95, price);
    data.push({
      date: new Date(now - i * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      price: parseFloat(price.toFixed(2)),
    });
  }
  return data;
};

export const retirementPlans = [
  { name: "Conservative", returnRate: 5, risk: "Low", description: "Bonds, blue-chip stocks, and stable assets" },
  { name: "Balanced", returnRate: 8, risk: "Medium", description: "Mix of growth stocks, bonds, and real estate" },
  { name: "Aggressive", returnRate: 12, risk: "High", description: "Growth stocks, crypto, and high-yield assets" },
];
