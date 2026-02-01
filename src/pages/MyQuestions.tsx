import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { apiService, type SavedQuestionDto, type ToeicPart } from '../services/api';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${fadeIn} 0.5s ease-out;

  h1 {
    color: #3f56a1;
    margin-bottom: 1rem;
    text-align: center;
    font-size: 2.5rem;
    font-weight: 800;
    letter-spacing: -0.5px;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  color: ${props => props.$active ? '#3b82f6' : '#64748b'};
  font-weight: ${props => props.$active ? '600' : '500'};
  font-size: 1rem;
  border-bottom: 2px solid ${props => props.$active ? '#3b82f6' : 'transparent'};
  margin-bottom: -2px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #3b82f6;
  }
`;

const FilterSection = styled(Card)`
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  transition: all 0.3s;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.12);
  }
`;

const PartFilter = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PartButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.$active ? '#3b82f6' : '#e5e7eb'};
  background: ${props => props.$active ? '#eff6ff' : 'white'};
  color: ${props => props.$active ? '#3b82f6' : '#64748b'};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`;

const SearchRow = styled.div`
  display: flex;
  gap: 1rem;
  flex: 1;
  min-width: 300px;
`;

const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const QuestionCard = styled(Card)`
  padding: 1.5rem;
  transition: all 0.3s;

  &:hover {
    border-color: #e0e7ff;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
    transform: translateY(-2px);
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
`;

