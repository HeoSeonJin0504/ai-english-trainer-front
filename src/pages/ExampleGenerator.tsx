import { useState } from "react";
import styled from "styled-components";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Loading } from "../components/Loading";
import { ErrorMessage } from "../components/ErrorMessage";
import { apiService, type ExampleResponse } from "../services/api";

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

const RelatedWordCard = styled(Card)<{ type: "synonym" | "antonym" }>`
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

export default function ExampleGenerator() {
  const [word, setWord] = useState("");
  const [data, setData] = useState<ExampleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invalidWord, setInvalidWord] = useState(false);
  const [saveLoading, setSaveLoading] = useState<number | null>(null);

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
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (example: string, index: number) => {
    if (!data) return;

    setSaveLoading(index);
    try {
      await apiService.addWord(data.word.original, [example]);
      alert("단어장에 저장되었습니다!");
    } catch (err: any) {
      alert(err.message || "저장에 실패했습니다.");
    } finally {
      setSaveLoading(null);
    }
  };

  const highlightWord = (text: string, targetWord: string) => {
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
                  <p className="english">
                    {highlightWord(example.english, data.word.original)}
                  </p>
                  <p className="korean">{example.korean}</p>
                </ExampleContent>
                <SaveButton
                  onClick={() =>
                    handleSave(`${example.english} (${example.korean})`, index)
                  }
                  variant="secondary"
                  disabled={saveLoading === index}
                >
                  {saveLoading === index ? "저장 중..." : "저장"}
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
                  <span>유의어</span>
                </RelatedWordHeader>
                <RelatedWordContent>
                  <div className="word">{data.relatedWords.synonym.word}</div>
                  <div className="meta">
                    <span>{data.relatedWords.synonym.partOfSpeech}</span>
                  </div>
                  <div className="meaning">
                    {data.relatedWords.synonym.meaning}
                  </div>
                </RelatedWordContent>
              </RelatedWordCard>

              {/* 반의어 - null이면 아예 렌더링 안함 */}
              {data.relatedWords.antonym && (
                <RelatedWordCard type="antonym">
                  <RelatedWordHeader>
                    <span>❤️</span>
                    <span>반의어</span>
                  </RelatedWordHeader>
                  <RelatedWordContent>
                    <div className="word">{data.relatedWords.antonym.word}</div>
                    <div className="meta">
                      <span>{data.relatedWords.antonym.partOfSpeech}</span>
                    </div>
                    <div className="meaning">
                      {data.relatedWords.antonym.meaning}
                    </div>
                  </RelatedWordContent>
                </RelatedWordCard>
              )}
            </RelatedWordsGrid>
          </Section>
        </Results>
      )}
    </Container>
  );
}
