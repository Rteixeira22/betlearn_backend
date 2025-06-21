
// Types for Gemini API
export interface ChatbotRequest {
  pergunta: string;
}

export interface ChatbotResponse {
  pergunta: string;
  resposta: string;
}

// Gemini API Response Structure (for internal use)
export interface ChatbotApiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

// Generation Config (for internal use)
export interface GeminiGenerationConfig {
  temperature: number;
  topP: number;
  topK: number;
  maxOutputTokens: number;
}