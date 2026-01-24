import { useState } from 'react';
import styled from 'styled-components';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { 
  apiService, 
  type ToeicResponse, 
  type WritingResponse,
  type ToeicPart5Question,
  type ToeicPart6Question,
  type ToeicPart7Question,
  type WritingQuestion
} from '../services/api';
import { gradeWriting, type GradingResult } from '../utils/grading';
import { SpeakerButton } from '../components/SpeakerButton';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;

  h1 {
    color: #1e40af;
    margin-bottom: 2rem;
    text-align: center;
  }
`;

const InputSection = styled(Card)`
  margin-bottom: 2rem;
`;

const ModeSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  justify-content: center;
`;

const ModeButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 2rem;
  border: 2px solid ${props => props.$active ? '#3b82f6' : '#e5e7eb'};
  background: ${props => props.$active ? '#3b82f6' : 'white'};
  color: ${props => props.$active ? 'white' : '#666'};
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    background: ${props => props.$active ? '#2563eb' : '#eff6ff'};
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 1rem;
`;

const Results = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PartSection = styled.div`
  h2 {
    color: #1e40af;
    margin-bottom: 1rem;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .badge {
      background: #3b82f6;
      color: white;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }
  }
`;

const QuestionCard = styled(Card)`
  margin-bottom: 1rem;
`;

const QuestionNumber = styled.div`
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const Passage = styled.div`
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
`;

const QuestionText = styled.p`
  font-size: 1.05rem;
  margin-bottom: 1rem;
  color: #1e40af;
  font-weight: 500;
  line-height: 1.6;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const OptionButton = styled.button<{ $selected?: boolean; $showAnswer?: boolean; $isCorrect?: boolean; $isWrong?: boolean }>`
  padding: 0.75rem 1rem;
  text-align: left;
  border: 2px solid ${props => {
    if (props.$showAnswer && props.$isCorrect) return '#10b981';
    if (props.$showAnswer && props.$isWrong) return '#ef4444';
    if (props.$selected) return '#3b82f6';
    return '#e5e7eb';
  }};
  background: ${props => {
    if (props.$showAnswer && props.$isCorrect) return '#d1fae5';
    if (props.$showAnswer && props.$isWrong) return '#fee2e2';
    if (props.$selected) return '#eff6ff';
    return 'white';
  }};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #333;
  line-height: 1.6;
  position: relative;

  &:hover {
    border-color: ${props => props.$showAnswer ? '' : '#3b82f6'};
    background: ${props => props.$showAnswer ? '' : '#eff6ff'};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  ${props => props.$showAnswer && props.$isCorrect && `
    &::after {
      content: '✓ 정답';
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #10b981;
      font-weight: bold;
      font-size: 0.9rem;
    }
  `}

  ${props => props.$showAnswer && props.$isWrong && `
    &::after {
      content: '✗ 오답';
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #ef4444;
      font-weight: bold;
      font-size: 0.9rem;
    }
  `}
`;

const WritingQuestionCard = styled(Card)`
  margin-bottom: 1rem;
`;

const TypeBadge = styled.span<{ $type: string }>`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  background: ${props => {
    switch (props.$type) {
      case 'situation': return '#dbeafe';
      case 'translation': return '#fef3c7';
      case 'fix': return '#fee2e2';
      case 'short-answer': return '#d1fae5';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'situation': return '#1e40af';
      case 'translation': return '#92400e';
      case 'fix': return '#991b1b';
      case 'short-answer': return '#065f46';
      default: return '#374151';
    }
  }};
`;

const Hint = styled.div`
  background: #fef3c7;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 0.5rem;
  color: #92400e;
  font-size: 0.95rem;
  
  &::before {
    content: '💡 힌트: ';
    font-weight: 600;
  }
`;

const Answer = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #10b981;
  line-height: 1.6;
  color: #333;

  strong {
    display: block;
    margin-bottom: 0.75rem;
    color: #10b981;
    font-size: 1.05rem;
  }
`;

const ToggleButton = styled(Button)`
  width: 100%;
  margin-top: 1rem;
`;

const WritingAnswerSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px dashed #e5e7eb;
`;

const AnswerLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

const AnswerTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

const GradeButton = styled(Button)`
  margin-top: 0.75rem;
  width: 100%;
`;

const GradingResultBox = styled.div<{ $level: 'excellent' | 'good' | 'fair' | 'poor' }>`
  margin-top: 1rem;
  padding: 1.25rem;
  border-radius: 8px;
  border-left: 4px solid ${props => {
    switch (props.$level) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'fair': return '#f59e0b';
      case 'poor': return '#ef4444';
    }
  }};
  background: ${props => {
    switch (props.$level) {
      case 'excellent': return '#d1fae5';
      case 'good': return '#dbeafe';
      case 'fair': return '#fef3c7';
      case 'poor': return '#fee2e2';
    }
  }};
