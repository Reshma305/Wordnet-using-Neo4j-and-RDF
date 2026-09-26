export interface TamilMorphology {
  word?: string;
  lemma?: string;
  pos?: string;
}

export interface TamilContext {
  text?: string;
  source?: string;
  category?: string;
  word?: string;
  similarity?: number | null;
}

export interface TamilAnalysisResponse {
  query?: string;
  morphology?: TamilMorphology[];
  contexts?: TamilContext[];
  categories?: string[];
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

export async function analyzeWord(word: string, top_k = 5): Promise<TamilAnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: word,
      top_k,
    }),
  });

  if (!response.ok) {
    let message = "Unable to connect to the Tamil NLP backend. Please make sure the FastAPI server is running.";

    try {
      const errorBody = await response.json();
      if (errorBody?.detail) {
        message = Array.isArray(errorBody.detail)
          ? errorBody.detail.map((detail: { msg?: string }) => detail.msg ?? "Request failed").join("; ")
          : String(errorBody.detail);
      }
    } catch {
      // Ignore JSON parsing errors and keep the default message.
    }

    throw new Error(message);
  }

  return (await response.json()) as TamilAnalysisResponse;
}
