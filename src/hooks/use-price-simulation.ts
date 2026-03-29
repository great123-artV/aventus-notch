import { useState, useEffect, useRef, useCallback } from "react";

interface PriceTick {
  id: string;
  price: number;
  previousPrice: number;
  direction: "up" | "down" | "neutral";
  timestamp: number;
}

export function usePriceSimulation(
  assets: { id: string; price: number }[],
  intervalMs = 2000
) {
  const [ticks, setTicks] = useState<Record<string, PriceTick>>({});
  const pricesRef = useRef<Record<string, number>>({});

  // Initialize prices
  useEffect(() => {
    const initial: Record<string, number> = {};
    assets.forEach((a) => {
      if (!pricesRef.current[a.id]) {
        initial[a.id] = a.price;
      }
    });
    pricesRef.current = { ...pricesRef.current, ...initial };
  }, [assets]);

  useEffect(() => {
    if (assets.length === 0) return;

    const interval = setInterval(() => {
      // Pick 2-4 random assets to update
      const count = Math.min(assets.length, 2 + Math.floor(Math.random() * 3));
      const shuffled = [...assets].sort(() => Math.random() - 0.5).slice(0, count);

      const newTicks: Record<string, PriceTick> = {};
      shuffled.forEach((asset) => {
        const currentPrice = pricesRef.current[asset.id] || asset.price;
        const volatility = currentPrice * 0.002; // 0.2% max move
        const change = (Math.random() - 0.48) * volatility;
        const newPrice = Math.max(0.0001, currentPrice + change);

        pricesRef.current[asset.id] = newPrice;
        newTicks[asset.id] = {
          id: asset.id,
          price: newPrice,
          previousPrice: currentPrice,
          direction: newPrice > currentPrice ? "up" : newPrice < currentPrice ? "down" : "neutral",
          timestamp: Date.now(),
        };
      });

      setTicks((prev) => ({ ...prev, ...newTicks }));
    }, intervalMs);

    return () => clearInterval(interval);
  }, [assets.length, intervalMs]);

  const getTickPrice = useCallback(
    (id: string, fallbackPrice: number) => {
      const tick = ticks[id];
      return tick ? tick.price : fallbackPrice;
    },
    [ticks]
  );

  const getTickDirection = useCallback(
    (id: string): "up" | "down" | "neutral" => {
      const tick = ticks[id];
      if (!tick || Date.now() - tick.timestamp > 3000) return "neutral";
      return tick.direction;
    },
    [ticks]
  );

  return { ticks, getTickPrice, getTickDirection };
}
