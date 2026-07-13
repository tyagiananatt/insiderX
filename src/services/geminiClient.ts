import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured. Please add it via Settings > Secrets in the AI Studio panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

/**
 * Helper to execute ai.models.generateContent with exponential backoff retry and model fallback.
 */
export async function generateContentWithRetry(
  ai: GoogleGenAI,
  params: {
    model: string;
    contents: any;
    config?: any;
  }
): Promise<any> {
  const modelsToTry = [
    params.model,
    "gemini-2.5-flash",
    "gemini-3.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest"
  ];
  
  // Filter unique values to preserve order of preference
  const uniqueModels = Array.from(new Set(modelsToTry.filter(Boolean)));
  
  let lastError: any = null;

  for (const currentModel of uniqueModels) {
    const maxRetries = 3;
    let delay = 1000; // start with 1s

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Gemini API] Attempting generateContent using model: ${currentModel} (Attempt ${attempt}/${maxRetries})`);
        const response = await ai.models.generateContent({
          ...params,
          model: currentModel
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errStr = err.message || JSON.stringify(err);
        console.warn(`[Gemini API] Model ${currentModel} failed on attempt ${attempt}. Error: ${errStr}`);
        
        // If it's a client/auth/quota error (e.g. 400, 401, 403, 404, or 429),
        // we shouldn't keep retrying this model (it means the model is either unsupported, key is invalid, schema is bad, or quota is exhausted)
        const statusCode = err.status || err.statusCode || (err.error && err.error.code);
        if (statusCode === 400 || statusCode === 401 || statusCode === 403 || statusCode === 404 || statusCode === 429) {
          console.error(`[Gemini API] Permanent error/Quota exceeded (${statusCode}) for ${currentModel}. Skipping further retries for this model.`);
          break; // break the attempt loop to try next model immediately
        }

        // For other errors (like 503, 429), sleep and retry
        if (attempt < maxRetries) {
          console.log(`[Gemini API] Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2.5; // Exponential backoff factor
        }
      }
    }
  }

  throw new Error(`All model options failed. Last error: ${lastError?.message || JSON.stringify(lastError)}`);
}
