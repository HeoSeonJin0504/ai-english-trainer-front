import { useState } from 'react';
import styled from 'styled-components';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { apiService } from '../services/api';

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
`;

const Korean = styled.p`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #333;
`;

const Answer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #eff6ff;
  border-radius: 8px;
  color: #1e40af;
  border-left: 4px solid #3b82f6;
`;

const ToggleButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
`;

interface Problem {
  korean: string;
  answer: string;
}

export default function WritingProblem() {
  const [topic, setTopic] = useState('');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
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
    
    try {
      const data = await apiService.generateWritingProblems(topic);
      setProblems(data.problems);
      setUserAnswers(new Array(data.problems.length).fill(''));
    } catch (err: any) {
      setError(err.message || '문제 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  return (
    <Container>
      <h1>영작 문제 생성기</h1>
      
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

      {problems.length > 0 && (
        <Problems>
          <h2>영작 문제</h2>
          {problems.map((problem, index) => (
            <ProblemCard key={index}>
              <ProblemNumber>문제 {index + 1}</ProblemNumber>
              <Korean>{problem.korean}</Korean>
              <Input
                value={userAnswers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="영어로 작성하세요..."
                disabled={showAnswers}
              />
              {showAnswers && (
                <Answer>
                  <strong>정답:</strong> {problem.answer}
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
