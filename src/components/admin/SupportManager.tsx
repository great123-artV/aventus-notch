import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, Send, Paperclip, CheckCircle2, User, Clock, Search, MoreVertical, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Chat {
  id: string;
  user_id: string | null;
  guest_id: string | null;
  status: 'open' | 'closed';
  last_message_at: string;
  created_at: string;
}

interface Message {
  id: string;
  chat_id: string;
  sender_id: string | null;
  sender_type: 'user' | 'admin' | 'guest';
  content: string;
  attachments: any[];
  is_read: boolean;
  created_at: string;
}

export function SupportManager() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const channelRef = useRef<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    fetchChats();
    const chatChannel = supabase
      .channel('support_chats_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_chats' }, () => {
        fetchChats();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages' }, (payload) => {
        const newMessage = payload.new as Message;
        if (newMessage.sender_type !== 'admin' && Notification.permission === 'granted' && document.hidden) {
          new Notification('New Support Message', {
            body: newMessage.content,
            icon: '/logo.webp'
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
      const msgChannel = supabase
        .channel(`support_admin_chat:${selectedChat.id}`, {
          config: { presence: { key: user?.id || 'admin' } }
        })
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
          filter: `chat_id=eq.${selectedChat.id}`
        }, (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);

          if (newMessage.sender_type !== 'admin' && Notification.permission === 'granted' && document.hidden) {
            new Notification('New Support Message', {
              body: newMessage.content,
              icon: '/logo.webp'
            });
          }
        })
        .on('presence', { event: 'sync' }, () => {
          const state = msgChannel.presenceState();
          const typing = Object.values(state).flat().some((p: any) => p.isTyping && p.sender_type !== 'admin');
          setIsTyping(typing);
        });

      msgChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channelRef.current = msgChannel;
        }
      });

      return () => {
        supabase.removeChannel(msgChannel);
        channelRef.current = null;
      };
    }
  }, [selectedChat, user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const fetchChats = async () => {
    const { data, error } = await supabase
      .from('support_chats')
      .select('*')
      .order('last_message_at', { ascending: false });
    if (data) setChats(data);
  };

  const fetchMessages = async (chatId: string) => {
    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    if (data) {
      setMessages(data);
      // Mark messages as read
      await supabase
        .from('support_messages')
        .update({ is_read: true })
        .eq('chat_id', chatId)
        .eq('sender_type', 'user');
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedChat) return;

    const { error } = await supabase
      .from('support_messages')
      .insert([{
        chat_id: selectedChat.id,
        sender_id: user?.id,
        sender_type: 'admin',
        content: input.trim()
      }]);

    if (!error) {
      setInput("");
      // Update last_message_at
      await supabase.from('support_chats').update({ last_message_at: new Date().toISOString() }).eq('id', selectedChat.id);
    } else {
      toast.error("Failed to send message");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedChat) return;

    setIsUploading(true);
    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${selectedChat.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('support_attachments')
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Failed to upload file");
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('support_attachments')
      .getPublicUrl(filePath);

    const attachment = {
      name: file.name,
      url: publicUrl,
      type: file.type
    };

    const { error: msgError } = await supabase
      .from('support_messages')
      .insert([
        {
          chat_id: selectedChat.id,
          sender_id: user?.id,
          sender_type: 'admin',
          content: `Sent an attachment: ${file.name}`,
          attachments: [attachment]
        }
      ]);

    if (msgError) toast.error("Failed to send attachment info");
    setIsUploading(false);
  };

  const handleTyping = (value: string) => {
    setInput(value);
    if (channelRef.current) {
      channelRef.current.track({
        isTyping: value.length > 0,
        user_id: user?.id,
        sender_type: 'admin'
      });
    }
  };

  const closeChat = async (chatId: string) => {
    const { error } = await supabase
      .from('support_chats')
      .update({ status: 'closed' })
      .eq('id', chatId);
    if (!error) {
      toast.success("Chat closed");
      if (selectedChat?.id === chatId) setSelectedChat(null);
      fetchChats();
    }
  };

  return (
    <div className="flex h-[700px] glass rounded-3xl overflow-hidden border border-white/10">
      {/* Sidebar: Chat List */}
      <div className="w-80 border-r border-white/10 flex flex-col bg-white/5">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-xl font-bold font-display flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Conversations
          </h2>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search chats..." className="pl-9 bg-black/20 border-white/10" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-4 flex items-center gap-3 border-b border-white/5 transition-colors hover:bg-white/5 ${
                selectedChat?.id === chat.id ? 'bg-primary/10' : ''
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-white/10">
                  {chat.user_id ? <User className="w-6 h-6 text-primary" /> : <Shield className="w-6 h-6 text-accent" />}
                </div>
                {chat.status === 'open' && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0f172a]" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-sm truncate">
                    {chat.user_id ? `Investor ${chat.user_id.slice(0, 5)}` : `Guest ${chat.guest_id?.slice(-5) || 'Anon'}`}
                  </span>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {new Date(chat.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {chat.status === 'open' ? 'Active conversation' : 'Closed'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main: Chat Window */}
      <div className="flex-1 flex flex-col bg-black/40">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                   <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">
                    {selectedChat.user_id ? `User ${selectedChat.user_id}` : `Guest ${selectedChat.guest_id}`}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => closeChat(selectedChat.id)} className="hover:text-red-400">
                  <CheckCircle2 className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] space-y-1`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm ${
                      msg.sender_type === 'admin'
                        ? 'bg-primary text-[#050505] font-bold rounded-tr-sm'
                        : 'bg-white/10 border border-white/10 text-white rounded-tl-sm'
                    }`}>
                      {msg.content}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {msg.attachments.map((att: any, idx: number) => (
                            <a key={idx} href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-black/10 rounded">
                              <Paperclip className="w-4 h-4" />
                              <span className="text-[10px] underline">{att.name}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className={`text-[10px] text-muted-foreground ${msg.sender_type === 'admin' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 px-4 py-2 rounded-2xl animate-pulse text-[10px] text-muted-foreground">
                    Investor is typing...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl border-white/10 bg-white/5"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Paperclip className={`w-5 h-5 ${isUploading ? 'animate-spin' : ''}`} />
                </Button>
                <Input
                  value={input}
                  onChange={e => handleTyping(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your reply..."
                  className="flex-1 bg-black/20 border-white/10 rounded-xl"
                />
                <Button onClick={sendMessage} className="gradient-primary text-[#050505] rounded-xl px-6 font-bold">
                  <Send className="w-5 h-5 mr-2" /> Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
               <MessageSquare className="w-10 h-10 opacity-20" />
            </div>
            <p className="font-display">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
