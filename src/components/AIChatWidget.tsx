import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index));
      index++;
      if (index > text.length) clearInterval(interval);
    }, 45); // Professionally slow and steady
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
}

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Welcome to Aventus-Notch. I am your professional investment strategist. How may I assist you with your portfolio or market analysis today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Try to fetch real-time prices for major assets to provide context
      let priceContext = "";
      try {
        const [binanceRes, coingeckoRes] = await Promise.all([
          fetch('https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT","XRPUSDT","ADAUSDT","DOGEUSDT","MATICUSDT","DOTUSDT","TRXUSDT"]'),
          fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple,cardano,dogecoin,polkadot&vs_currencies=usd&include_24hr_change=true')
        ]);

        const binancePrices = await binanceRes.json();
        const cgPrices = await coingeckoRes.json();

        const symbolToId: Record<string, string> = {
          'BTC': 'bitcoin',
          'ETH': 'ethereum',
          'SOL': 'solana',
          'BNB': 'binancecoin',
          'XRP': 'ripple',
          'ADA': 'cardano',
          'DOGE': 'dogecoin',
          'MATIC': 'polygon',
          'DOT': 'polkadot',
          'TRX': 'tron'
        };

        priceContext = binancePrices.map((p: { symbol: string; price: string }) => {
          const symbol = p.symbol.replace('USDT', '');
          const coinId = symbolToId[symbol];
          const change = coinId ? cgPrices[coinId]?.usd_24h_change : undefined;
          return `${p.symbol}: $${parseFloat(p.price).toLocaleString()} (${change !== undefined ? (change >= 0 ? '+' : '') + change.toFixed(2) + '%' : 'N/A'})`;
        }).join(", ");

        // Add some forex context (simulated or real if available)
        priceContext += " | Forex - EUR/USD: 1.0892, GBP/USD: 1.2734, USD/JPY: 149.52";
      } catch (e) {
        console.error("Failed to fetch price context", e);
      }

      const { data, error } = await supabase.functions.invoke("ai-advisor", {
        body: {
          messages: newMessages,
          context: priceContext ? `Current real-time prices: ${priceContext}` : undefined
        },
      });

      if (error) throw error;
      
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || "I couldn't generate a response. Please try again." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button (Glowing Orb) */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-24 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
          >
            {/* Multi-layered Animated Orb */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-tr from-primary via-purple-500 to-accent opacity-80 blur-sm"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-2 bg-gradient-to-bl from-accent via-primary to-purple-600 rounded-full mix-blend-screen"
            />
            <div className="absolute inset-0 border border-white/20 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.5)]" />

            <Sparkles className="w-7 h-7 text-white relative z-10 animate-pulse" />

            {/* Animated particles around the orb */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [0, 1, 0],
                    x: [0, (i % 2 === 0 ? 20 : -20), 0],
                    y: [0, (i < 2 ? 20 : -20), 0],
                    opacity: [0, 0.5, 0]
                  }}
                  transition={{
                    duration: 2 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5
                  }}
                  className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full blur-[1px]"
                />
              ))}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[500px] glass-strong rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 gradient-primary">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white" />
                <span className="font-bold text-white">AI Investment Advisor</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "gradient-primary text-white rounded-br-sm"
                      : "bg-white/5 text-foreground rounded-bl-sm"
                  }`}>
                    {msg.role === "assistant" && i === messages.length - 1 ? (
                      <TypewriterText text={msg.content} />
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Ask about investments..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="gradient-primary border-0 rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
