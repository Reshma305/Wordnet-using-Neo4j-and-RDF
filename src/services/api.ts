const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export interface LiteraryOccurrence {
  passage_id: string;
  book: string;
  number: number | null;
  title: string | null;
  section: string | null;
  poet: string | null;
  sung_for: string | null;
  thinai: string | null;
  thurai: string | null;
  text: string;
}

export interface LiterarySearchResponse {
  query: string;
  count: number;
  results: LiteraryOccurrence[];
}

export async function searchLiteraryOccurrences(
  word: string,
  topK: number = 20
): Promise<LiterarySearchResponse> {
  const query = encodeURIComponent(word.trim());

  const response = await fetch(
    `${API_BASE_URL}/literary-search?q=${query}&top_k=${topK}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Literary search endpoint was not found.");
    }

    if (response.status >= 500) {
      throw new Error("Literary search server is unavailable.");
    }

    throw new Error("Unable to search literary occurrences.");
  }

  return response.json();
}