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

const Results = styled.div`
  margin-top: 2rem;

  h2 {
    color: #1e40af;
    margin-bottom: 1rem;
  }
`;

const ExampleCard = styled(Card)`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  p {
    flex: 1;
    line-height: 1.6;
  }
`;

export default function ExampleGenerator() {
  const [word, setWord] = useState('');
  const [examples, setExamples] = useState<string[]>([]);
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
    
    try {
      const data = await apiService.generateExamples(word);
      console.log('받은 데이터:', data); // 디버깅용
      
      // examples 배열 처리
      const processedExamples = (data.examples || [])
        .map((ex: string) => ex.trim())
        .filter((ex: string) => ex.length > 0)
        .map((ex: string) => {
          // 번호 제거 (예: "1. ", "1) " 등)
          return ex.replace(/^\d+[\.\)]\s*/, '');
        });
      
      console.log('처리된 예문:', processedExamples); // 디버깅용
      setExamples(processedExamples);
      
      if (processedExamples.length === 0) {
        setError('예문을 생성하지 못했습니다. 다시 시도해주세요.');
      }
    } catch (err: any) {
      console.error('에러 발생:', err); // 디버깅용
      setError(err.message || '예문 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (example: string, index: number) => {
    setSaveLoading(index);
    try {
      await apiService.addWord(word, [example]);
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
          placeholder="단어를 입력하세요 (예: apple)"
          onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <Button onClick={handleGenerate} disabled={loading}>
          예문 생성
        </Button>
      </InputCard>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      {examples.length > 0 && (
        <Results>
          <h2>생성된 예문</h2>
          {examples.map((example, index) => (
            <ExampleCard key={index}>
              <p>{example}</p>
              <Button 
                onClick={() => handleSave(example, index)} 
                variant="secondary"
                disabled={saveLoading === index}
              >
                {saveLoading === index ? '저장 중...' : '단어장에 저장'}
              </Button>
            </ExampleCard>
          ))}
        </Results>
      )}
    </Container>
  );
}
