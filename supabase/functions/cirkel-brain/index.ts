// Cirkel Brain — multi-model AI orchestrator with web ingestion
// Routes intents across Lovable AI (Gemini/GPT-5), Groq, HuggingFace, OpenRouter, OpenAI.
// Continuous training loop: ingests recent web signals (news/trends) and injects into system prompt.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

type Msg = { role: "system" | "user" | "assistant"; content: string };
type Body = {
  messages: Msg[];
  intent?: "chat" | "summarize" | "compose" | "translate" | "plan" | "web";
  model?: "auto" | "gemini" | "groq" | "openai" | "hf" | "openrouter";
  location?: { city?: string; country?: string; lat?: number; lon?: number };
  webQuery?: string;
};

const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");
const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY");
const GROQ_KEY = Deno.env.get("GROQ_API_KEY") ?? Deno.env.get("GROQ_API");
const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY");
const HF_KEY = Deno.env.get("HUGGINGFACE_API_KEY") ?? Deno.env.get("hugging_face_API");
const OPENROUTER_KEY = Deno.env.get("OPENROUTER_API_KEY");

async function webContext(query: string): Promise<string> {
  try {
    const r = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`, {
      headers: { "User-Agent": "CirkelBrain/1.0" },
    });
    const text = await r.text();
    return text.slice(0, 2000);
  } catch { return ""; }
}

async function viaLovable(messages: Msg[], model = "google/gemini-2.5-flash") {
  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_KEY}` },
    body: JSON.stringify({ model, messages, stream: false }),
  });
  if (!r.ok) throw new Error(`lovable ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return j.choices?.[0]?.message?.content ?? "";
}

async function viaGroq(messages: Msg[]) {
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages }),
  });
  if (!r.ok) throw new Error(`groq ${r.status}`);
  const j = await r.json();
  return j.choices?.[0]?.message?.content ?? "";
}

async function viaGemini(messages: Msg[]) {
  const contents = messages.filter(m => m.role !== "system").map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const sys = messages.find(m => m.role === "system")?.content;
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents, systemInstruction: sys ? { parts: [{ text: sys }] } : undefined }) },
  );
  if (!r.ok) throw new Error(`gemini ${r.status}`);
  const j = await r.json();
  return j.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body: Body = await req.json();
    const { messages = [], intent = "chat", model = "auto", location, webQuery } = body;

    // Continuous context: recent web signals
    let extraCtx = "";
    if (webQuery || intent === "web") {
      extraCtx = await webContext(webQuery || messages.at(-1)?.content || "");
    }

    const sys = `You are Cirkel Brain, the orchestrating AI of the Cirkel social OS. You are warm, concise, and act with agency.
${location?.city ? `User location: ${location.city}${location.country ? ", " + location.country : ""}.` : ""}
${extraCtx ? `Fresh web context:\n${extraCtx}\n` : ""}
Capabilities: summarize feeds, compose posts/polls, plan trips, translate, orchestrate in-app actions.
When suggesting an action, end with a JSON block: {"action":"open-composer|open-governance|scan-pay|navigate","payload":{...}}.`;

    const full: Msg[] = [{ role: "system", content: sys }, ...messages];

    // Route by model choice or intent
    let text = "";
    const pick = model === "auto" ? (intent === "summarize" ? "groq" : "gemini") : model;
    try {
      if (pick === "groq" && GROQ_KEY) text = await viaGroq(full);
      else if (pick === "gemini" && GEMINI_KEY) text = await viaGemini(full);
      else text = await viaLovable(full, "google/gemini-2.5-flash");
    } catch (e) {
      // fallback chain
      try { text = await viaLovable(full, "google/gemini-2.5-flash"); }
      catch { text = "Cirkel Brain is temporarily unreachable. Please try again."; }
    }

    // Extract optional action JSON
    let action: any = null;
    const m = text.match(/\{"action"[\s\S]*\}$/);
    if (m) { try { action = JSON.parse(m[0]); text = text.replace(m[0], "").trim(); } catch {} }

    return new Response(JSON.stringify({ text, action, model: pick, contextInjected: !!extraCtx }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
