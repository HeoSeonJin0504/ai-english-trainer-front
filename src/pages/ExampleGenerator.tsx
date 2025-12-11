import { useState } from 'react';
import styled from 'styled-components';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { apiService, type ExampleResponse } from '../services/api';

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

const InputCard = styled(Card)`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Results = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Section = styled.div`
  h2 {
    color: #1e40af;
    margin-bottom: 1rem;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 1.3rem;
      background: #3b82f6;
      border-radius: 2px;
    }
  }
`;

const WordInfoCard = styled(Card)`
  border: 4px solid #3b82f6;
  background: white;
  padding: 2rem;
`;

const WordTitle = styled.h3`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #1e40af;
`;

const WordMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  font-size: 1.1rem;
  color: #475569;

  .badge {
    background: #eff6ff;
    color: #1e40af;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-weight: 500;
    border: 1px solid #bfdbfe;
  }
`;

const ExampleCard = styled(Card)`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ExampleContent = styled.div`
  flex: 1;

  p {
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }

  .english {
    color: #1e40af;
    font-weight: 500;
    font-size: 1.05rem;
  }

  .korean {
    color: #666;
    font-size: 0.95rem;
  }
`;

const SaveButton = styled(Button)`
  flex-shrink: 0;
  align-self: center;
`;

const RelatedWordsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const RelatedWordCard = styled(Card)<{ type: 'synonym' | 'antonym' }>`
  border-left: 4px solid ${props => props.type === 'synonym' ? '#10b981' : '#ef4444'};
  background: ${props => props.type === 'synonym' ? '#f0fdf4' : '#fef2f2'};

  &.empty {
    opacity: 0.6;
    background: #f9fafb;
    border-left-color: #d1d5db;
  }
`;

const RelatedWordHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  color: #666;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const RelatedWordContent = styled.div`
  .word {
    font-size: 1.3rem;
    font-weight: bold;
    color: #1e40af;
    margin-bottom: 0.3rem;
  }

  .meta {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.5rem;

    span {
      background: white;
      padding: 0.2rem 0.6rem;
      border-radius: 12px;
    }
  }

  .meaning {
    color: #333;
    font-size: 0.95rem;
  }
`;

export default function ExampleGenerator() {
  const [word, setWord] = useState('');
  const [data, setData] = useState<ExampleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveLoading, setSaveLoading] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!word.trim()) {
      setError('단어를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setData(null);
    
    try {
      const response = await apiService.generateExamples(word);
      setData(response);
    } catch (err: any) {
      setError(err.message || '예문 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (example: string, index: number) => {
    if (!data) return;
    
    setSaveLoading(index);
    try {
      await apiService.addWord(data.word.original, [example]);
      alert('단어장에 저장되었습니다!');
    } catch (err: any) {
      alert(err.message || '저장에 실패했습니다.');
    } finally {
      setSaveLoading(null);
    }
  };

  return (
    <Container>
      <h1>예문 생성기</h1>
      
      <InputCard>
        <Input
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="단어를 입력하세요 (예: happy)"
          onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <Button onClick={handleGenerate} disabled={loading}>
          생성하기
        </Button>
      </InputCard>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {data && (
        <Results>
          {/* 단어 정보 */}
          <Section>
            <WordInfoCard>
              <WordTitle>{data.word.original}</WordTitle>
              <WordMeta>
                <span className="badge">{data.word.partOfSpeech}</span>
                <span>{data.word.meaning}</span>
              </WordMeta>
            </WordInfoCard>
          </Section>

          {/* 예문 */}
          <Section>
            <h2>예문</h2>
            {data.examples.map((example, index) => (
              <ExampleCard key={index}>
                <ExampleContent>
                  <p className="english">{example.english}</p>
                  <p className="korean">{example.korean}</p>
                </ExampleContent>
                <SaveButton 
                  onClick={() => handleSave(`${example.english} (${example.korean})`, index)} 
                  variant="secondary"
                  disabled={saveLoading === index}
                >
                  {saveLoading === index ? '저장 중...' : '저장'}
                </SaveButton>
              </ExampleCard>
            ))}
          </Section>

          {/* 관련 단어 */}
          <Section>
            <h2>관련 단어</h2>
            <RelatedWordsGrid>
              {/* 유의어 */}
              <RelatedWordCard type="synonym">
                <RelatedWordHeader>
                  <span>💚</span>
                  <span>유의어 (Synonym)</span>
                </RelatedWordHeader>
                <RelatedWordContent>
                  <div className="word">{data.relatedWords.synonym.word}</div>
                  <div className="meta">
                    <span>{data.relatedWords.synonym.partOfSpeech}</span>
                  </div>
                  <div className="meaning">{data.relatedWords.synonym.meaning}</div>
                </RelatedWordContent>
              </RelatedWordCard>

              {/* 반의어 */}
              <RelatedWordCard 
                type="antonym" 
                className={!data.relatedWords.antonym ? 'empty' : ''}
              >
                <RelatedWordHeader>
                  <span>❤️</span>
                  <span>반의어 (Antonym)</span>
                </RelatedWordHeader>
                {data.relatedWords.antonym ? (
                  <RelatedWordContent>
                    <div className="word">{data.relatedWords.antonym.word}</div>
                    <div className="meta">
                      <span>{data.relatedWords.antonym.partOfSpeech}</span>
                    </div>
                    <div className="meaning">{data.relatedWords.antonym.meaning}</div>
                  </RelatedWordContent>
                ) : (
                  <RelatedWordContent>
                    <div className="meaning" style={{ color: '#999' }}>
                      반의어가 없습니다
                    </div>
                  </RelatedWordContent>
                )}
              </RelatedWordCard>
            </RelatedWordsGrid>
          </Section>
        </Results>
      )}
    </Container>
  );
}
