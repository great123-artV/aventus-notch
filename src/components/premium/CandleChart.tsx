import React, { useEffect, useState, useRef } from 'react';

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export function CandleChart() {
  const [candles, setCandles] = useState<Candle[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize with some mock candles for immediate visual feedback
    const initialCandles: Candle[] = Array.from({ length: 30 }, (_, i) => {
      const base = 64000 + Math.random() * 1000;
      return {
        time: Date.now() - (30 - i) * 60000,
        open: base,
        high: base + 200,
        low: base - 200,
        close: base + (Math.random() - 0.5) * 400
      };
    });
    setCandles(initialCandles);

    // Connect to Binance WebSocket for real-time BTCUSDT klines
    ws.current = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const k = data.k;
      const newCandle: Candle = {
        time: k.t,
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c)
      };

      setCandles(prev => {
        const lastCandle = prev[prev.length - 1];
        if (lastCandle && lastCandle.time === newCandle.time) {
          // Update the last candle
          return [...prev.slice(0, -1), newCandle];
        } else {
          // Add a new candle and keep the last 30
          return [...prev.slice(1), newCandle];
        }
      });
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const maxPrice = Math.max(...candles.map(c => c.high));
  const minPrice = Math.min(...candles.map(c => c.low));
  const range = (maxPrice - minPrice) || 1;

  const getY = (price: number) => {
    return 100 - ((price - minPrice) / range) * 100;
  };

  return (
    <div className="w-full h-full relative flex items-end gap-[2px] pt-4 pb-2">
      {candles.map((candle, i) => {
        const isUp = candle.close >= candle.open;
        const bodyTop = getY(Math.max(candle.open, candle.close));
        const bodyBottom = getY(Math.min(candle.open, candle.close));
        const bodyHeight = Math.max(Math.abs(bodyTop - bodyBottom), 1);
        const wickTop = getY(candle.high);
        const wickBottom = getY(candle.low);
        const wickHeight = Math.abs(wickTop - wickBottom);

        return (
          <div key={i} className="flex-1 relative h-full group">
            {/* Wick */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-[1px] ${isUp ? 'bg-profit' : 'bg-loss'} opacity-50`}
              style={{ top: `${wickTop}%`, height: `${wickHeight}%` }}
            />
            {/* Body */}
            <div
              className={`absolute left-0 right-0 rounded-[1px] ${isUp ? 'bg-profit shadow-[0_0_8px_rgba(var(--profit),0.4)]' : 'bg-loss shadow-[0_0_8px_rgba(var(--loss),0.4)]'} transition-all duration-300 animate-pulse-slow`}
              style={{ top: `${bodyTop}%`, height: `${bodyHeight}%` }}
            />
          </div>
        );
      })}

      {/* Real-time price line */}
      {candles.length > 0 && (
        <div
          className="absolute right-0 left-0 border-t border-dashed border-white/20 z-10 pointer-events-none transition-all duration-300"
          style={{ top: `${getY(candles[candles.length - 1].close)}%` }}
        >
          <div className="absolute right-0 -top-2 bg-primary px-1 rounded text-[8px] font-bold text-white">
            {candles[candles.length - 1].close.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
