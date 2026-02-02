import { apiService } from '../services/api';

// TTS 설정 인터페이스
export interface TTSOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: 'male' | 'female';
  useGoogleTTS?: boolean;
}

// TTS 기본 설정
const DEFAULT_OPTIONS: TTSOptions = {
  lang: 'en-US',
  rate: 0.9,
  pitch: 1,
  volume: 1,
  voice: 'female',
  useGoogleTTS: true,
};

// 오디오 엘리먼트 재사용
let audioElement: HTMLAudioElement | null = null;

/**
 * Google Cloud TTS로 음성 재생
 */
const speakWithGoogle = async (
  text: string,
  options: TTSOptions,
  onEnd?: () => void,
  onError?: () => void
): Promise<void> => {
  try {
    // 전역 설정 가져오기
    const savedVoice = localStorage.getItem('tts-voice') as 'male' | 'female' | null;
    const savedSpeed = localStorage.getItem('tts-speed');
    
    const finalVoice = savedVoice || options.voice || 'female';
    const finalSpeed = savedSpeed ? parseFloat(savedSpeed) : (options.rate || 0.9);

    const response = await apiService.generateTTS(
      text,
      finalSpeed,
      finalVoice
    );

    if (!response.success || !response.data?.audio) {
      throw new Error('TTS 생성 실패');
    }

    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
    }

    audioElement = new Audio(`data:audio/mp3;base64,${response.data.audio}`);
    audioElement.volume = options.volume || 1;
    
    if (onEnd) {
      audioElement.onended = onEnd;
    }

    await audioElement.play();
    
  } catch (error) {
    console.error('Google TTS 에러:', error);
    
    if (onError) {
      onError();
    }
    
    console.log('🔄 Web Speech API로 대체 재생');
    speakWithWebAPI(text, options, onEnd);
  }
};

/**
 * Web Speech API로 음성 재생
 */
const speakWithWebAPI = (
  text: string,
  options: TTSOptions,
  onEnd?: () => void
): void => {
  if (!('speechSynthesis' in window)) {
    console.error('이 브라우저는 TTS를 지원하지 않습니다.');
    alert('죄송합니다. 이 브라우저는 음성 재생을 지원하지 않습니다.');
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };
  
  utterance.lang = finalOptions.lang!;
  utterance.rate = finalOptions.rate!;
  utterance.pitch = finalOptions.pitch!;
  utterance.volume = finalOptions.volume!;

  if (onEnd) {
    utterance.onend = onEnd;
  }

  window.speechSynthesis.speak(utterance);
};

/**
 * 텍스트를 음성으로 읽어주는 함수
 */
export const speak = (
  text: string,
  options: TTSOptions = {},
  onEnd?: () => void
): void => {
  if (!text.trim()) return;

  const finalOptions = { ...DEFAULT_OPTIONS, ...options };

  if (finalOptions.useGoogleTTS) {
    speakWithGoogle(text, finalOptions, onEnd, () => {
      // Google TTS 실패 시 자동으로 Web Speech API 사용
    });
  } else {
    speakWithWebAPI(text, finalOptions, onEnd);
  }
};

/**
 * 재생 중인 음성을 중지하는 함수
 */
export const stopSpeaking = (): void => {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
  
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * 속도별 재생 함수들
 */
export const speakSlow = (text: string, onEnd?: () => void): void => {
  speak(text, { rate: 0.7 }, onEnd);
};

export const speakNormal = (text: string, onEnd?: () => void): void => {
  speak(text, { rate: 0.9 }, onEnd);
};

export const speakFast = (text: string, onEnd?: () => void): void => {
  speak(text, { rate: 1.2 }, onEnd);
};