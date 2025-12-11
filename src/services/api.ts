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
  meaningIndex: number;
}

export interface Meaning {
  partOfSpeech: string;
  meaning: string;
}

export interface WordInfo {
  original: string;
  meanings: Meaning[];
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

// 토익 모드 타입
export interface ToeicPart5Question {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: string;
}

export interface ToeicPart6Question {
  passage: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: string;
}

export interface ToeicPart7Question {
  passage: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: string;
}

export interface ToeicResponse {
  mode: 'toeic';
  questions: {
    part5: ToeicPart5Question[];
    part6: ToeicPart6Question[];
    part7: ToeicPart7Question[];
  };
}

// 영작 모드 타입
export interface WritingQuestion {
  type: 'situation' | 'translation' | 'fix' | 'short-answer';
  question: string;
  hint?: string;
  answer: string;
}

export interface WritingResponse {
  mode: 'writing';
  questions: WritingQuestion[];
}

export const apiService = {
  async generateExamples(word: string): Promise<ExampleResponse> {
    try {
      const response = await apiClient.post('/generate/examples', { word });
      return response.data;
    } catch (error: any) {
      // 400 에러이고 Invalid word 메시지가 있는 경우
      if (error.response?.status === 400 && error.response?.data?.error === 'Invalid word') {
        throw new Error(error.response.data.message || '유효한 영어 단어가 아닙니다.');
      }
      throw new Error(error.response?.data?.error || '서버 오류가 발생했습니다.');
    }
  },

  async generateWritingProblems(topic: string, mode: 'toeic' | 'writing'): Promise<ToeicResponse | WritingResponse> {
    try {
      const response = await apiClient.post('/generate/questions', { topic, mode });
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
