import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Loading } from "../components/Loading";
import { ErrorMessage } from "../components/ErrorMessage";
import { 
  apiService, 
  type ExampleResponse,
  type Example 
} from "../services/api";
import { SpeakerButton } from "../components/SpeakerButton";

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

    @media (max-width: 768px) {
      font-size: 1.75rem;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const InputCard = styled(Card)`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  transition: all 0.3s;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.12);
  }

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Results = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  h2 {
    color: #3f56a1;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 700;

    &::before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 1.5rem;
      background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%);
      border-radius: 2px;
    }
  }
`;

const WordInfoCard = styled(Card)`
  border: 3px solid #3b82f6;
  background: white;
  padding: 2.5rem;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.12);
`;

const WordTitle = styled.h3`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  font-weight: 800;
  color: #3f56a1;
  letter-spacing: -1px;

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const WordHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MeaningsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MeaningItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.3s;

  &:hover {
    background: #f0f9ff;
    transform: translateX(8px);
  }

  .number {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.95rem;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }

  .badge {
    background: #eff6ff;
    color: #1e40af;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    border: 2px solid #bfdbfe;
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  .meaning-text {
    color: #475569;
    font-size: 1.05rem;
    flex: 1;
    font-weight: 500;
  }
`;

const ExampleCard = styled(Card)`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s;
  border: 2px solid transparent;

  &:hover {
    transform: translateX(8px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.12);
    border-color: #e0e7ff;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;

    &:hover {
      transform: none;
    }
  }
`;

const ExampleContent = styled.div`
  flex: 1;

  .meaning-badge {
    display: inline-block;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    text-align: center;
    line-height: 24px;
    font-size: 0.8rem;
    font-weight: bold;
    margin-right: 0.75rem;
    vertical-align: middle;
    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
  }

  p {
    line-height: 1.8;
    margin-bottom: 0.75rem;
  }

  .english {
    color: #1e40af;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .korean {
    color: #64748b;
    font-size: 1rem;
  }

  .highlight {
    background: linear-gradient(180deg, transparent 50%, #fef08a 50%);
    font-weight: 700;
    color: #1e40af;
    padding: 0 4px;
    border-radius: 3px;
  }
`;

const SaveButton = styled(Button)`
  flex-shrink: 0;
  align-self: center;

  @media (max-width: 480px) {
    align-self: flex-end;
    width: auto;
  }
`;

const RelatedWordsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const RelatedWordCard = styled(Card) <{ type: "synonym" | "antonym" }>`
  border-left: 4px solid
    ${(props) => (props.type === "synonym" ? "#10b981" : "#ef4444")};
  background: ${(props) => (props.type === "synonym" 
    ? "#f0fdf4" 
    : "#fef2f2")};
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px ${(props) => 
      props.type === "synonym" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"};
  }

  &.empty {
    opacity: 0.6;
    background: #f9fafb;
    border-left-color: #d1d5db;
  }
`;

const RelatedWordHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RelatedWordContent = styled.div`
  .word {
    font-size: 1.5rem;
    font-weight: 800;
    color: #3f56a1;
    margin-bottom: 0.5rem;
    display: flex;              
    align-items: center;       
    gap: 0.75rem;
  }

  .meta {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    color: #64748b;
    margin-bottom: 0.75rem;

    span {
      background: white;
      padding: 0.3rem 0.8rem;
      border-radius: 14px;
      font-weight: 600;
      border: 2px solid rgba(0, 0, 0, 0.05);
    }
  }

  .meaning {
    color: #475569;
    font-size: 1rem;
    line-height: 1.6;
    font-weight: 500;
  }
`;

const InvalidWordMessage = styled.div`
  background: #fef2f2;
  border: 3px solid #fca5a5;
  border-radius: 16px;
  padding: 2.5rem;
  text-align: center;
  color: #991b1b;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.12);

  .icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #dc2626;
    font-weight: 700;
  }

  p {
    color: #7f1d1d;
    line-height: 1.8;
    margin-bottom: 1.5rem;
    font-size: 1.05rem;
  }

  .suggestions {
    font-size: 1rem;
    color: #991b1b;
    margin-top: 1.5rem;

    strong {
      display: block;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    ul {
      list-style: none;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: center;

      li {
        background: white;
        padding: 0.5rem 1.25rem;
        border-radius: 20px;
        border: 2px solid #fca5a5;
        font-weight: 600;
        transition: all 0.3s;

        &:hover {
          background: #fee2e2;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }
      }
    }
  }
`;

const PageDescription = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  color: #64748b;
  font-size: 1.05rem;
  line-height: 1.8;
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid #e2e8f0;

  .highlight {
    color: #3b82f6;
    font-weight: 700;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

export default function ExampleGenerator() {
  const [word, setWord] = useState("");
  const [data, setData] = useState<ExampleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invalidWord, setInvalidWord] = useState(false);
  const [saveLoading, setSaveLoading] = useState<{
    type: 'word' | 'example' | 'synonym' | 'antonym';
    index?: number;
  } | null>(null);
  const [savedWordId, setSavedWordId] = useState<number | null>(null);

  const isEnglishOnly = (text: string): boolean => {
    return /^[a-zA-Z\s]*$/.test(text);
  };

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (isEnglishOnly(newValue) || newValue === "") {
      setWord(newValue);
      setError("");
      setInvalidWord(false);
    } else {
      setError("영어만 입력 가능합니다.");
    }
  };

  const handleGenerate = async () => {
    const trimmedWord = word.trim();

    if (!trimmedWord) {
      setError("단어를 입력해주세요.");
      return;
    }

    if (!isEnglishOnly(trimmedWord)) {
      setError("영어만 입력 가능합니다.");
      return;
    }

    if (trimmedWord.includes(" ")) {
      setError("단어는 공백 없이 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);
    setInvalidWord(false);

    try {
      const response = await apiService.generateExamples(trimmedWord);
      setData(response);
    } catch (err: any) {
      const errorMessage = err.message || "예문 생성에 실패했습니다.";

      if (errorMessage.includes("유효한 영어 단어가 아닙니다")) {
        setInvalidWord(true);
        setError(errorMessage);
      } else if (errorMessage.includes("일시적으로 사용 불가능")) {
        setError(errorMessage);
        alert('AI 서비스 오류: 잠시 후 다시 시도해주세요.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWord = async () => {
    if (!data || !data.word.meanings || data.word.meanings.length === 0) return;

    setSaveLoading({ type: 'word' });
    try {
      const firstMeaning = data.word.meanings[0];
      const response = await apiService.saveWord({
        word: data.word.original,
        partOfSpeech: firstMeaning.partOfSpeech,
        meaning: firstMeaning.meaning
      });
      
      setSavedWordId(response.data.id);
      alert('단어가 저장되었습니다!');
    } catch (err: any) {
      alert(err.message || '저장에 실패했습니다.');
    } finally {
      setSaveLoading(null);
    }
  };

  const handleSaveExample = async (example: Example, index: number) => {
    if (!data) return;

    setSaveLoading({ type: 'example', index });
    try {
      await apiService.saveExample({
        english: example.english,
        korean: example.korean,
        wordId: savedWordId || undefined
      });
      
      alert('예문이 저장되었습니다!');
    } catch (err: any) {
      alert(err.message || '저장에 실패했습니다.');
    } finally {
      setSaveLoading(null);
    }
  };

  const handleSaveRelatedWord = async (type: 'synonym' | 'antonym') => {
    if (!data || !data.relatedWords) return;

    const relatedWord = type === 'synonym' 
      ? data.relatedWords.synonym 
      : data.relatedWords.antonym;

    if (!relatedWord) return;

    setSaveLoading({ type });
    try {
      await apiService.saveWord({
        word: relatedWord.word,
        partOfSpeech: relatedWord.partOfSpeech,
        meaning: relatedWord.meaning
      });
      
      alert(`${type === 'synonym' ? '유의어' : '반의어'}가 저장되었습니다!`);
    } catch (err: any) {
      alert(err.message || '저장에 실패했습니다.');
    } finally {
      setSaveLoading(null);
    }
  };

  const highlightWord = (text: string, targetWord: string) => {
    if (!text || !targetWord) return text;

    const regex = new RegExp(`(\\b${targetWord}\\w*)`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <span key={index} className="highlight">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Container>
      <h1>예문 생성기</h1>
      
      <PageDescription>
        영어 단어를 입력하면 AI가 <span className="highlight">실용적인 예문 3개</span>와<br />
        <span className="highlight">유의어·반의어</span>까지 자동으로 생성해드립니다.
      </PageDescription>

      <InputCard>
        <Input
          value={word}
          onChange={handleWordChange}
          placeholder="영어 단어를 입력하세요 (예: happy)"
          onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
        />
        <Button onClick={handleGenerate} disabled={loading}>
          생성하기
        </Button>
      </InputCard>

      {loading && <Loading />}

      {error && !invalidWord && (
        <ErrorMessage message={error} onClose={() => setError("")} />
      )}

      {invalidWord && (
        <InvalidWordMessage>
          <div className="icon">❌</div>
          <h3>유효하지 않은 단어입니다</h3>
          <p>
            '<strong>{word}</strong>'는 올바른 영어 단어가 아니거나 사전에 없는
            단어입니다.
            <br />
            철자를 확인하고 다시 시도해주세요.
          </p>
          <div className="suggestions">
            <strong>💡 이런 단어들을 시도해보세요:</strong>
            <ul>
              <li>happy</li>
              <li>computer</li>
              <li>beautiful</li>
              <li>learn</li>
              <li>important</li>
            </ul>
          </div>
        </InvalidWordMessage>
      )}

      {data && (
        <Results>
          <Section>
            <WordInfoCard>
              <WordHeader>
                <WordTitle>{data.word.original}</WordTitle>
                <SpeakerButton text={data.word.original} size="large" />
              </WordHeader>
              <MeaningsContainer>
                {data.word.meanings?.map((meaning, index) => (
                  <MeaningItem key={index}>
                    <span className="number">{index + 1}</span>
                    <span className="badge">{meaning.partOfSpeech}</span>
                    <span className="meaning-text">{meaning.meaning}</span>
                  </MeaningItem>
                ))}
              </MeaningsContainer>
              
              <SaveButton
                onClick={handleSaveWord}
                disabled={saveLoading?.type === 'word'}
                style={{ marginTop: '1.5rem', width: '100%' }}
              >
                {saveLoading?.type === 'word' ? '저장 중...' : '💾 단어 저장'}
              </SaveButton>
            </WordInfoCard>
          </Section>

          <Section>
            <h2>예문</h2>
            {data.examples?.map((example, index) => (
              <ExampleCard key={index}>
                <ExampleContent>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <SpeakerButton text={example.english} size="small" />
                    <p className="english" style={{ margin: 0 }}>
                      {example?.english && data?.word?.original
                        ? highlightWord(example.english, data.word.original)
                        : example?.english || ''}
                    </p>
                  </div>
                  <p className="korean">{example?.korean || ''}</p>
                </ExampleContent>
                <SaveButton
                  onClick={() => handleSaveExample(example, index)}
                  variant="secondary"
                  disabled={saveLoading?.type === 'example' && saveLoading?.index === index}
                >
                  {saveLoading?.type === 'example' && saveLoading?.index === index ? '저장 중...' : '💾 저장'}
                </SaveButton>
              </ExampleCard>
            ))}
          </Section>

          <Section>
            <h2>관련 단어</h2>
            <RelatedWordsGrid>
              {data.relatedWords?.synonym && (
                <RelatedWordCard type="synonym">
                  <RelatedWordHeader>
                    <span>💚</span>
                    <span>유의어</span>
                  </RelatedWordHeader>
                  <RelatedWordContent>
                    <div className="word">
                      {data.relatedWords.synonym.word}
                      <SpeakerButton text={data.relatedWords.synonym.word} size="small" />
                    </div>
                    <div className="meta">
                      <span>{data.relatedWords.synonym.partOfSpeech}</span>
                    </div>
                    <div className="meaning">
                      {data.relatedWords.synonym.meaning}
                    </div>
                  </RelatedWordContent>
                  <SaveButton
                    onClick={() => handleSaveRelatedWord('synonym')}
                    variant="secondary"
                    disabled={saveLoading?.type === 'synonym'}
                    style={{ marginTop: '1rem', width: '100%', padding: '0.5rem' }}
                  >
                    {saveLoading?.type === 'synonym' ? '저장 중...' : '💾 저장'}
                  </SaveButton>
                </RelatedWordCard>
              )}

              {data.relatedWords?.antonym && (
                <RelatedWordCard type="antonym">
                  <RelatedWordHeader>
                    <span>❤️</span>
                    <span>반의어</span>
                  </RelatedWordHeader>
                  <RelatedWordContent>
                    <div className="word">
                      {data.relatedWords.antonym.word}
                      <SpeakerButton text={data.relatedWords.antonym.word} size="small" />
                    </div>
                    <div className="meta">
                      <span>{data.relatedWords.antonym.partOfSpeech}</span>
                    </div>
                    <div className="meaning">
                      {data.relatedWords.antonym.meaning}
                    </div>
                  </RelatedWordContent>
                  <SaveButton
                    onClick={() => handleSaveRelatedWord('antonym')}
                    variant="secondary"
                    disabled={saveLoading?.type === 'antonym'}
                    style={{ marginTop: '1rem', width: '100%', padding: '0.5rem' }}
                  >
                    {saveLoading?.type === 'antonym' ? '저장 중...' : '💾 저장'}
                  </SaveButton>
                </RelatedWordCard>
              )}
            </RelatedWordsGrid>
          </Section>
        </Results>
      )}
    </Container>
  );
}