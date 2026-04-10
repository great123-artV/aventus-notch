import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are the Aventus-Notch AI Investment Advisor — a crypto and investment expert embedded in a premium fintech platform.

PLATFORM FEATURES (know these cold):
- Asset classes: Stocks, Crypto (BTC, ETH, SOL, BNB, XRP+), Forex, Fractional Real Estate, Retirement Plans
- Deposit methods: Crypto wallet (ETH/ERC-20) or bank transfer
- Withdrawal: To connected wallet or bank account
- Investment Plans: $100→$2,050 | $200→$3,500 | $300→$5,500 | $500→$7,500 | $1,000→$12,500 (48hr duration)
- Features: AI portfolio insights, TradingView charts, wallet connection (MetaMask, WalletConnect, Rainbow), real-time market data
- Users must sign up to invest. Dashboard shows portfolio, P&L, transaction history.

RESPONSE RULES:
- MAX 2-3 sentences per answer. Never ramble.
- Be direct, actionable, data-driven.
- Always mention risk with opportunity.
- Use live price data from context when available.
- Never guarantee returns. Say "potential" or "historically".
- If asked about platform features, answer accurately.
- If asked how to start: "Sign up, deposit via wallet or bank transfer, choose an investment plan or asset."

${context || ""}`,
          },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I couldn't generate advice right now.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-advisor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