const QuestionMeta = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;

  .badge {
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .mode {
    background: #dbeafe;
    color: #1e40af;
  }

  .part {
    background: #fef3c7;
    color: #92400e;
  }

  .topic {
    background: #f0fdf4;
    color: #065f46;
  }
`;

const QuestionContent = styled.div`
  margin-bottom: 1rem;

  .question-text {
    font-size: 1.15rem;
    color: #1e40af;
    font-weight: 500;
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  .passage {
    background: #f9fafb;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    line-height: 1.8;
    font-size: 1.05rem;
    color: #333;
    white-space: pre-wrap;
  }

  .insert-sentence {
    font-size: 1.05rem;  
    background: #fef3c7;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border-left: 4px solid #f59e0b;
    
    .label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #92400e;
      margin-bottom: 0.5rem;
    }
  }

  .hint {
    background: #fef3c7;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-top: 0.5rem;
    color: #92400e;
    font-size: 0.9rem;
    
    &::before {
      content: '💡 힌트: ';
      font-weight: 600;
    }
  }
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Option = styled.div`
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 6px;
  color: #333;
`;

const AnswerSection = styled.div`
  padding: 1rem;
  background: white;
  border: 2px solid #10b981;
  border-radius: 8px;
  margin-bottom: 0.5rem;

  strong {
    color: #10b981;
    margin-right: 0.5rem;
  }
`;

const Explanation = styled.div`
  padding: 1rem;
  background: white;
  border: 2px solid #3b82f6;
  border-radius: 6px;
  color: #1e40af;
  font-size: 0.9rem;
  
  &::before {
    content: '💡 해설: ';
    font-weight: 600;
    color: #3b82f6;
  }
`;

const DateText = styled.div`
  text-align: right;
  color: #94a3b8;
  font-size: 0.85rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
`;

const EmptyCard = styled(Card)`
  text-align: center;
  padding: 3rem;

  p {
    margin: 0.5rem 0;
    color: #666;
  }
`;

export default function MyQuestions() {
  const [activeTab, setActiveTab] = useState<'all' | 'toeic' | 'writing'>('all');
  const [selectedPart, setSelectedPart] = useState<ToeicPart | 'all'>('all');
  const [questions, setQuestions] = useState<SavedQuestionDto[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<SavedQuestionDto[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [counts, setCounts] = useState({ all: 0, toeic: 0, writing: 0 });

  useEffect(() => {
    loadData();
    loadCounts();
  }, [activeTab, selectedPart]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      let data: SavedQuestionDto[];
      
      if (activeTab === 'toeic') {
        if (selectedPart !== 'all') {
          data = await apiService.getToeicQuestionsByPart(selectedPart);
        } else {
          data = await apiService.getToeicQuestions();
        }
      } else if (activeTab === 'writing') {
        data = await apiService.getWritingQuestions();
      } else {
        data = await apiService.getQuestions();
      }
      
      setQuestions(data);
      setFilteredQuestions(data);
    } catch (err: any) {
      setError(err.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadCounts = async () => {
    try {
      const [allCount, toeicCount, writingCount] = await Promise.all([
        apiService.getQuestionsCount(),
        apiService.getToeicQuestionsCount(),
        apiService.getWritingQuestionsCount()
      ]);
      setCounts({ all: allCount, toeic: toeicCount, writing: writingCount });
    } catch (err: any) {
      console.error('개수 조회 실패:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      setFilteredQuestions(questions);
      return;
    }

    setLoading(true);
    try {
      const results = await apiService.searchQuestions(searchKeyword);
      setFilteredQuestions(results);
    } catch (err: any) {
      setError(err.message || '검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await apiService.deleteQuestion(id);
        loadData();
        loadCounts();
      } catch (err: any) {
        alert(err.message || '삭제에 실패했습니다.');
      }
    }
  };

  return (
    <Container>
      <h1>저장된 문제</h1>

      <TabContainer>
        <Tab $active={activeTab === 'all'} onClick={() => { setActiveTab('all'); setSelectedPart('all'); }}>
          전체 ({counts.all})
        </Tab>
        <Tab $active={activeTab === 'toeic'} onClick={() => { setActiveTab('toeic'); setSelectedPart('all'); }}>
          토익 ({counts.toeic})
        </Tab>
        <Tab $active={activeTab === 'writing'} onClick={() => { setActiveTab('writing'); setSelectedPart('all'); }}>
          영작 ({counts.writing})
        </Tab>
      </TabContainer>

      <FilterSection>
        {activeTab === 'toeic' && (
          <PartFilter>
            <PartButton $active={selectedPart === 'all'} onClick={() => setSelectedPart('all')}>
              전체
            </PartButton>
            <PartButton $active={selectedPart === 'PART5'} onClick={() => setSelectedPart('PART5')}>
              Part 5
            </PartButton>
            <PartButton $active={selectedPart === 'PART6'} onClick={() => setSelectedPart('PART6')}>
              Part 6
            </PartButton>
            <PartButton $active={selectedPart === 'PART7'} onClick={() => setSelectedPart('PART7')}>
              Part 7
            </PartButton>
          </PartFilter>
        )}

        <SearchRow>
          <Input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="주제로 검색..."
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch}>검색</Button>
        </SearchRow>
      </FilterSection>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {!loading && filteredQuestions.length === 0 ? (
        <EmptyCard>
          {searchKeyword ? (
            <>
              <p>'{searchKeyword}'에 대한 검색 결과가 없습니다.</p>
              <p>다른 검색어를 시도해보세요.</p>
            </>
          ) : (
            <>
              <p>저장된 문제가 없습니다.</p>
              <p>문제 생성기에서 문제를 저장해보세요!</p>
            </>
          )}
        </EmptyCard>
      ) : (
        <QuestionList>
          {filteredQuestions.map((q) => (
            <QuestionCard key={q.id}>
              <QuestionHeader>
                <QuestionMeta>
                  <span className="badge mode">{q.mode === 'TOEIC' ? '토익' : '영작'}</span>
                  {q.toeicPart && <span className="badge part">{q.toeicPart}</span>}
                  {q.writingType && <span className="badge part">{q.writingType}</span>}
                  <span className="badge topic">📝 {q.topic}</span>
                </QuestionMeta>
                <Button onClick={() => handleDelete(q.id)} variant="danger" style={{ padding: '0.5rem 1rem' }}>
                  삭제
                </Button>
              </QuestionHeader>

              <QuestionContent>
                {q.passage && <div className="passage">{q.passage}</div>}
                {q.insertSentence && (
                  <div className="insert-sentence">
                    <div className="label">삽입할 문장</div>
                    {q.insertSentence}
                  </div>
                )}
                <div className="question-text">{q.question}</div>
                {q.hint && <div className="hint">{q.hint}</div>}
              </QuestionContent>

              {q.options && (
                <Options>
                  {Object.entries(q.options).map(([key, value]) => (
                    <Option key={key}>
                      <strong>{key})</strong> {value}
                    </Option>
                  ))}
                </Options>
              )}

              <AnswerSection>
                <strong>✓ 정답:</strong>
                {q.options ? `${q.answer}) ${q.options[q.answer as keyof typeof q.options]}` : q.answer}
              </AnswerSection>

              {q.explanation && <Explanation>{q.explanation}</Explanation>}

              <DateText>
                {new Date(q.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </DateText>
            </QuestionCard>
          ))}
        </QuestionList>
      )}
    </Container>
  );
}
