import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Card } from "../components/Card";

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

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 4rem;

  p {
    font-size: 1.1rem;
    color: #64748b;
    line-height: 1.7;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 0.95rem;
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 2.5rem;
    gap: 1.25rem;
  }
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;

  h1 {
    font-size: 3rem;
    margin: 0;
    color: #3f56a1;
    font-weight: 800;
    letter-spacing: -0.5px;

    @media (max-width: 768px) {
      font-size: 1.75rem;
    }
  }
`;

const HomeLogoImg = styled.img`
  width: 140px;
  height: 140px;
  object-fit: contain;
  border-radius: 24px;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 16px rgba(59, 130, 246, 0.25));

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
    border-radius: 16px;
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e8eeff 0%, #f0f4ff 100%);
  border-radius: 20px;
  position: relative;
  transition: all 0.3s;
`;

const Icon = styled.div`
  font-size: 3rem;
  transition: transform 0.3s;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

const FeatureCard = styled(Card)`
  position: relative;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border: 2px solid transparent;
  background: white;
  text-align: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.05) 0%,
      rgba(139, 92, 246, 0.05) 100%
    );
    opacity: 0;
    transition: opacity 0.4s;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
    border-color: #3b82f6;

    &::before {
      opacity: 1;
    }
  }

  &:hover ${IconWrapper} {
    background: linear-gradient(135deg, #52f6ff 0%, #6b8ae8 100%);
    transform: rotate(5deg);
  }

  &:hover ${Icon} {
    animation: ${float} 2s ease-in-out infinite;
    filter: drop-shadow(0 4px 8px rgba(255, 255, 255, 0.3));
  }

  &:active {
    transform: translateY(-6px) scale(1.01);
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: #1e40af;
  font-weight: 700;
  transition: color 0.3s;
  position: relative;
  z-index: 1;

  ${FeatureCard}:hover & {
    color: #3b82f6;
  }
`;

const Description = styled.p`
  color: #64748b;
  line-height: 1.7;
  font-size: 0.95rem;
  transition: color 0.3s;
  position: relative;
  z-index: 1;

  ${FeatureCard}:hover & {
    color: #475569;
  }
`;

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: "예문 생성기",
      description: "단어를 입력하면 단어의 예문을 생성해줍니다.",
      path: "/example",
      icon: "📖",
    },
    {
      title: "영어 문제",
      description: "토익 문제나 영작 문제를 생성합니다.",
      path: "/writing",
      icon: "✏️",
    },
    {
      title: "나의 단어장",
      description: "저장한 단어와 예문을 확인하세요.",
      path: "/vocabulary",
      icon: "📚",
    },
  ];

  return (
    <Container>
      <Header>
        <HomeLogoImg src="/logo.png" alt="AI 영어 학습 로고" />
        <TitleRow>
          <h1>AI 영어 학습 도우미</h1>
          <p>AI와 함께 효과적으로 영어를 학습하세요</p>
        </TitleRow>
      </Header>

      <Features>
        {features.map((feature) => (
          <FeatureCard
            key={feature.path}
            onClick={() => navigate(feature.path)}
          >
            <IconWrapper>
              <Icon>{feature.icon}</Icon>
            </IconWrapper>
            <Title>{feature.title}</Title>
            <Description>{feature.description}</Description>
          </FeatureCard>
        ))}
      </Features>
    </Container>
  );
}