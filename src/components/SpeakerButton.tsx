import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { speak, stopSpeaking } from '../utils/tts';

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
      case 'small': return '32px';
      case 'large': return '48px';
      default: return '40px';
    }
  }};
  height: ${props => {
    switch(props.$size) {
      case 'small': return '32px';
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
      case 'small': return '0.9rem';
      case 'large': return '1.3rem';
      default: return '1.1rem';
    }
  }};

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

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  text,
  size = 'medium',
  variant = 'icon',
  speed = 'normal'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleClick = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      const rate = speed === 'slow' ? 0.7 : speed === 'fast' ? 1.2 : 0.9;
      
      setIsPlaying(true);
      
      speak(text, { rate }, () => {
        setIsPlaying(false);
      });
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
};