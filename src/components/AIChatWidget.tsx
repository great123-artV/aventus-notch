import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function TypewriterContent({ text, onStart, onComplete }: { text: string; onStart?: () => void; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    onStart?.();
    return () => {
      onComplete?.();
    };
  }, []);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, 25);
      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [index, text, onComplete]);

  return <span>{displayedText}</span>;
}

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Welcome to Aventus-Notch. I'm your AI investment advisor. Ask me about markets, portfolio strategies, or how to get started investing." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Standard typing sound
    typingAudio.current = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_7314781440.mp3");
    if (typingAudio.current) {
      typingAudio.current.volume = 0.2;
      typingAudio.current.loop = true;
    }
  }, []);

  const playTypingSound = () => {
    if (typingAudio.current) {
      typingAudio.current.play().catch(e => console.log("Audio play blocked", e));
    }
  };

  const stopTypingSound = () => {
    if (typingAudio.current) {
      typingAudio.current.pause();
      typingAudio.current.currentTime = 0;
    }
  };
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Voice-to-text setup
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Auto-send after voice input
      sendMessageWithText(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const sendMessageWithText = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      let siteContext = "You are the Aventus-Notch Professional AI Investment Strategist. ";
      siteContext += "The site offers Stocks, Crypto, Forex, Real Estate fractional ownership, and Retirement plans. ";
      siteContext += "Current treasury address: 0x35d4248095be1aaf0025f651cf86ed3ec7858023. ";
      siteContext += "Investment icons in footer: Home, Markets (Live data), Invest (Real Estate & Retirement), Portfolio (User dashboard), Profile (Settings). ";
      siteContext += "Be precise, specific, and professional. Do not over-explain. Answer in under 3 sentences unless asked for details. ";

      let priceContext = "";
      try {
        const binanceRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT","XRPUSDT"]');
        const binancePrices = await binanceRes.json();
        priceContext = binancePrices.map((p: any) => `${p.symbol}: $${parseFloat(p.price).toLocaleString()}`).join(", ");
      } catch {}

      const { data, error } = await supabase.functions.invoke("ai-advisor", {
        body: {
          messages: newMessages,
          context: siteContext + (priceContext ? "Live prices: " + priceContext : "")
        },
      });

      if (error) throw error;
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || "Please try again." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection issue. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = () => sendMessageWithText(input);

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-24 right-6 z-50 flex items-center gap-2 group"
          >
            <div className="absolute -top-8 right-0 bg-primary/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Aventus AI Bot</span>
            </div>
            <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden relative">
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
            className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 z-50 sm:w-[360px] h-[480px] glass-strong rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 gradient-primary">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f172a] animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">Aventus AI Advisor</span>
                    <span className="px-1.5 py-0.5 bg-white/20 rounded text-[8px] font-black text-white uppercase tracking-tighter">Live</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Always Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2 mt-1 flex-shrink-0 border border-primary/10">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "gradient-primary text-white rounded-br-sm font-medium"
                      : "bg-white/5 border border-white/10 text-foreground rounded-bl-sm"
                  }`}>
                    {msg.role === "assistant" && i === messages.length - 1 ? (
                      <TypewriterContent
                        text={msg.content}
                        onStart={() => {
                          setIsTyping(true);
                          playTypingSound();
                        }}
                        onComplete={() => {
                          setIsTyping(false);
                          stopTypingSound();
                        }}
                      />
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
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
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`p-2.5 rounded-xl border transition-colors flex-shrink-0 ${
                    isListening
                      ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse"
                      : "bg-white/5 border-white/10 text-muted-foreground hover:text-primary"
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder={isListening ? "Listening..." : "Ask about investments..."}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 placeholder:text-muted-foreground"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="gradient-primary border-0 rounded-xl flex-shrink-0"
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
