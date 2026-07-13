/**
 * Groq fallback client — used when all Gemini models fail.
 * Calls the Groq REST API directly (no SDK needed).
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Only use currently active Groq models (mixtral is deprecated)
const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant",
];

export async function generateContentWithGroq(params: {
  systemInstruction: string;
  contents: string;
}): Promise<{ text: string }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  let lastError: any = null;

  for (const model of GROQ_MODELS) {
    try {
      console.log(`[Groq Fallback] Trying model: ${model}`);
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: params.systemInstruction },
            { role: "user", content: params.contents },
          ],
          temperature: 0.3,
          max_tokens: 4096,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error(`[Groq Fallback] HTTP ${response.status} from model ${model}: ${err}`);
        throw new Error(`Groq HTTP ${response.status}: ${err}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error("Empty response from Groq");

      console.log(`[Groq Fallback] Success with model: ${model}`);
      return { text };
    } catch (err: any) {
      lastError = err;
      console.warn(`[Groq Fallback] Model ${model} failed: ${err.message}`);
    }
  }

  throw new Error(`All Groq models failed. Last error: ${lastError?.message}`);
}