`;

const ScoreDisplay = styled.div<{ color: string }>`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.75rem;

  .score {
    font-size: 2rem;
    font-weight: bold;
    color: ${props => props.color};
  }

  .label {
    font-size: 1rem;
    color: #6b7280;
  }
`;

const FeedbackText = styled.div`
  color: #374151;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'situation': return '상황 설명 영작';
    case 'translation': return '한→영 번역';
    case 'fix': return '문장 고치기';
    case 'short-answer': return '짧은 답변';
    default: return type;
  }
};

const InsertSentence = styled.div`
  background: #fef3c7;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border-left: 4px solid #f59e0b;
  
  .label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #92400e;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }

  .sentence {
    color: #451a03;
    font-size: 1.05rem;
    line-height: 1.6;
    font-weight: 500;
  }
`;

const Explanation = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border: 2px solid #3b82f6;
  border-radius: 6px;
  color: #1e40af;
  font-size: 0.9rem;
  line-height: 1.5;
  
  &::before {
    content: '💡 해설: ';
    font-weight: 600;
    color: #3b82f6;
  }
`;

const LoadingWithMessage = styled.div`
  text-align: center;
  color: #1e40af;

  .spinner-container {
    margin-bottom: 1rem;
  }

  .message {
    font-size: 0.95rem;
    color: #64748b;
    line-height: 1.6;
  }
`;

const PageDescription = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;

  .highlight {
    color: #3b82f6;
    font-weight: 600;
  }
`;

