import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  is_admin_reply: boolean;
  created_at: string;
}

export function SupportWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && user) {
      ensureChatExists();
    }
  }, [open, user]);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
      const channel = supabase
        .channel('support-messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'support_messages',
            filter: `chat_id=eq.${chatId}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [chatId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const ensureChatExists = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("support_chats")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching chat", error);
      return;
    }

    if (data) {
      setChatId(data.id);
    } else {
      const { data: newChat, error: createError } = await supabase
        .from("support_chats")
        .insert({ user_id: user.id })
        .select()
        .single();

      if (createError) {
        console.error("Error creating chat", createError);
      } else {
        setChatId(newChat.id);
      }
    }
  };

  const fetchMessages = async () => {
    if (!chatId) return;
    const { data, error } = await supabase
      .from("support_messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages", error);
    } else {
      setMessages(data || []);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !chatId || !user) return;
    setLoading(true);
    const { error } = await supabase
      .from("support_messages")
      .insert({
        chat_id: chatId,
        sender_id: user.id,
        content: input.trim(),
        is_admin_reply: false
      });

    if (error) {
      toast.error("Failed to send message");
    } else {
      setInput("");
      await supabase.from("support_chats").update({ last_message_at: new Date().toISOString() }).eq("id", chatId);
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full gradient-primary shadow-glow flex items-center justify-center text-[#050505] hover:scale-110 transition-transform"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-6 z-50 w-[350px] h-[500px] glass-strong rounded-2xl border border-white/10 flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="p-4 gradient-primary flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#050505]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#050505] text-sm">Live Support</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-green-700 font-bold uppercase tracking-widest">Active</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#050505]/70 hover:text-[#050505]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-sm text-muted-foreground">Welcome! How can we help you today?</p>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.is_admin_reply ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.is_admin_reply
                      ? "bg-white/10 text-foreground rounded-tl-none border border-white/5"
                      : "gradient-primary text-[#050505] rounded-tr-none font-medium"
                  }`}>
                    {msg.content}
                    <div className={`text-[9px] mt-1 opacity-60 ${msg.is_admin_reply ? "text-muted-foreground" : "text-[#050505]"}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50"
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  size="icon"
                  className="gradient-primary border-0 text-[#050505]"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
