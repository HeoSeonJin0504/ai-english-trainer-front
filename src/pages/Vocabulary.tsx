import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { SpeakerButton } from '../components/SpeakerButton';
import { apiService, type WordDto, type ExampleDto } from '../services/api';

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
  max-width: 900px;
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

const SearchSection = styled(Card)`
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  transition: all 0.3s;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.12);
  }
`;
const SearchInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 0.5rem;

  .count {
    color: #666;
    font-size: 0.95rem;

    strong {
      color: #3b82f6;
      font-size: 1.1rem;
    }
  }

  .clear {
    color: #3b82f6;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    text-decoration: underline;

    &:hover {
      color: #2563eb;
    }
  }
`;

const EmptyCard = styled(Card)`
  text-align: center;
  padding: 3rem;

  p {
    margin: 0.5rem 0;
    color: #666;
  }
`;

const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DeleteButton = styled(Button)`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  flex-shrink: 0;
`;

const DateText = styled.p`
  color: #94a3b8;
  font-size: 0.85rem;
  text-align: right;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
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
  font-weight: ${props => props.$active ? '700' : '500'};
  font-size: 1rem;
  border-bottom: 3px solid ${props => props.$active ? '#3b82f6' : 'transparent'};
  margin-bottom: -2px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: #3b82f6;
    background: #f8fafc;
  }
`;

const WordCard = styled(Card)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  min-height: 140px;
  transition: all 0.3s;

  &:hover {
    border-color: #e0e7ff;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
    transform: translateY(-2px);
  }
`;

const WordContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .word-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .word-title {
    font-size: 2rem;
    font-weight: bold;
    color: #1e40af;
    line-height: 1;
  }

  .word-meta {
    display: flex;
    gap: 0.75rem;
    align-items: center;

    .badge {
      background: #eff6ff;
      color: #1e40af;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      border: 1px solid #bfdbfe;
    }

    .meaning {
      color: #475569;
      font-size: 1rem;
    }
  }
`;

const WordFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: auto;
  padding-top: 1rem;

  .date-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .label {
      color: #64748b;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .date {
      color: #94a3b8;
      font-size: 0.85rem;
    }
  }
`;

const ExampleCard = styled(Card)`
  padding: 2rem;
  background: #f8fafc;
  border-left: 3px solid #3b82f6;
  display: flex;
  flex-direction: column;
  min-height: 140px;
  transition: all 0.3s;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
    transform: translateY(-2px);
  }
`;

const ExampleContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .english-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .english {
    color: #1e40af;
    font-weight: 600;
    font-size: 1.5rem;
    line-height: 1.5;
  }

  .korean {
    color: #64748b;
    font-size: 1.05rem;
    padding-left: 2rem;
    line-height: 1.6;
  }
`;

const ExampleFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;

  .left-info {
    display: flex;
    align-items: center;
    gap: 1rem;

    .linked-word {
      padding: 0.4rem 0.8rem;
      background: white;
      border-radius: 6px;
      font-size: 0.85rem;
      color: #64748b;
      border: 1px solid #e5e7eb;

      strong {
        color: #1e40af;
      }
    }

    .date-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .label {
        color: #64748b;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .date {
        color: #94a3b8;
        font-size: 0.85rem;
      }
    }
  }
`;

