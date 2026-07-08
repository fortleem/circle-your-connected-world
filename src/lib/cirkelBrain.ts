import { supabase } from "@/integrations/supabase/client";

export type BrainMsg = { role: "system" | "user" | "assistant"; content: string };
export type BrainResponse = { text: string; action?: any; model?: string; contextInjected?: boolean };

export async function askCirkelBrain(input: {
  messages: BrainMsg[];
  intent?: "chat" | "summarize" | "compose" | "translate" | "plan" | "web";
  model?: "auto" | "gemini" | "groq" | "openai" | "hf" | "openrouter";
  location?: { city?: string; country?: string; lat?: number; lon?: number };
  webQuery?: string;
}): Promise<BrainResponse> {
  const { data, error } = await supabase.functions.invoke("cirkel-brain", { body: input });
  if (error) throw error;
  return data as BrainResponse;
}
