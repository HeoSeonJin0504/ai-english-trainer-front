import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { SpeakerButton } from '../components/SpeakerButton';
import { apiService, type WordDto, type ExampleDto } from '../services/api';

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

const SearchSection = styled(Card)`
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
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

const ItemCard = styled(Card)`
  padding: 1.5rem;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
`;

const WordSection = styled.div`
  flex: 1;
`;

const WordTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  h3 {
    color: #1e40af;
    font-size: 1.8rem;
    margin: 0;
    font-weight: bold;
  }
`;

const MeaningsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const MeaningItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .badge {
    background: #eff6ff;
    color: #1e40af;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    border: 1px solid #bfdbfe;
    flex-shrink: 0;
  }

  .meaning {
    color: #475569;
    font-size: 0.95rem;
  }
`;

const DeleteButton = styled(Button)`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  flex-shrink: 0;
`;

const ExamplesSection = styled.div`
  margin-bottom: 1rem;

  h4 {
    color: #64748b;
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }
`;

const Example = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  border-left: 3px solid #3b82f6;
  
  .example-row {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .english {
    color: #1e40af;
    font-weight: 500;
    flex: 1;
    line-height: 1.6;
  }
  
  .korean {
    color: #64748b;
    font-size: 0.95rem;
    padding-left: 2rem;
    line-height: 1.5;
  }
`;

const RelatedWordsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  h4 {
    grid-column: 1 / -1;
    color: #64748b;
    font-size: 0.9rem;
    margin-bottom: 0;
    font-weight: 600;
    text-transform: uppercase;
  }
`;

const RelatedWordBox = styled.div<{ type: 'synonym' | 'antonym' }>`
  background: ${props => props.type === 'synonym' ? '#f0fdf4' : '#fef2f2'};
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid ${props => props.type === 'synonym' ? '#10b981' : '#ef4444'};

  .label {
    font-size: 0.8rem;
    color: ${props => props.type === 'synonym' ? '#065f46' : '#991b1b'};
    font-weight: 600;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
  }

  .word-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .word {
    color: #1e40af;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .pos {
    color: #64748b;
    font-size: 0.85rem;
  }

  .meaning {
    color: #475569;
    font-size: 0.9rem;
  }
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

const WordCard = styled(Card)`
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const WordContent = styled.div`
  flex: 1;

  .word-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .word-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #1e40af;
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
      font-size: 0.95rem;
    }
  }
`;

const ExampleCard = styled(Card)`
  padding: 1.25rem;
  background: #f8fafc;
  border-left: 3px solid #3b82f6;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const ExampleContent = styled.div`
  flex: 1;

  .english-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .english {
    color: #1e40af;
    font-weight: 500;
    line-height: 1.6;
  }

  .korean {
    color: #64748b;
    font-size: 0.95rem;
    padding-left: 2rem;
    line-height: 1.5;
  }

  .linked-word {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: white;
    border-radius: 6px;
    font-size: 0.85rem;
    color: #64748b;

    strong {
      color: #1e40af;
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
                      <div className="word-row">
                        <div className="word-title">{word.word}</div>
                        <SpeakerButton text={word.word} size="large" />
                      </div>
                      <div className="word-meta">
                        <span className="badge">{word.partOfSpeech}</span>
                        <span className="meaning">{word.meaning}</span>
                      </div>
                      <DateText>
                        {new Date(word.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </DateText>
                    </WordContent>
                    <DeleteButton 
                      onClick={() => handleDeleteWord(word.id)}
                      variant="danger"
                    >
                      삭제
                    </DeleteButton>
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
                        <SpeakerButton text={example.english} size="small" />
                        <div className="english">{example.english}</div>
                      </div>
                      <div className="korean">{example.korean}</div>
                      {example.word && (
                        <div className="linked-word">
                          연결된 단어: <strong>{example.word.word}</strong> ({example.word.partOfSpeech})
                        </div>
                      )}
                      <DateText>
                        {new Date(example.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </DateText>
                    </ExampleContent>
                    <DeleteButton 
                      onClick={() => handleDeleteExample(example.id)}
                      variant="danger"
                    >
                      삭제
                    </DeleteButton>
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