export default function Vocabulary() {
  const [activeTab, setActiveTab] = useState<'words' | 'examples'>('words');
  const [words, setWords] = useState<WordDto[]>([]);
  const [examples, setExamples] = useState<ExampleDto[]>([]);
  const [filteredWords, setFilteredWords] = useState<WordDto[]>([]);
  const [filteredExamples, setFilteredExamples] = useState<ExampleDto[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [wordsCount, setWordsCount] = useState(0);
  const [examplesCount, setExamplesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
    loadCounts();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'words') {
        const data = await apiService.getWords();
        setWords(data);
        setFilteredWords(data);
      } else {
        const data = await apiService.getExamples();
        setExamples(data);
        setFilteredExamples(data);
      }
    } catch (err: any) {
      setError(err.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadCounts = async () => {
    try {
      const [wCount, eCount] = await Promise.all([
        apiService.getWordsCount(),
        apiService.getExamplesCount()
      ]);
      setWordsCount(wCount);
      setExamplesCount(eCount);
    } catch (err: any) {
      console.error('개수 조회 실패:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      if (activeTab === 'words') {
        setFilteredWords(words);
      } else {
        setFilteredExamples(examples);
      }
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (activeTab === 'words') {
        const results = await apiService.searchWords(searchKeyword);
        setFilteredWords(results);
      } else {
        const results = await apiService.searchExamples(searchKeyword);
        setFilteredExamples(results);
      }
    } catch (err: any) {
      setError(err.message || '검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    if (activeTab === 'words') {
      setFilteredWords(words);
    } else {
      setFilteredExamples(examples);
    }
  };

  const handleDeleteWord = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await apiService.deleteWord(id);
        loadData();
        loadCounts();
      } catch (err: any) {
        alert(err.message || '삭제에 실패했습니다.');
      }
    }
  };

  const handleDeleteExample = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await apiService.deleteExample(id);
        loadData();
        loadCounts();
      } catch (err: any) {
        alert(err.message || '삭제에 실패했습니다.');
      }
    }
  };

  return (
    <Container>
      <h1>나의 단어장</h1>
      
      <TabContainer>
        <Tab 
          $active={activeTab === 'words'} 
          onClick={() => setActiveTab('words')}
        >
          단어 ({wordsCount})
        </Tab>
        <Tab 
          $active={activeTab === 'examples'} 
          onClick={() => setActiveTab('examples')}
        >
          예문 ({examplesCount})
        </Tab>
      </TabContainer>

      <SearchSection>
        <Input
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder={activeTab === 'words' ? '단어 검색...' : '예문 검색...'}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch}>검색</Button>
      </SearchSection>

      {searchKeyword && (
        <SearchInfo>
          <div className="count">
            검색 결과: <strong>
              {activeTab === 'words' ? filteredWords.length : filteredExamples.length}
            </strong>개
          </div>
          <button className="clear" onClick={handleClearSearch}>
            검색 초기화
          </button>
        </SearchInfo>
      )}

      {loading && <Loading />}
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      
      {!loading && (
        <>
          {activeTab === 'words' ? (
            filteredWords.length === 0 ? (
              <EmptyCard>
                {searchKeyword ? (
                  <>
                    <p>'{searchKeyword}'에 대한 검색 결과가 없습니다.</p>
                    <p>다른 단어로 검색해보세요.</p>
                  </>
                ) : (
                  <>
                    <p>저장된 단어가 없습니다.</p>
                    <p>예문 생성기에서 단어를 저장해보세요!</p>
                  </>
                )}
              </EmptyCard>
            ) : (
              <Items>
                {filteredWords.map((word) => (
                  <WordCard key={word.id}>
                    <WordContent>
                      <div className="word-section">
                        <div className="word-title">{word.word}</div>
                        <SpeakerButton text={word.word} size="small" />
                      </div>
                      <div className="word-meta">
                        <span className="badge">{word.partOfSpeech}</span>
                        <span className="meaning">{word.meaning}</span>
                      </div>
                    </WordContent>
                    <WordFooter>
                      <div className="date-info">
                        <span className="label">저장일:</span>
                        <span className="date">
                          {new Date(word.createdAt).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <DeleteButton 
                        onClick={() => handleDeleteWord(word.id)}
                        variant="danger"
                      >
                        삭제
                      </DeleteButton>
                    </WordFooter>
                  </WordCard>
                ))}
              </Items>
            )
          ) : (
            filteredExamples.length === 0 ? (
              <EmptyCard>
                {searchKeyword ? (
                  <>
                    <p>'{searchKeyword}'에 대한 검색 결과가 없습니다.</p>
                    <p>다른 검색어를 시도해보세요.</p>
                  </>
                ) : (
                  <>
                    <p>저장된 예문이 없습니다.</p>
                    <p>예문 생성기에서 예문을 저장해보세요!</p>
                  </>
                )}
              </EmptyCard>
            ) : (
              <Items>
                {filteredExamples.map((example) => (
                  <ExampleCard key={example.id}>
                    <ExampleContent>
                      <div className="english-row">
                        <div className="english">{example.english}</div>
                        <SpeakerButton text={example.english} size="small" />
                      </div>
                      <div className="korean">{example.korean}</div>
                    </ExampleContent>
                    <ExampleFooter>
                      <div className="left-info">
                        {example.word && (
                          <div className="linked-word">
                            연결된 단어: <strong>{example.word.word}</strong> ({example.word.partOfSpeech})
                          </div>
                        )}
                        <div className="date-info">
                          <span className="label">저장일:</span>
                          <span className="date">
                            {new Date(example.createdAt).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      <DeleteButton 
                        onClick={() => handleDeleteExample(example.id)}
                        variant="danger"
                      >
                        삭제
                      </DeleteButton>
                    </ExampleFooter>
                  </ExampleCard>
                ))}
              </Items>
            )
          )}
        </>
      )}
    </Container>
  );
}