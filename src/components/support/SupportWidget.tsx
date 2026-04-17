import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Paperclip, Image as ImageIcon, FileText, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const channelRef = useRef<any>(null);

  // Guest ID management & user chat lookup
  useEffect(() => {
    const initializeChat = async () => {
      if (user) {
        // Look for existing open chat for this user
        const { data, error } = await supabase
          .from('support_chats')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'open')
          .order('last_message_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          setChatId(data.id);
          fetchMessages(data.id);
          return;
        }
      }

      const storedChatId = localStorage.getItem('aventus_support_chat_id');
      if (storedChatId) {
        setChatId(storedChatId);
        fetchMessages(storedChatId);
      }
    };

    initializeChat();
  }, [user]);

  useEffect(() => {
    if (chatId) {
      const channel = supabase
        .channel(`support_chat:${chatId}`, {
          config: {
            presence: {
              key: user?.id || 'guest',
            },
          },
        })
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'support_messages',
            filter: `chat_id=eq.${chatId}`
          },
          (payload) => {
            const newMessage = payload.new as Message;
            setMessages(prev => {
              if (prev.some(m => m.id === newMessage.id)) return prev;
              return [...prev, newMessage];
            });
          }
        )
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const typing = Object.values(state).flat().some((p: any) => p.isTyping && p.sender_type === 'admin');
          setIsTyping(typing);
        });

      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channelRef.current = channel;
        }
      });

      return () => {
        supabase.removeChannel(channel);
        channelRef.current = null;
      };
    }
  }, [chatId, user]);

  const handleTyping = (value: string) => {
    setInput(value);
    if (channelRef.current) {
      channelRef.current.track({
        isTyping: value.length > 0,
        user_id: user?.id || 'guest',
        sender_type: user ? 'user' : 'guest'
      });
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const fetchMessages = async (id: string) => {
    const { data, error } = await supabase
      .from('support_messages')
      .select('*')
      .eq('chat_id', id)
      .order('created_at', { ascending: true });

    if (data) setMessages(data);
  };

  const startChat = async () => {
    const guestId = !user ? `guest_${Math.random().toString(36).slice(2, 11)}` : null;
    const { data, error } = await supabase
      .from('support_chats')
      .insert([
        {
          user_id: user?.id || null,
          guest_id: guestId,
          status: 'open'
        }
      ])
      .select()
      .single();

    if (error) {
      toast.error("Could not start chat. Please try again.");
      return null;
    }

    localStorage.setItem('aventus_support_chat_id', data.id);
    setChatId(data.id);
    return data.id;
  };

  const sendMessage = async () => {
    if (!input.trim() && !isLoading) return;

    let currentChatId = chatId;
    if (!currentChatId) {
      currentChatId = await startChat();
    }

    if (!currentChatId) return;

    const { error } = await supabase
      .from('support_messages')
      .insert([
        {
          chat_id: currentChatId,
          sender_id: user?.id || null,
          sender_type: user ? 'user' : 'guest',
          content: input.trim(),
          attachments: []
        }
      ]);

    if (error) {
      toast.error("Failed to send message");
    } else {
      setInput("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let currentChatId = chatId;
    if (!currentChatId) {
      currentChatId = await startChat();
    }
    if (!currentChatId) return;

    setIsLoading(true);
    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${currentChatId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('support_attachments')
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Failed to upload file");
      setIsLoading(false);
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
          chat_id: currentChatId,
          sender_id: user?.id || null,
          sender_type: user ? 'user' : 'guest',
          content: `Sent an attachment: ${file.name}`,
          attachments: [attachment]
        }
      ]);

    if (msgError) toast.error("Failed to send attachment info");
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <MessageCircle className="w-8 h-8 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[550px] bg-[#E5DDD5] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* WhatsApp Header */}
            <div className="bg-[#075E54] p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Aventus Support</h3>
                  <p className="text-[10px] text-white/80">Online</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"
            >
              {messages.length === 0 && (
                <div className="flex justify-center mt-10">
                  <div className="bg-[#DCF8C6] px-4 py-2 rounded-lg text-xs text-gray-600 shadow-sm text-center">
                    👋 Welcome! How can we help you today?
                  </div>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_type === 'admin' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-lg shadow-sm text-sm relative ${
                    msg.sender_type === 'admin'
                      ? 'bg-white text-gray-800 rounded-tl-none'
                      : 'bg-[#DCF8C6] text-gray-800 rounded-tr-none'
                  }`}>
                    {msg.content}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.attachments.map((att: any, idx: number) => (
                          <a key={idx} href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-black/5 rounded hover:bg-black/10 transition-colors">
                            {att.type.startsWith('image/') ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                            <span className="text-[10px] truncate max-w-[150px]">{att.name}</span>
                          </a>
                        ))}
                      </div>
                    )}
                    <p className="text-[9px] text-gray-400 text-right mt-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            {isTyping && (
              <div className="px-4 py-1 text-[10px] text-gray-500 italic animate-pulse">
                Support is typing...
              </div>
            )}
            <div className="p-3 bg-[#F0F0F0] flex items-center gap-2">
              <button className="text-gray-500 hover:text-gray-700">
                <Smile className="w-6 h-6" />
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="text-gray-500 hover:text-gray-700">
                <Paperclip className="w-6 h-6" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx"
              />
              <input
                value={input}
                onChange={e => handleTyping(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message"
                className="flex-1 bg-white rounded-full px-4 py-2 text-sm focus:outline-none border-none shadow-sm"
              />
              <button
                onClick={sendMessage}
                disabled={(!input.trim() && !isLoading)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  input.trim() ? 'bg-[#075E54] text-white' : 'bg-gray-300 text-gray-500'
                }`}
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
