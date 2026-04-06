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
            content: `You are a professional AI investment strategist for Aventus-Notch, a premium investment platform.
You are highly trained to help investors with clues, data-driven insights, and professional coaching on investment strategies.

Your Tone:
- Professionally calm and steady
- Sophisticated and knowledgeable
- Direct and helpful

Your Knowledge:
- Real-time market trends for Cryptocurrency, Stocks, Forex, and Real Estate.
- Portfolio diversification and risk management.
- Historical market performance and predictive modeling.

${context ? `Real-time Market Context: ${context}` : ""}

Guidelines:
- When asked for real-time prices, provide the data from the context and explain the current market sentiment.
- Analyze charts and give clues on potential entry/exit points (always with risk disclaimers).
- Help investors understand the "why" behind market moves.
- Always provide balanced, educational advice.
- Mention risk factors alongside potential gains.
- Never guarantee returns — always use phrases like "historically" or "based on analysis".
- If a user asks about investing a specific amount, calculate potential outcomes based on historical ROI.
- Be concise but thorough (2-4 paragraphs max).
- Recommend consulting a licensed financial advisor for major decisions.`,
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
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
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
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
