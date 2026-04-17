import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, User, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Chat {
  id: string;
  user_id: string;
  last_message_at: string;
}

interface Message {
  id: string;
  chat_id: string;
  content: string;
  is_admin_reply: boolean;
  created_at: string;
}

export function SupportManager() {
  const { user: adminUser } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChats();
    const channel = supabase
      .channel('admin-support')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'support_chats' }, fetchChats)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_chats' }, fetchChats)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
      const channel = supabase
        .channel(`chat-${selectedChat.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
          filter: `chat_id=eq.${selectedChat.id}`
        }, (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const fetchChats = async () => {
    const { data, error } = await supabase
      .from("support_chats")
      .select("*")
      .order("last_message_at", { ascending: false });

    if (!error && data) {
      setChats(data);
    }
  };

  const fetchMessages = async (chatId: string) => {
    const { data, error } = await supabase
      .from("support_messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedChat || !adminUser) return;
    setLoading(true);
    const { error } = await supabase
      .from("support_messages")
      .insert({
        chat_id: selectedChat.id,
        sender_id: adminUser.id,
        content: input.trim(),
        is_admin_reply: true
      });

    if (error) {
      toast.error("Failed to send message");
    } else {
      setInput("");
      await supabase.from("support_chats").update({ last_message_at: new Date().toISOString() }).eq("id", selectedChat.id);
    }
    setLoading(false);
  };

  const filteredChats = chats.filter(c => c.user_id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="glass rounded-2xl border-white/10 h-[700px] flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search user ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 h-10"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/5 ${
                selectedChat?.id === chat.id ? "bg-white/10" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left overflow-hidden">
                <p className="font-bold text-sm truncate">{chat.user_id.slice(0, 15)}...</p>
                <p className="text-[10px] text-muted-foreground">
                  Last seen: {new Date(chat.last_message_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </button>
          ))}
          {filteredChats.length === 0 && (
            <div className="p-10 text-center text-muted-foreground text-sm">
              No chats found
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white/[0.02]">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{selectedChat.user_id}</h3>
                  <p className="text-[10px] text-profit font-bold uppercase tracking-widest">Connected</p>
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.is_admin_reply ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                    msg.is_admin_reply
                      ? "gradient-primary text-[#050505] rounded-tr-none font-medium"
                      : "bg-white/10 text-foreground rounded-tl-none border border-white/5"
                  }`}>
                    {msg.content}
                    <div className={`text-[9px] mt-1 opacity-60 ${msg.is_admin_reply ? "text-[#050505]" : "text-muted-foreground"}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Type your reply..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50"
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="gradient-primary border-0 text-[#050505] px-6"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <MessageSquare className="w-10 h-10 opacity-20" />
            </div>
            <p className="font-bold">Select a conversation to start messaging</p>
            <p className="text-sm">Real-time support for your investors</p>
          </div>
        )}
      </div>
    </div>
  );
}
