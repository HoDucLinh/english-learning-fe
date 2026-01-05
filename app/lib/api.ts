const API_BASE_URL = 'http://localhost:8080/api';

export const ENDPOINTS = {
  VOCABULARIES: `${API_BASE_URL}/vocabularies`,
  VOCABULARY: (id: string) => `${API_BASE_URL}/vocabularies/${id}`,
} as const;

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics?: Array<{ text?: string; audio?: string }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
}

export const searchDictionary = async (word: string): Promise<DictionaryEntry[]> => {
  const response = await fetch(`/api/dictionary/${word}`);
  if (!response.ok) {
    throw new Error('Word not found');
  }
  return response.json();
};

export default ENDPOINTS;