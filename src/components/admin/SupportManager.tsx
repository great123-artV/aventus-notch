import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, Send, Paperclip, CheckCircle2, User, RotateCw, Search, MoreVertical, Shield } from "lucide-react";
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
  return (
    <div className="flex flex-col items-center justify-center h-[600px] glass rounded-3xl border border-white/10 p-12 text-center space-y-6">
      <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
        <MessageSquare className="w-12 h-12 text-primary" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-display text-white">Professional Support Active</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          The support system has been upgraded to <b>Tawk.to</b> for a more reliable and professional experience.
        </p>
      </div>

      <div className="grid gap-4 w-full max-w-sm">
        <Button
          onClick={() => window.open('https://dashboard.tawk.to/', '_blank')}
          className="w-full h-14 gradient-primary text-[#050505] font-bold rounded-xl text-lg flex items-center justify-center gap-2"
        >
          <Shield className="w-5 h-5" /> Open Tawk.to Dashboard
        </Button>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          Reply to investors from the official Tawk.to portal
        </p>
      </div>

      <div className="pt-8 border-t border-white/10 w-full max-w-md">
        <div className="flex items-start gap-4 text-left p-4 bg-white/5 rounded-2xl border border-white/5">
          <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Configuration Tip</h4>
            <p className="text-xs text-muted-foreground">
              You can change your Website ID anytime in the <b>CMS Tab</b> under "Support System".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
