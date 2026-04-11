import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.101.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { user_id, page_path, user_agent } = await req.json();

    // Get visitor IP from request headers
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
      || req.headers.get("cf-connecting-ip") 
      || req.headers.get("x-real-ip") 
      || "unknown";

    // Geolocate IP using free API
    let country = null;
    let city = null;
    try {
      if (ip && ip !== "unknown" && ip !== "127.0.0.1") {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`);
        if (geoRes.ok) {
          const geo = await geoRes.json();
          country = geo.country || null;
          city = geo.city || null;
        }
      }
    } catch {}

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from("visitor_logs").insert({
      user_id: user_id || null,
      page_path,
      user_agent,
      ip_address: ip,
      country,
      city,
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("log-visit error:", e);
    return new Response(JSON.stringify({ error: "Failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
