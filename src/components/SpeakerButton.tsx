import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';

interface SpeakerButtonProps {
  text: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'icon' | 'text';
  speed?: 'slow' | 'normal' | 'fast';
}

const IconButton = styled.button<{ $size: string; $isPlaying: boolean }>`
  background: ${props => props.$isPlaying ? '#ef4444' : '#3b82f6'};
  color: white;
  border: none;
  border-radius: 50%;
  width: ${props => {
    switch(props.$size) {
      case 'small': return '28px';
      case 'large': return '48px';
      default: return '40px';
    }
  }};
  height: ${props => {
    switch(props.$size) {
      case 'small': return '28px';
      case 'large': return '48px';
      default: return '40px';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: ${props => {
    switch(props.$size) {
      case 'small': return '0.75rem';
      case 'large': return '1.3rem';
      default: return '1.1rem';
    }
  }};
  flex-shrink: 0;

  &:hover {
    background: ${props => props.$isPlaying ? '#dc2626' : '#2563eb'};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
  }
`;

const TextButton = styled.button<{ $isPlaying: boolean }>`
  background: ${props => props.$isPlaying ? '#fee2e2' : '#eff6ff'};
  color: ${props => props.$isPlaying ? '#dc2626' : '#1e40af'};
  border: 2px solid ${props => props.$isPlaying ? '#ef4444' : '#3b82f6'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.$isPlaying ? '#fecaca' : '#dbeafe'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #f3f4f6;
    border-color: #d1d5db;
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

export function SpeakerButton({
  text,
  size = 'medium',
  variant = 'icon',
  speed = 'normal'
}: SpeakerButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    checkTTSAvailability();
  }, []);

  const checkTTSAvailability = async () => {
    try {
      const status = await apiService.checkTTSStatus();
      if (!status.success || !status.data?.available) {
        setUseFallback(true);
      }
    } catch (error) {
      setUseFallback(true);
    }
  };

  const getSpeedValue = (speed: 'slow' | 'normal' | 'fast'): number => {
    switch (speed) {
      case 'slow': return 0.75;
      case 'fast': return 1.25;
      default: return 1.0;
    }
  };

  const playWithWebSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = getSpeedValue(speed);
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const playWithGoogleTTS = async () => {
    try {
      setIsPlaying(true);

      const response = await apiService.generateTTS(text, getSpeedValue(speed), 'female');

      if (!response.success || !response.data) {
        // TTS 서비스 불가 시 Web Speech API로 대체
        playWithWebSpeech();
        setUseFallback(true);
        return;
      }

      // Base64 오디오 데이터를 Audio 객체로 재생
      const audio = new Audio(`data:${response.data.contentType};base64,${response.data.audio}`);
      audioRef.current = audio;

      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        // 에러 발생 시 Web Speech API로 대체
        playWithWebSpeech();
        setUseFallback(true);
      };

      await audio.play();
    } catch (error) {
      console.error('TTS 재생 실패:', error);
      // 에러 발생 시 Web Speech API로 대체
      playWithWebSpeech();
      setUseFallback(true);
    }
  };

  const handleClick = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    if (useFallback) {
      playWithWebSpeech();
    } else {
      await playWithGoogleTTS();
    }
  };

  if (variant === 'text') {
    return (
      <TextButton 
        onClick={handleClick} 
        $isPlaying={isPlaying}
        disabled={!text.trim()}
        title={isPlaying ? '중지' : '발음 듣기'}
      >
        <span>{isPlaying ? '⏸️' : '🔊'}</span>
        <span>{isPlaying ? '중지' : '발음 듣기'}</span>
      </TextButton>
    );
  }

  return (
    <IconButton
      onClick={handleClick}
      $size={size}
      $isPlaying={isPlaying}
      disabled={!text.trim()}
      title={isPlaying ? '중지' : '발음 듣기'}
    >
      {isPlaying ? '⏸️' : '🔊'}
    </IconButton>
  );
}