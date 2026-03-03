import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ httpOnly Cookie 전송을 위해 필수
});

// ✅ httpOnly Cookie 방식으로 변경되어 토큰 헤더 추가 불필요
// 요청 인터셉터 (필요시 추가 설정용)
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (401/403 에러 시 로그아웃 처리)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    
    // 401 Unauthorized 또는 403 Forbidden
    if (status === 401 || status === 403) {
      const isAuthPath = error.config?.url?.startsWith('/auth/');
      
      // auth 경로가 아닌 경우에만 로그아웃 처리
      if (!isAuthPath) {
        console.warn('인증 오류: 로그인이 필요합니다.');
        localStorage.removeItem('user');
        
        // 현재 페이지가 로그인/회원가입이 아닌 경우에만 리다이렉트
        if (!window.location.pathname.startsWith('/login') && 
            !window.location.pathname.startsWith('/signup')) {
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// 회원 관련 타입
export interface SignupRequest {
  username: string;
  password: string;
  phone: string;
  email?: string;
  gender: 'MALE' | 'FEMALE';
  age: number;
}

export interface User {
  id: number;
  username: string;
  phone: string;
  email?: string;
  gender?: string;
  age?: number;
  createdAt?: string;
}

export interface LoginResponse {
  user: User; // ✅ 토큰은 httpOnly Cookie로 전달되므로 응답 바디에서 제거됨
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ValidationError {
  [field: string]: string;
}

export interface ValidationErrorResponse {
  success: false;
  message: string;
  data: ValidationError;
}

// 단어장 관련 타입 (정규화)
export interface WordDto {
  id: number;
  word: string;
  partOfSpeech: string;
  meaning: string;
  createdAt: string;
}

export interface ExampleDto {
  id: number;
  english: string;
  korean: string;
  word: WordDto | null;
  createdAt: string;
}

export interface SaveWordRequest {
  word: string;
  partOfSpeech: string;
  meaning: string;
}

export interface SaveExampleRequest {
  english: string;
  korean: string;
  wordId?: number;
}

// 예문 생성 응답용 타입
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
  isValid: boolean;
  word: WordInfo;
  examples: Example[];
  relatedWords: RelatedWords;
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

// 문제 생성 응답 타입
export interface QuestionGenerationResponse {
  mode: 'toeic' | 'writing';
  questions: {
    part5: ToeicPart5Question[];
    part6: ToeicPart6Question[];
    part7: ToeicPart7Question[];
  } | null;
  writingQuestions: WritingQuestion[] | null;
}

// 문제 저장 관련 타입
export type QuestionMode = 'TOEIC' | 'WRITING';
export type ToeicPart = 'PART5' | 'PART6' | 'PART7';
export type WritingType = 'situation' | 'translation' | 'fix' | 'short-answer';

export interface SaveQuestionRequest {
  mode: QuestionMode;
  toeicPart?: ToeicPart;
  writingType?: WritingType;
  topic: string;
  passage?: string;
  insertSentence?: string;
  question: string;
  options?: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: string;
  hint?: string;
  explanation?: string;
}

export interface SavedQuestionDto {
  id: number;
  mode: QuestionMode;
  toeicPart: ToeicPart | null;
  writingType: WritingType | null;
  topic: string;
  passage: string | null;
  insertSentence: string | null;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  } | null;
  answer: string;
  hint: string | null;
  explanation: string | null;
  createdAt: string;
}

// TTS 관련 타입
export interface TTSRequest {
  text: string;
  speed?: number;
  voice?: 'male' | 'female';
}

export interface TTSResponse {
  success: boolean;
  data?: {
    audio: string;
    contentType: string;
    textLength: number;
  };
  message?: string;
}

export interface TTSStatusResponse {
  success: boolean;
  data?: {
    available: boolean;
    message: string;
  };
  message?: string;
}

// 챗봇 관련 타입
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatMessageRequest {
  message: string;
  conversationId: string | null;
}

export interface ChatMessageResponse {
  message: string;
  conversationId: string;
  suggestions: string[];
  timestamp: string;
}

export interface ConversationSession {
  conversationId: string;
  preview: string;
  messageCount: number;
  startedAt: string;
  lastActivity: string;
}

export interface ConversationHistory {
  conversationId: string;
  messages: ChatMessage[];
  startedAt: string;
  lastActivity: string;
}

// 챗봇 에러 응답 타입
export interface ChatErrorResponse {
  success: false;
  message: string;
}

// 챗봇 성공 응답 타입
export interface ChatSuccessResponse<T> {
  success: true;
  data: T;
}

// 챗봇 삭제 응답 타입
export interface ChatDeleteResponse {
  success: true;
  message: string;
}

// apiService
export const apiService = {
  // 아이디 중복 확인 (인증 불필요)
  async checkUsername(username: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await apiClient.get<ApiResponse<boolean>>(`/auth/check-username?username=${username}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '아이디 중복 확인에 실패했습니다.');
    }
  },

  // 핸드폰 중복 확인 (인증 불필요)
  async checkPhone(phone: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await apiClient.get<ApiResponse<boolean>>(`/auth/check-phone?phone=${phone}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '핸드폰 번호 중복 확인에 실패했습니다.');
    }
  },

  // 회원가입 (인증 불필요)
  async signup(data: SignupRequest): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.post<ApiResponse<User>>('/auth/signup', data);
      return response.data;
    } catch (error: any) {
      // 유효성 검증 에러 처리
      if (error.response?.status === 400 && error.response?.data?.data) {
        const validationErrors = error.response.data.data;
        const errorMessages = Object.values(validationErrors).join('\n');
        throw new Error(errorMessages);
      }
      throw new Error(error.response?.data?.message || '회원가입에 실패했습니다.');
    }
  },

  // 로그인 (인증 불필요)
  async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', {
        username,
        password
      });
      
      // ✅ 사용자 정보만 저장 (토큰은 httpOnly Cookie로 자동 관리됨)
      if (response.data.success && response.data.data) {
        const { user } = response.data.data;
        localStorage.setItem('user', JSON.stringify(user));
        // 로그인 상태 변경 이벤트 발생
        window.dispatchEvent(new Event('authStateChanged'));
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '로그인에 실패했습니다.');
    }
  },

  // 로그아웃
  async logout() {
    try {
      // ✅ 서버에 로그아웃 요청하여 httpOnly Cookie 삭제
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
    } finally {
      // 로컬 저장소의 사용자 정보 삭제
      localStorage.removeItem('user');
      // 로그아웃 상태 변경 이벤트 발생
      window.dispatchEvent(new Event('authStateChanged'));
    }
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // 로그인 여부 확인 (user 정보 기반)
  isLoggedIn(): boolean {
    const user = this.getCurrentUser();
    return user !== null;
  },

  // 예문 생성
  async generateExamples(word: string): Promise<ExampleResponse> {
    try {
      const response = await apiClient.post<ApiResponse<ExampleResponse>>('/generate/examples', { word });
      
      // 1단계: success 확인
      if (!response.data.success) {
        throw new Error(response.data.message || '유효한 영어 단어가 아닙니다.');
      }
      
      // 2단계: data가 null인지 확인
      if (!response.data.data) {
        throw new Error('유효한 영어 단어가 아닙니다.');
      }
      
      // 3단계: isValid 확인
      if (!response.data.data.isValid) {
        throw new Error('유효한 영어 단어가 아닙니다.');
      }
      
      return response.data.data;
    } catch (error: any) {
      // axios 에러인 경우 (HTTP 응답이 있는 경우) → 상태 코드별 처리
      if (error.response) {
        if (error.response.status === 400) {
          throw new Error(error.response.data?.message || '유효한 영어 단어가 아닙니다.');
        }
        if (error.response.status === 503) {
          throw new Error('AI 서비스가 일시적으로 사용 불가능합니다. 잠시 후 다시 시도해주세요.');
        }
        throw new Error(error.response.data?.message || '서버 오류가 발생했습니다.');
      }
      // 커스텀 에러 (try 블록 내 throw new Error(...)) → 그대로 전달
      throw error;
    }
  },

  // 문제 생성
  async generateWritingProblems(topic: string, mode: 'toeic' | 'writing'): Promise<ToeicResponse | WritingResponse> {
    try {
      const response = await apiClient.post<ApiResponse<QuestionGenerationResponse>>('/generate/questions', { topic, mode });
      const data = response.data.data;
      
      // mode에 따라 적절한 형태로 반환
      if (data.mode === 'toeic' && data.questions) {
        return {
          mode: 'toeic',
          questions: data.questions
        };
      } else if (data.mode === 'writing' && data.writingQuestions) {
        return {
          mode: 'writing',
          questions: data.writingQuestions
        };
      } else {
        throw new Error('올바르지 않은 응답 형식입니다.');
      }
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.data) {
        const validationErrors = error.response.data.data;
        const errorMessages = Object.values(validationErrors).join('\n');
        throw new Error(errorMessages);
      }
      if (error.response?.status === 503) {
        throw new Error('AI 서비스가 일시적으로 사용 불가능합니다. 잠시 후 다시 시도해주세요.');
      }
      throw new Error(error.response?.data?.message || '서버 오류가 발생했습니다.');
    }
  },

  // 단어 저장
  async saveWord(data: SaveWordRequest): Promise<ApiResponse<WordDto>> {
    try {
      // 409는 의도된 응답(중복)이므로 validateStatus로 에러 처리 대상에서 제외 → 콘솔 에러 미출력
      const response = await apiClient.post<ApiResponse<WordDto>>('/words', data, {
        validateStatus: (status) => (status >= 200 && status < 300) || status === 409,
      });
      if (response.status === 409) {
        throw new Error('이미 저장된 단어입니다.');
      }
      return response.data;
    } catch (error: any) {
      if (error.message === '이미 저장된 단어입니다.') {
        throw error;
      }
      throw new Error(error.response?.data?.message || '단어 저장에 실패했습니다.');
    }
  },

  // 예문 저장
  async saveExample(data: SaveExampleRequest): Promise<ApiResponse<ExampleDto>> {
    try {
      const response = await apiClient.post<ApiResponse<ExampleDto>>('/examples', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '예문 저장에 실패했습니다.');
    }
  },

  // 단어 목록 조회
  async getWords(): Promise<WordDto[]> {
    try {
      const response = await apiClient.get<ApiResponse<WordDto[]>>('/words');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '단어 목록을 불러오는데 실패했습니다.');
    }
  },

  // 예문 목록 조회
  async getExamples(): Promise<ExampleDto[]> {
    try {
      const response = await apiClient.get<ApiResponse<ExampleDto[]>>('/examples');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '예문 목록을 불러오는데 실패했습니다.');
    }
  },

  // 특정 단어의 예문 조회
  async getExamplesByWord(wordId: number): Promise<ExampleDto[]> {
    try {
      const response = await apiClient.get<ApiResponse<ExampleDto[]>>(`/examples/word/${wordId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '예문 조회에 실패했습니다.');
    }
  },

  // 단어 검색
  async searchWords(keyword: string): Promise<WordDto[]> {
    try {
      const response = await apiClient.get<ApiResponse<WordDto[]>>(`/words/search?keyword=${encodeURIComponent(keyword)}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '단어 검색에 실패했습니다.');
    }
  },

  // 예문 검색
  async searchExamples(keyword: string): Promise<ExampleDto[]> {
    try {
      const response = await apiClient.get<ApiResponse<ExampleDto[]>>(`/examples/search?keyword=${encodeURIComponent(keyword)}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '예문 검색에 실패했습니다.');
    }
  },

  // 단어 상세 조회
  async getWord(wordId: number): Promise<WordDto> {
    try {
      const response = await apiClient.get<ApiResponse<WordDto>>(`/words/${wordId}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('단어를 찾을 수 없습니다.');
      }
      throw new Error(error.response?.data?.message || '단어 조회에 실패했습니다.');
    }
  },

  // 단어 삭제
  async deleteWord(wordId: number): Promise<void> {
    try {
      await apiClient.delete(`/words/${wordId}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('단어를 찾을 수 없습니다.');
      }
      throw new Error(error.response?.data?.message || '단어 삭제에 실패했습니다.');
    }
  },

  // 예문 삭제
  async deleteExample(exampleId: number): Promise<void> {
    try {
      await apiClient.delete(`/examples/${exampleId}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('예문을 찾을 수 없습니다.');
      }
      throw new Error(error.response?.data?.message || '예문 삭제에 실패했습니다.');
    }
  },

  // 단어 개수 조회
  async getWordsCount(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<number>>('/words/count');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '단어 개수 조회에 실패했습니다.');
    }
  },

  // 예문 개수 조회
  async getExamplesCount(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<number>>('/examples/count');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '예문 개수 조회에 실패했습니다.');
    }
  },

  // TTS 음성 생성
  async generateTTS(text: string, speed: number = 1.0, voice: 'male' | 'female' = 'female'): Promise<TTSResponse> {
    try {
      const response = await apiClient.post<TTSResponse>('/tts/speak', {
        text,
        speed,
        voice
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 503) {
        // TTS 서비스 불가 시 Web Speech API 사용 안내
        return {
          success: false,
          message: 'TTS 서비스를 사용할 수 없습니다. Web Speech API를 사용해주세요.'
        };
      }
      
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || '입력값이 올바르지 않습니다.');
      }

      throw new Error(error.response?.data?.message || 'TTS 생성에 실패했습니다.');
    }
  },

  // TTS 서비스 상태 확인
  async checkTTSStatus(): Promise<TTSStatusResponse> {
    try {
      const response = await apiClient.get<TTSStatusResponse>('/tts/status');
      return response.data;
    } catch (error: any) {
      console.error('TTS 상태 확인 에러:', error);
      return {
        success: false,
        message: 'TTS 서비스를 사용할 수 없습니다.'
      };
    }
  },

  // 문제 저장
  async saveQuestion(data: SaveQuestionRequest): Promise<ApiResponse<SavedQuestionDto>> {
    try {
      const response = await apiClient.post<ApiResponse<SavedQuestionDto>>('/questions', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '문제 저장에 실패했습니다.');
    }
  },

  // 내 문제 전체 조회
  async getQuestions(): Promise<SavedQuestionDto[]> {
    try {
      const response = await apiClient.get<ApiResponse<SavedQuestionDto[]>>('/questions');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '문제 목록을 불러오는데 실패했습니다.');
    }
  },

  // 토익 문제 조회
  async getToeicQuestions(): Promise<SavedQuestionDto[]> {
    try {
      const response = await apiClient.get<ApiResponse<SavedQuestionDto[]>>('/questions/toeic');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '토익 문제 조회에 실패했습니다.');
    }
  },

  // 토익 파트별 조회
  async getToeicQuestionsByPart(part: ToeicPart): Promise<SavedQuestionDto[]> {
    try {
      const response = await apiClient.get<ApiResponse<SavedQuestionDto[]>>(`/questions/toeic/${part}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '문제 조회에 실패했습니다.');
    }
  },

  // 영작 문제 조회
  async getWritingQuestions(): Promise<SavedQuestionDto[]> {
    try {
      const response = await apiClient.get<ApiResponse<SavedQuestionDto[]>>('/questions/writing');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '영작 문제 조회에 실패했습니다.');
    }
  },

  // 주제별 검색
  async searchQuestions(topic: string): Promise<SavedQuestionDto[]> {
    try {
      const response = await apiClient.get<ApiResponse<SavedQuestionDto[]>>(`/questions/search?topic=${encodeURIComponent(topic)}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '검색에 실패했습니다.');
    }
  },

  // 문제 상세 조회
  async getQuestion(id: number): Promise<SavedQuestionDto> {
    try {
      const response = await apiClient.get<ApiResponse<SavedQuestionDto>>(`/questions/${id}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('문제를 찾을 수 없습니다.');
      }
      throw new Error(error.response?.data?.message || '문제 조회에 실패했습니다.');
    }
  },

  // 문제 삭제
  async deleteQuestion(id: number): Promise<void> {
    try {
      await apiClient.delete(`/questions/${id}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('문제를 찾을 수 없습니다.');
      }
      throw new Error(error.response?.data?.message || '문제 삭제에 실패했습니다.');
    }
  },

  // 전체 문제 개수
  async getQuestionsCount(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<number>>('/questions/count');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '문제 개수 조회에 실패했습니다.');
    }
  },

  // 토익 문제 개수
  async getToeicQuestionsCount(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<number>>('/questions/toeic/count');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '토익 문제 개수 조회에 실패했습니다.');
    }
  },

  // 영작 문제 개수
  async getWritingQuestionsCount(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<number>>('/questions/writing/count');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '영작 문제 개수 조회에 실패했습니다.');
    }
  },

  // 챗봇 메시지 전송
  async sendChatMessage(message: string, conversationId: string | null): Promise<ChatMessageResponse> {
    try {
      const response = await apiClient.post<ChatSuccessResponse<ChatMessageResponse>>('/chat/message', {
        message,
        conversationId
      });
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.message;
        if (errorMsg === 'Message is required') {
          throw new Error('메시지를 입력해주세요.');
        }
        if (errorMsg === 'Message is too long (max 1000 characters)') {
          throw new Error('메시지가 너무 깁니다 (최대 1000자)');
        }
        throw new Error(errorMsg || '메시지를 입력해주세요.');
      }
      if (error.response?.status === 500) {
        throw new Error('챗봇 응답 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
      throw new Error(error.response?.data?.message || '메시지 전송에 실패했습니다.');
    }
  },

  // 대화 목록 조회
  async getChatConversations(): Promise<ConversationSession[]> {
    try {
      const response = await apiClient.get<ChatSuccessResponse<ConversationSession[]>>('/chat/conversations');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '대화 목록을 불러오는데 실패했습니다.');
    }
  },

  // 대화 히스토리 조회
  async getChatHistory(conversationId: string): Promise<ConversationHistory> {
    try {
      const response = await apiClient.get<ChatSuccessResponse<ConversationHistory>>(`/chat/history/${conversationId}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('대화를 찾을 수 없습니다.');
      }
      throw new Error(error.response?.data?.message || '대화 히스토리를 불러오는데 실패했습니다.');
    }
  },

  // 대화 삭제
  async deleteChatConversation(conversationId: string): Promise<void> {
    try {
      await apiClient.delete<ChatDeleteResponse>(`/chat/${conversationId}`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('대화를 찾을 수 없습니다.');
      }
      throw new Error(error.response?.data?.message || '대화 삭제에 실패했습니다.');
    }
  },
};