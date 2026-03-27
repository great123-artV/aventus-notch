import { useQuery } from "@tanstack/react-query";

interface CryptoPrice {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  volume: string;
  category: "crypto";
  image: string;
}

const fetchCryptoPrices = async (): Promise<CryptoPrice[]> => {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h"
  );
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.map((coin: any) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    price: coin.current_price,
    change: coin.price_change_24h,
    changePercent: coin.price_change_percentage_24h,
    marketCap: coin.market_cap > 1e12 ? `${(coin.market_cap / 1e12).toFixed(2)}T` : `${(coin.market_cap / 1e9).toFixed(1)}B`,
    volume: coin.total_volume > 1e9 ? `${(coin.total_volume / 1e9).toFixed(1)}B` : `${(coin.total_volume / 1e6).toFixed(0)}M`,
    category: "crypto" as const,
    image: coin.image,
  }));
};

const fallbackCrypto: CryptoPrice[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 42800, change: 1250, changePercent: 3.01, marketCap: "838B", volume: "28.5B", category: "crypto", image: "" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3500, change: -45, changePercent: -1.27, marketCap: "420B", volume: "15.2B", category: "crypto", image: "" },
  { id: "binancecoin", name: "BNB", symbol: "BNB", price: 315.20, change: 8.45, changePercent: 2.75, marketCap: "48.5B", volume: "1.8B", category: "crypto", image: "" },
  { id: "solana", name: "Solana", symbol: "SOL", price: 98.45, change: -2.12, changePercent: -2.11, marketCap: "42.3B", volume: "3.2B", category: "crypto", image: "" },
  { id: "ripple", name: "XRP", symbol: "XRP", price: 0.6234, change: 0.0145, changePercent: 2.38, marketCap: "34.1B", volume: "1.5B", category: "crypto", image: "" },
  { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.5812, change: -0.0234, changePercent: -3.87, marketCap: "20.4B", volume: "620M", category: "crypto", image: "" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.0892, change: 0.0045, changePercent: 5.31, marketCap: "12.7B", volume: "890M", category: "crypto", image: "" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT", price: 7.23, change: 0.34, changePercent: 4.94, marketCap: "9.8B", volume: "340M", category: "crypto", image: "" },
];

export function useCryptoPrices() {
  return useQuery({
    queryKey: ["crypto-prices"],
    queryFn: fetchCryptoPrices,
    refetchInterval: 60000,
    staleTime: 30000,
    placeholderData: fallbackCrypto,
    retry: 2,
  });
}
