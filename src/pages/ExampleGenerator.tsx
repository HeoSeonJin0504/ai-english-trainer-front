import { useState } from "react";
import styled from "styled-components";
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
      content: "";
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
  margin-bottom: 1rem;
  font-weight: bold;
  color: #1e40af;
`;
const WordHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MeaningsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const MeaningItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;

  .number {
    background: #3b82f6;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  .badge {
    background: #eff6ff;
    color: #1e40af;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-weight: 500;
    border: 1px solid #bfdbfe;
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  .meaning-text {
    color: #475569;
    font-size: 1.05rem;
    flex: 1;
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

  .meaning-badge {
    display: inline-block;
    background: #3b82f6;
    color: white;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    text-align: center;
    line-height: 22px;
    font-size: 0.8rem;
    font-weight: bold;
    margin-right: 0.5rem;
    vertical-align: middle;
  }

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

  .highlight {
    background: linear-gradient(180deg, transparent 50%, #fef08a 50%);
    font-weight: 600;
    color: #1e40af;
    padding: 0 2px;
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

const RelatedWordCard = styled(Card) <{ type: "synonym" | "antonym" }>`
  border-left: 4px solid
    ${(props) => (props.type === "synonym" ? "#10b981" : "#ef4444")};
  background: ${(props) => (props.type === "synonym" ? "#f0fdf4" : "#fef2f2")};

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
    display: flex;              
    align-items: center;       
    gap: 0.5rem;
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

const InvalidWordMessage = styled.div`
  background: #fef2f2;
  border: 2px solid #fca5a5;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  color: #991b1b;

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #dc2626;
  }

  p {
    color: #7f1d1d;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .suggestions {
    font-size: 0.9rem;
    color: #991b1b;
    margin-top: 1rem;

    strong {
      display: block;
      margin-bottom: 0.5rem;
    }

    ul {
      list-style: none;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;

      li {
        background: white;
        padding: 0.3rem 0.8rem;
        border-radius: 8px;
        border: 1px solid #fca5a5;
      }
    }
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

  // 영어 문자만 허용하는 함수
  const isEnglishOnly = (text: string): boolean => {
    return /^[a-zA-Z\s]*$/.test(text);
  };

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // 영어와 공백만 허용
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

    // 영어 검증
    if (!isEnglishOnly(trimmedWord)) {
      setError("영어만 입력 가능합니다.");
      return;
    }

    // 공백 포함 여부 확인
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

      // 유효하지 않은 단어인 경우
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

  // 단어 저장 (meanings 배열의 첫 번째 항목만 저장)
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

  // 예문 저장 (개별)
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

  // 유의어/반의어 저장
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
    // text가 undefined이거나 빈 값일 경우 처리
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
          {/* 단어 정보 */}
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
              
              {/* 단어 저장 버튼 */}
              <SaveButton
                onClick={handleSaveWord}
                disabled={saveLoading?.type === 'word'}
                style={{ marginTop: '1rem', width: '100%' }}
              >
                {saveLoading?.type === 'word' ? '저장 중...' : '단어 저장'}
              </SaveButton>
            </WordInfoCard>
          </Section>

          {/* 예문 */}
          <Section>
            <h2>예문</h2>
            {data.examples?.map((example, index) => (
              <ExampleCard key={index}>
                <ExampleContent>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
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
                  {saveLoading?.type === 'example' && saveLoading?.index === index ? '저장 중...' : '저장'}
                </SaveButton>
              </ExampleCard>
            ))}
          </Section>

          {/* 관련 단어 */}
          <Section>
            <h2>관련 단어</h2>
            <RelatedWordsGrid>
              {/* 유의어 */}
              {data.relatedWords?.synonym && (
                <RelatedWordCard type="synonym">
                  <RelatedWordHeader>
                    <span>💚</span>
                    <span>유의어</span>
                  </RelatedWordHeader>
                  <RelatedWordContent>
                    <div className="word">
                      {data.relatedWords.synonym.word}
                      <SpeakerButton text={data.relatedWords.synonym.word} size="small" />  {/* ✅ 추가 */}
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
                    style={{ marginTop: '0.75rem', width: '100%', padding: '0.5rem' }}
                  >
                    {saveLoading?.type === 'synonym' ? '저장 중...' : '저장'}
                  </SaveButton>
                </RelatedWordCard>
              )}

              {/* 반의어 */}
              {data.relatedWords?.antonym && (
                <RelatedWordCard type="antonym">
                  <RelatedWordHeader>
                    <span>❤️</span>
                    <span>반의어</span>
                  </RelatedWordHeader>
                  <RelatedWordContent>
                    <div className="word">
                      {data.relatedWords.antonym.word}
                      <SpeakerButton text={data.relatedWords.antonym.word} size="small" />  {/* ✅ 추가 */}
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
                    style={{ marginTop: '0.75rem', width: '100%', padding: '0.5rem' }}
                  >
                    {saveLoading?.type === 'antonym' ? '저장 중...' : '저장'}
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
