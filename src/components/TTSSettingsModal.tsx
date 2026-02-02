import { useState, useEffect } from "react";
import styled from "styled-components";
import { Button } from "./Button";
import { apiService } from "../services/api";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2`
  color: #1e293b;
  margin-bottom: 2rem;
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 1rem;
`;

const SettingGroup = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #334155;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const VoiceOptions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

const VoiceButton = styled.button<{ $active: boolean }>`
  padding: 1rem;
  border: 2px solid ${(props) => (props.$active ? "#3b82f6" : "#e2e8f0")};
  background: ${(props) => (props.$active ? "#3b82f6" : "white")};
  color: ${(props) => (props.$active ? "white" : "#64748b")};
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    border-color: #3b82f6;
    ${(props) =>
      !props.$active &&
      `
      background: #f1f5f9;
      color: #3b82f6;
    `}
  }

  &:active {
    transform: scale(0.98);
  }
`;

const SpeedSlider = styled.div`
  padding: 0.75rem 0;
`;

const SliderInput = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, #e2e8f0 0%, #e2e8f0 100%);
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    border: 3px solid #3b82f6;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    transition: all 0.2s;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
  }

  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    border: 3px solid #3b82f6;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }
`;

const SpeedDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #64748b;

  .current {
    font-weight: 700;
    color: #3b82f6;
    font-size: 1.25rem;
    background: #eff6ff;
    padding: 0.25rem 0.75rem;
    border-radius: 6px;
  }
`;

const PreviewButton = styled(Button)`
  width: 100%;
  margin-top: 1.25rem;
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  font-weight: 600;

  &:hover {
    background: #3b82f6;
    color: white;
  }
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
`;

const CancelButton = styled(Button)`
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #475569;
    box-shadow: none;
  }
`;

const SaveButton = styled(Button)`
  background: #3b82f6;

  &:hover {
    background: #2563eb;
  }
`;

interface TTSSettingsModalProps {
  onClose: () => void;
}

export function TTSSettingsModal({ onClose }: TTSSettingsModalProps) {
  const [voice, setVoice] = useState<"male" | "female">("female");
  const [speed, setSpeed] = useState(1.0);

  useEffect(() => {
    const savedSettings = localStorage.getItem("tts-settings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setVoice(settings.voice || "female");
        setSpeed(settings.speed || 1.0);
      } catch (e) {
        console.error("Failed to load TTS settings:", e);
      }
    }
  }, []);
  const handleSave = () => {
    localStorage.setItem("tts-settings", JSON.stringify({ voice, speed }));

    window.dispatchEvent(new Event("tts-settings-changed"));

    alert("TTS 설정이 저장되었습니다!");
    onClose();
  };

  const handlePreview = async () => {
    const text = "Hello! Welcome to AI English Trainer!";

    try {
      // Google TTS로 미리듣기 시도
      const response = await apiService.generateTTS(text, speed, voice);

      if (response.success && response.data) {
        const audio = new Audio(
          `data:${response.data.contentType};base64,${response.data.audio}`,
        );
        audio.play();
      } else {
        // 실패 시 Web Speech API 사용
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = speed;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      // 에러 시 Web Speech API 사용
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = speed;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>
          <span>🔊</span>
          <span>음성 설정</span>
        </Title>

        <SettingGroup>
          <Label>음성 유형</Label>
          <VoiceOptions>
            <VoiceButton
              $active={voice === "female"}
              onClick={() => setVoice("female")}
            >
              <span>👩</span>
              <span>여성</span>
            </VoiceButton>
            <VoiceButton
              $active={voice === "male"}
              onClick={() => setVoice("male")}
            >
              <span>👨</span>
              <span>남성</span>
            </VoiceButton>
          </VoiceOptions>
        </SettingGroup>

        <SettingGroup>
          <Label>재생 속도</Label>
          <SpeedSlider>
            <SliderInput
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
            />
            <SpeedDisplay>
              <span>0.5x</span>
              <span className="current">{speed.toFixed(1)}x</span>
              <span>2.0x</span>
            </SpeedDisplay>
          </SpeedSlider>
          <PreviewButton onClick={handlePreview}>🎧 미리듣기</PreviewButton>
        </SettingGroup>

        <ButtonGroup>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <SaveButton onClick={handleSave}>저장</SaveButton>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
}
