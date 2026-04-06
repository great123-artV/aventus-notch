import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useVisitorLog() {
  const location = useLocation();

  useEffect(() => {
    const logVisit = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await supabase.from("visitor_logs").insert({
        user_id: session?.user?.id ?? null,
        page_path: location.pathname,
        user_agent: navigator.userAgent,
      });
    };
    logVisit();
  }, [location.pathname]);
}
