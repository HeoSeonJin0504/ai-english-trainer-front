import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { getVocabulary, removeFromVocabulary, type VocabularyItem } from '../utils/vocabulary';

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

  h3 {
    color: #3b82f6;
    font-size: 1.3rem;
  }
`;

const DeleteButton = styled(Button)`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
`;

const Example = styled.p`
  color: #333;
  line-height: 1.6;
  margin-bottom: 0.5rem;
`;

const DateText = styled.p`
  color: #999;
  font-size: 0.9rem;
`;

export default function Vocabulary() {
  const [items, setItems] = useState<VocabularyItem[]>([]);

  useEffect(() => {
    loadVocabulary();
  }, []);

  const loadVocabulary = () => {
    const vocab = getVocabulary();
    setItems(vocab);
  };

  const handleDelete = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      removeFromVocabulary(id);
      loadVocabulary();
    }
  };

  return (
    <Container>
      <h1>나의 단어장</h1>
      
      {items.length === 0 ? (
        <EmptyCard>
          <p>저장된 단어가 없습니다.</p>
          <p>예문 생성기에서 단어를 저장해보세요!</p>
        </EmptyCard>
      ) : (
        <Items>
          {items.map((item) => (
            <ItemCard key={item.id}>
              <ItemHeader>
                <h3>{item.word}</h3>
                <DeleteButton 
                  onClick={() => handleDelete(item.id)}
                  variant="danger"
                >
                  삭제
                </DeleteButton>
              </ItemHeader>
              <Example>{item.example}</Example>
              <DateText>
                {new Date(item.date).toLocaleDateString('ko-KR')}
              </DateText>
            </ItemCard>
          ))}
        </Items>
      )}
    </Container>
  );
}
