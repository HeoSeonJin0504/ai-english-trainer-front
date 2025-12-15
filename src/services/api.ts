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
  partOfSpeech: string[]; // ✅ 추가
  examples: Example[]; // ✅ 타입 변경
  createdAt: string;
  updatedAt?: string; // ✅ 추가
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
  explanation: string;
}

export interface ToeicPart6Question {
  passage: string;
  insertSentence: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: string;
  explanation: string;
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
  explanation: string;
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

// TTS 관련 타입
export interface TTSRequest {
  text: string;
  speed?: number;
  voice?: 'male' | 'female';
}

export interface TTSResponse {
  success: boolean;
  audio?: string;
  contentType?: string;
  textLength?: number;
  error?: string;
  fallback?: boolean;
}

export interface TTSStatusResponse {
  success: boolean;
  available: boolean;
  message: string;
}

// ✅ apiService 하나로 통합
export const apiService = {
  // 예문 생성
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

  // 문제 생성
  async generateWritingProblems(topic: string, mode: 'toeic' | 'writing'): Promise<ToeicResponse | WritingResponse> {
    try {
      const response = await apiClient.post('/generate/questions', { topic, mode });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || '서버 오류가 발생했습니다.');
    }
  },

  // 단어 목록 조회
  async getWords() {
    try {
      const response = await apiClient.get('/words');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || '서버 오류가 발생했습니다.');
    }
  },

  // 단어 추가 - 파라미터 수정
  async addWord(word: string, partOfSpeech: string[], examples: Example[]) {
    try {
      const response = await apiClient.post('/words', { 
        word, 
        partOfSpeech,
        examples 
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || '서버 오류가 발생했습니다.');
    }
  },

  // 단어 삭제
  async deleteWord(id: string) {
    try {
      const response = await apiClient.delete(`/words/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || '서버 오류가 발생했습니다.');
    }
  },

  // ✅ TTS 음성 생성
  async generateTTS(text: string, speed: number = 1.0, voice: 'male' | 'female' = 'female'): Promise<TTSResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/tts/speak`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, speed, voice }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'TTS 생성 실패');
      }

      return await response.json();
    } catch (error: any) {
      console.error('TTS API 에러:', error);
      throw error;
    }
  },

  // ✅ TTS 서비스 상태 확인
  async checkTTSStatus(): Promise<TTSStatusResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/tts/status`);
      
      if (!response.ok) {
        throw new Error('TTS 상태 확인 실패');
      }

      return await response.json();
    } catch (error: any) {
      console.error('TTS 상태 확인 에러:', error);
      return {
        success: false,
        available: false,
        message: 'TTS 서비스를 사용할 수 없습니다.'
      };
    }
  }
};