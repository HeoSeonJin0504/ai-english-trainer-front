import { useState } from 'react';
import styled from 'styled-components';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { apiService, type Question } from '../services/api';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  h1 {
    color: #1e40af;
    margin-bottom: 2rem;
    text-align: center;
  }
`;

const InputCard = styled(Card)`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Problems = styled.div`
  margin-top: 2rem;

  h2 {
    color: #1e40af;
    margin-bottom: 1rem;
  }
`;

const ProblemCard = styled(Card)`
  margin-bottom: 1.5rem;
`;

const ProblemNumber = styled.div`
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const QuestionText = styled.p`
  font-size: 1.15rem;
  margin-bottom: 0.5rem;
  color: #1e40af;
  font-weight: 500;
`;

const Translation = styled.p`
  font-size: 0.95rem;
  margin-bottom: 1rem;
  color: #666;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const OptionButton = styled.button<{ selected?: boolean; showAnswer?: boolean; isCorrect?: boolean }>`
  padding: 0.75rem 1rem;
  text-align: left;
  border: 2px solid ${props => 
    props.showAnswer && props.isCorrect 
      ? '#10b981' 
      : props.selected 
        ? '#3b82f6' 
        : '#e5e7eb'
  };
  background: ${props => 
    props.showAnswer && props.isCorrect 
      ? '#d1fae5' 
      : props.selected 
        ? '#eff6ff' 
        : 'white'
  };
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #333;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Answer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #d1fae5;
  border-radius: 8px;
  color: #065f46;
  border-left: 4px solid #10b981;
`;

const ToggleButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
`;

export default function WritingProblem() {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('주제를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setShowAnswers(false);
    setSelectedAnswers({});
    
    try {
      const data = await apiService.generateWritingProblems(topic);
      setQuestions(data.questions);
    } catch (err: any) {
      setError(err.message || '문제 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionIndex: number, option: string) => {
    if (showAnswers) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  return (
    <Container>
      <h1>영어 퀴즈 생성기</h1>
      
      <InputCard>
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="주제를 입력하세요 (예: 여행, 음식, 취미)"
          onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <Button onClick={handleGenerate} disabled={loading}>
          문제 생성
        </Button>
      </InputCard>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {questions.length > 0 && (
        <Problems>
          <h2>생성된 문제</h2>
          {questions.map((question, index) => (
            <ProblemCard key={index}>
              <ProblemNumber>문제 {index + 1}</ProblemNumber>
              <QuestionText>{question.question}</QuestionText>
              <Translation>{question.translation}</Translation>
              
              <OptionsContainer>
                {Object.entries(question.options).map(([key, value]) => (
                  <OptionButton
                    key={key}
                    selected={selectedAnswers[index] === key}
                    showAnswer={showAnswers}
                    isCorrect={key === question.answer}
                    onClick={() => handleOptionSelect(index, key)}
                    disabled={showAnswers}
                  >
                    <strong>{key})</strong> {value}
                  </OptionButton>
                ))}
              </OptionsContainer>

              {showAnswers && (
                <Answer>
                  <strong>정답:</strong> {question.answer}) {question.options[question.answer as keyof typeof question.options]}
                </Answer>
              )}
            </ProblemCard>
          ))}
          <ToggleButton 
            onClick={() => setShowAnswers(!showAnswers)}
          >
            {showAnswers ? '정답 숨기기' : '정답 확인'}
          </ToggleButton>
        </Problems>
      )}
    </Container>
  );
}
