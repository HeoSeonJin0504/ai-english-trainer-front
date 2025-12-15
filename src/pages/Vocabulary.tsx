import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { SpeakerButton } from '../components/SpeakerButton';
import { apiService, type Word } from '../services/api';

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
  gap: 1rem;
`;

const ItemCard = styled(Card)`
  padding: 1.5rem;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const WordTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  h3 {
    color: #3b82f6;
    font-size: 1.3rem;
    margin: 0;
  }
`;

const PartOfSpeechBadge = styled.span`
  display: inline-block;
  background: #eff6ff;
  color: #1e40af;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #bfdbfe;
  margin-right: 0.5rem;
  margin-top: 0.5rem;
`;

const DeleteButton = styled(Button)`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
`;

const Example = styled.div`
  color: #333;
  line-height: 1.6;
  margin-bottom: 0.5rem;
  
  .example-row {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }
  
  .english {
    color: #1e40af;
    font-weight: 500;
    flex: 1;
  }
  
  .korean {
    color: #666;
    font-size: 0.95rem;
    padding-left: 2rem;
  }
`;

const DateText = styled.p`
  color: #999;
  font-size: 0.9rem;
`;

export default function Vocabulary() {
  const [items, setItems] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadVocabulary();
  }, []);

  const loadVocabulary = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.getWords();
      setItems(data);
    } catch (err: any) {
      setError(err.message || '단어장을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await apiService.deleteWord(id);
        loadVocabulary();
      } catch (err: any) {
        alert(err.message || '삭제에 실패했습니다.');
      }
    }
  };

  return (
    <Container>
      <h1>나의 단어장</h1>
      
      {loading && <Loading />}
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}
      
      {!loading && items.length === 0 ? (
        <EmptyCard>
          <p>저장된 단어가 없습니다.</p>
          <p>예문 생성기에서 단어를 저장해보세요!</p>
        </EmptyCard>
      ) : (
        <Items>
          {items.map((item) => (
            <ItemCard key={item.id}>
              <ItemHeader>
                <div>
                  <WordTitleSection>
                    <h3>{item.word}</h3>
                    <SpeakerButton text={item.word} size="small" />
                  </WordTitleSection>
                  <div>
                    {item.partOfSpeech?.map((pos, idx) => (
                      <PartOfSpeechBadge key={idx}>{pos}</PartOfSpeechBadge>
                    ))}
                  </div>
                </div>
                <DeleteButton 
                  onClick={() => handleDelete(item.id)}
                  variant="danger"
                >
                  삭제
                </DeleteButton>
              </ItemHeader>
              {item.examples?.map((example, idx) => (
                <Example key={idx}>
                  <div className="example-row">
                    <SpeakerButton text={example.english} size="small" />
                    <span className="english">{example.english}</span>
                  </div>
                  <div className="korean">{example.korean}</div>
                </Example>
              ))}
              <DateText>
                {new Date(item.createdAt).toLocaleDateString('ko-KR')}
              </DateText>
            </ItemCard>
          ))}
        </Items>
      )}
    </Container>
  );
}
