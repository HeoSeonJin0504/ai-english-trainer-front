import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Word {
  id: string;
  word: string;
  examples: string[];
  createdAt: string;
}

export interface Example {
  english: string;
  korean: string;
}

export interface WordInfo {
  original: string;
  partOfSpeech: string;
  meaning: string;
}

export interface RelatedWord {
  word: string;
  partOfSpeech: string;
  meaning: string;
}

export interface RelatedWords {
  synonym: RelatedWord;
  antonym: RelatedWord | null;
}

export interface ExampleResponse {
  word: WordInfo;
  examples: Example[];
  relatedWords: RelatedWords;
}

export interface Question {
  question: string;
  translation: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: string;
}

export const apiService = {
  async generateExamples(word: string): Promise<ExampleResponse> {
    try {
      const response = await apiClient.post('/generate/examples', { word });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || '서버 오류가 발생했습니다.');
    }
  },

  async generateWritingProblems(topic: string) {
    try {
      const response = await apiClient.post('/generate/questions', { topic });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || '서버 오류가 발생했습니다.');
    }
  },

  async getWords() {
    try {
      const response = await apiClient.get('/words');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || '서버 오류가 발생했습니다.');
    }
  },

  async addWord(word: string, examples: string[]) {
    try {
      const response = await apiClient.post('/words', { word, examples });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || '서버 오류가 발생했습니다.');
    }
  },

  async deleteWord(id: string) {
    try {
      const response = await apiClient.delete(`/words/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || '서버 오류가 발생했습니다.');
    }
  },
};