const SaveAllButton = styled(Button)`
  width: 100%;
  margin-bottom: 1rem;
  background: #10b981;
  
  &:hover {
    background: #059669;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function WritingProblem() {
  const [mode, setMode] = useState<'toeic' | 'writing'>('toeic');
  const [topic, setTopic] = useState('');
  const [toeicData, setToeicData] = useState<ToeicResponse | null>(null);
  const [writingData, setWritingData] = useState<WritingResponse | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveAllLoading, setSaveAllLoading] = useState(false);
  const [savingQuestions, setSavingQuestions] = useState<Set<string>>(new Set());

  // 영작 모드 전용 상태
  const [writingAnswers, setWritingAnswers] = useState<{ [key: number]: string }>({});
  const [gradingResults, setGradingResults] = useState<{ [key: number]: GradingResult }>({});

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('주제를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setShowAnswers(false);
    setSelectedAnswers({});
    setToeicData(null);
    setWritingData(null);
    setWritingAnswers({});
    setGradingResults({});

    try {
      const data = await apiService.generateWritingProblems(topic, mode);

      if (data.mode === 'toeic') {
        setToeicData(data as ToeicResponse);
      } else {
        setWritingData(data as WritingResponse);
      }
    } catch (err: any) {
      const errorMessage = err.message || '문제 생성에 실패했습니다.';
      
      if (errorMessage.includes('일시적으로 사용 불가능')) {
        setError(errorMessage);
        alert('AI 서비스 오류: 잠시 후 다시 시도해주세요.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionKey: string, option: string) => {
    if (showAnswers) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionKey]: option
    }));
  };

  const handleWritingAnswerChange = (index: number, value: string) => {
    setWritingAnswers(prev => ({
      ...prev,
      [index]: value
    }));
    // 답안이 변경되면 채점 결과 초기화
    setGradingResults(prev => {
      const newResults = { ...prev };
      delete newResults[index];
      return newResults;
    });
  };

  const handleGradeAnswer = (index: number, modelAnswer: string) => {
    const userAnswer = writingAnswers[index] || '';
    const result = gradeWriting(userAnswer, modelAnswer);

    setGradingResults(prev => ({
      ...prev,
      [index]: result
    }));
  };

  const getScoreColor = (level: 'excellent' | 'good' | 'fair' | 'poor') => {
    switch (level) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'fair': return '#f59e0b';
      case 'poor': return '#ef4444';
    }
  };

  const handleSaveAllQuestions = async () => {
    if (!topic.trim()) {
      alert('주제가 없습니다.');
      return;
    }

    setSaveAllLoading(true);
    try {
      let savedCount = 0;

      if (toeicData) {
        // Part 5 저장
        for (const q of toeicData.questions.part5) {
          await apiService.saveQuestion({
            mode: 'TOEIC',
            toeicPart: 'PART5',
            topic: topic,
            question: q.question,
            options: q.options,
            answer: q.answer,
            explanation: q.explanation
          });
          savedCount++;
        }

        // Part 6 저장
        for (const q of toeicData.questions.part6) {
          await apiService.saveQuestion({
            mode: 'TOEIC',
            toeicPart: 'PART6',
            topic: topic,
            passage: q.passage,
            insertSentence: q.insertSentence,
            question: q.question,
            options: q.options,
            answer: q.answer,
            explanation: q.explanation
          });
          savedCount++;
        }

        // Part 7 저장
        for (const q of toeicData.questions.part7) {
          await apiService.saveQuestion({
            mode: 'TOEIC',
            toeicPart: 'PART7',
            topic: topic,
            passage: q.passage,
            question: q.question,
            options: q.options,
            answer: q.answer,
            explanation: q.explanation
          });
          savedCount++;
        }
      } else if (writingData) {
        // 영작 문제 저장
        for (const q of writingData.questions) {
          await apiService.saveQuestion({
            mode: 'WRITING',
            writingType: q.type,
            topic: topic,
            question: q.question,
            hint: q.hint,
            answer: q.answer
          });
          savedCount++;
        }
      }

      alert(`${savedCount}개의 문제가 저장되었습니다!`);
    } catch (err: any) {
      alert(err.message || '문제 저장에 실패했습니다.');
    } finally {
      setSaveAllLoading(false);
    }
  };

  // 개별 문제 저장 - Part 5
  const handleSavePart5Question = async (q: ToeicPart5Question, idx: number) => {
    const key = `p5-${idx}`;
    if (savingQuestions.has(key)) return;

    setSavingQuestions(prev => new Set(prev).add(key));
    try {
      await apiService.saveQuestion({
        mode: 'TOEIC',
        toeicPart: 'PART5',
        topic: topic,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation
      });
      alert('문제가 저장되었습니다!');
    } catch (err: any) {
      alert(err.message || '문제 저장에 실패했습니다.');
    } finally {
      setSavingQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  // 개별 문제 저장 - Part 6
  const handleSavePart6Question = async (q: ToeicPart6Question, idx: number) => {
    const key = `p6-${idx}`;
    if (savingQuestions.has(key)) return;

    setSavingQuestions(prev => new Set(prev).add(key));
    try {
      await apiService.saveQuestion({
        mode: 'TOEIC',
        toeicPart: 'PART6',
        topic: topic,
        passage: q.passage,
        insertSentence: q.insertSentence,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation
      });
      alert('문제가 저장되었습니다!');
    } catch (err: any) {
      alert(err.message || '문제 저장에 실패했습니다.');
    } finally {
      setSavingQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  // 개별 문제 저장 - Part 7
  const handleSavePart7Question = async (q: ToeicPart7Question, idx: number) => {
    const key = `p7-${idx}`;
    if (savingQuestions.has(key)) return;

    setSavingQuestions(prev => new Set(prev).add(key));
    try {
      await apiService.saveQuestion({
        mode: 'TOEIC',
        toeicPart: 'PART7',
        topic: topic,
        passage: q.passage,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation
      });
      alert('문제가 저장되었습니다!');
    } catch (err: any) {
      alert(err.message || '문제 저장에 실패했습니다.');
    } finally {
      setSavingQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  // 개별 영작 문제 저장
  const handleSaveWritingQuestion = async (q: WritingQuestion, idx: number) => {
    const key = `w-${idx}`;
    if (savingQuestions.has(key)) return;

    setSavingQuestions(prev => new Set(prev).add(key));
    try {
      await apiService.saveQuestion({
        mode: 'WRITING',
        writingType: q.type,
        topic: topic,
        question: q.question,
        hint: q.hint,
        answer: q.answer
      });
      alert('문제가 저장되었습니다!');
    } catch (err: any) {
      alert(err.message || '문제 저장에 실패했습니다.');
    } finally {
      setSavingQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  return (
    <Container>
      <h1>영어 문제 생성기</h1>

      <PageDescription>
        원하는 주제를 입력하면 AI가 맞춤형 문제를 생성합니다.<br />
        <span className="highlight">토익 모드</span>는 Part 5·6·7 문제를, <span className="highlight">영작 모드</span>는 다양한 영작 문제를 제공합니다.
      </PageDescription>

      <InputSection>
        <ModeSelector>
          <ModeButton
            $active={mode === 'toeic'}
            onClick={() => setMode('toeic')}
          >
            토익 모드
          </ModeButton>
          <ModeButton
            $active={mode === 'writing'}
            onClick={() => setMode('writing')}
          >
            영작 모드
          </ModeButton>
        </ModeSelector>

        <InputRow>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={mode === 'toeic' ? '주제를 입력하세요 (예: 비즈니스, 여행)' : '주제를 입력하세요 (예: 일상 대화, 이메일 작성)'}
            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <Button onClick={handleGenerate} disabled={loading}>
            문제 생성
          </Button>
        </InputRow>
      </InputSection>

      {loading && (
        <LoadingWithMessage>
          <div className="spinner-container">
            <Loading />
          </div>
          <div className="message">
            AI가 문제를 생성하고 있습니다...<br />
            {mode === 'toeic' ? '약 5~10초' : '약 5~10초'} 정도 소요됩니다.
          </div>
        </LoadingWithMessage>
      )}
      
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {/* 토익 모드 결과 */}
      {toeicData && (
        <Results>
          <SaveAllButton 
            onClick={handleSaveAllQuestions}
            disabled={saveAllLoading}
          >
            {saveAllLoading ? '저장 중...' : '📥 모든 문제 저장하기'}
          </SaveAllButton>

          {/* Part 5 */}
          {toeicData.questions.part5.length > 0 && (
            <PartSection>
              <h2>
                <span className="badge">Part 5</span>
                문법 · 어휘
              </h2>
              {toeicData.questions.part5.map((q, idx) => (
                <QuestionCard key={`p5-${idx}`}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <QuestionNumber>문제 {idx + 1}</QuestionNumber>
                      <Button
                        onClick={() => handleSavePart5Question(q, idx)}
                        variant="secondary"
                        disabled={savingQuestions.has(`p5-${idx}`)}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      >
                        {savingQuestions.has(`p5-${idx}`) ? '저장 중...' : '💾 저장'}
                      </Button>
                    </div>
                    <SpeakerButton text={q.question} size="small" />
                  </div>
                  <QuestionText>{q.question}</QuestionText>
                  <OptionsContainer>
                    {Object.entries(q.options).map(([key, value]) => (
                      <OptionButton
                        key={key}
                        $selected={selectedAnswers[`p5-${idx}`] === key}
                        $showAnswer={showAnswers}
                        $isCorrect={showAnswers && key === q.answer}
                        $isWrong={showAnswers && selectedAnswers[`p5-${idx}`] === key && key !== q.answer}
                        onClick={() => handleOptionSelect(`p5-${idx}`, key)}
                        disabled={showAnswers}
                      >
                        <strong>{key})</strong> {value}
                      </OptionButton>
                    ))}
                  </OptionsContainer>
                  {showAnswers && (
                    <>
                      <Answer>
                        <strong>✓ 정답</strong>
                        {q.answer}) {q.options[q.answer as keyof typeof q.options]}
                      </Answer>
                      <Explanation>{q.explanation}</Explanation>
                    </>
                  )}
                </QuestionCard>
              ))}
            </PartSection>
          )}

          {/* Part 6 - 중복 제거 */}
          {toeicData.questions.part6.length > 0 && (
            <PartSection>
              <h2>
                <span className="badge">Part 6</span>
                문장 삽입
              </h2>
              {toeicData.questions.part6.map((q, idx) => (
                <QuestionCard key={`p6-${idx}`}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <QuestionNumber>문제 {idx + 1}</QuestionNumber>
                      <Button
                        onClick={() => handleSavePart6Question(q, idx)}
                        variant="secondary"
                        disabled={savingQuestions.has(`p6-${idx}`)}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      >
                        {savingQuestions.has(`p6-${idx}`) ? '저장 중...' : '💾 저장'}
                      </Button>
                    </div>
                    <SpeakerButton text={q.passage} variant="text" speed="normal" />
                  </div>
                  <Passage>{q.passage}</Passage>
                  <InsertSentence>
                    <div className="label">삽입할 문장</div>
                    <div className="sentence">{q.insertSentence}</div>
                  </InsertSentence>
                  <QuestionText>{q.question}</QuestionText>
                  <OptionsContainer>
                    {Object.entries(q.options).map(([key, value]) => (
                      <OptionButton
                        key={key}
                        $selected={selectedAnswers[`p6-${idx}`] === key}
                        $showAnswer={showAnswers}
                        $isCorrect={showAnswers && key === q.answer}
                        $isWrong={showAnswers && selectedAnswers[`p6-${idx}`] === key && key !== q.answer}
                        onClick={() => handleOptionSelect(`p6-${idx}`, key)}
                        disabled={showAnswers}
                      >
                        <strong>{key})</strong> {value}
                      </OptionButton>
                    ))}
                  </OptionsContainer>
                  {showAnswers && (
                    <>
                      <Answer>
                        <strong>✓ 정답</strong>
                        {q.answer}) {q.options[q.answer as keyof typeof q.options]}
                      </Answer>
                      <Explanation>{q.explanation}</Explanation>
                    </>
                  )}
                </QuestionCard>
              ))}
            </PartSection>
          )}

          {/* Part 7 */}
          {toeicData.questions.part7.length > 0 && (
            <PartSection>
              <h2>
                <span className="badge">Part 7</span>
                독해
              </h2>
              {toeicData.questions.part7.map((q, idx) => (
                <QuestionCard key={`p7-${idx}`}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <QuestionNumber>문제 {idx + 1}</QuestionNumber>
                      <Button
                        onClick={() => handleSavePart7Question(q, idx)}
                        variant="secondary"
                        disabled={savingQuestions.has(`p7-${idx}`)}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      >
                        {savingQuestions.has(`p7-${idx}`) ? '저장 중...' : '💾 저장'}
                      </Button>
                    </div>
                    <SpeakerButton text={q.passage} variant="text" speed="normal" />
                  </div>
                  <Passage>{q.passage}</Passage>
                  <QuestionText>{q.question}</QuestionText>
                  <OptionsContainer>
                    {Object.entries(q.options).map(([key, value]) => (
                      <OptionButton
                        key={key}
                        $selected={selectedAnswers[`p7-${idx}`] === key}
                        $showAnswer={showAnswers}
                        $isCorrect={showAnswers && key === q.answer}
                        $isWrong={showAnswers && selectedAnswers[`p7-${idx}`] === key && key !== q.answer}
                        onClick={() => handleOptionSelect(`p7-${idx}`, key)}
                        disabled={showAnswers}
                      >
                        <strong>{key})</strong> {value}
                      </OptionButton>
                    ))}
                  </OptionsContainer>
                  {showAnswers && (
                    <>
                      <Answer>
                        <strong>✓ 정답</strong>
                        {q.answer}) {q.options[q.answer as keyof typeof q.options]}
                      </Answer>
                      <Explanation>{q.explanation}</Explanation>
                    </>
                  )}
                </QuestionCard>
              ))}
            </PartSection>
          )}

          <ToggleButton onClick={() => setShowAnswers(!showAnswers)}>
            {showAnswers ? '정답 숨기기' : '정답 확인'}
          </ToggleButton>
        </Results>
      )}

      {/* 영작 모드 결과 */}
      {writingData && (
        <Results>
          <SaveAllButton 
            onClick={handleSaveAllQuestions}
            disabled={saveAllLoading}
          >
            {saveAllLoading ? '저장 중...' : '📥 모든 문제 저장하기'}
          </SaveAllButton>

          <PartSection>
            <h2>영작 연습 문제</h2>
            {writingData.questions.map((q, idx) => (
              <WritingQuestionCard key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <TypeBadge $type={q.type}>{getTypeLabel(q.type)}</TypeBadge>
                    <Button
                      onClick={() => handleSaveWritingQuestion(q, idx)}
                      variant="secondary"
                      disabled={savingQuestions.has(`w-${idx}`)}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    >
                      {savingQuestions.has(`w-${idx}`) ? '저장 중...' : '💾 저장'}
                    </Button>
                  </div>
                </div>
                <QuestionNumber>문제 {idx + 1}</QuestionNumber>
                <QuestionText>{q.question}</QuestionText>

                {q.hint && <Hint>{q.hint}</Hint>}

                {/* 답안 입력 섹션 */}
                <WritingAnswerSection>
                  <AnswerLabel>내 답안</AnswerLabel>
                  <AnswerTextarea
                    value={writingAnswers[idx] || ''}
                    onChange={(e) => handleWritingAnswerChange(idx, e.target.value)}
                    placeholder="영어로 답안을 작성하세요..."
                    disabled={showAnswers}
                  />

                  {!showAnswers && (
                    <GradeButton
                      onClick={() => handleGradeAnswer(idx, q.answer)}
                      variant="secondary"
                      disabled={!writingAnswers[idx]?.trim()}
                    >
                      채점하기
                    </GradeButton>
                  )}                  {/* 채점 결과 */}
                  {gradingResults[idx] && !showAnswers && (
                    <GradingResultBox $level={gradingResults[idx].level}>
                      <ScoreDisplay color={getScoreColor(gradingResults[idx].level)}>
                        <div className="score">{gradingResults[idx].score}점</div>
                        <div className="label">/ 100점</div>
                      </ScoreDisplay>
                      <FeedbackText>{gradingResults[idx].feedback}</FeedbackText>
                    </GradingResultBox>
                  )}
                </WritingAnswerSection>

                {/* 모범 답안 */}
                {showAnswers && (
                  <Answer>
                    <strong>✓ 모범 답안</strong>
                    {q.answer}
                  </Answer>
                )}
              </WritingQuestionCard>
            ))}
          </PartSection>

          <ToggleButton onClick={() => setShowAnswers(!showAnswers)}>
            {showAnswers ? '모범 답안 숨기기' : '모범 답안 확인'}
          </ToggleButton>
        </Results>
      )}
    </Container>
  );
}
