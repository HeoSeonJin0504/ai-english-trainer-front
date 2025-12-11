import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Card } from '../components/Card';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  color: #1e293b;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #1e40af;
  }

  p {
    font-size: 1.2rem;
    color: #64748b;
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(Card)`
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
    border-color: #3b82f6;
  }
`;

const Icon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #1e40af;
`;

const Description = styled.p`
  color: #64748b;
  line-height: 1.6;
`;

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: '예문 생성기',
      description: '단어를 입력하면 단어의 예문을 생성해줍니다.',
      path: '/example',
      icon: '📝'
    },
    {
      title: '영작 문제',
      description: '주제를 입력하면 영작 문제를 생성합니다.',
      path: '/writing',
      icon: '✍️'
    },
    {
      title: '나의 단어장',
      description: '저장한 단어와 예문을 확인하세요.',
      path: '/vocabulary',
      icon: '📚'
    }
  ];

  return (
    <Container>
      <Header>
        <h1>AI 영어 학습 도우미</h1>
        <p>AI와 함께 효과적으로 영어를 학습하세요</p>
      </Header>
      
      <Features>
        {features.map((feature) => (
          <FeatureCard
            key={feature.path}
            onClick={() => navigate(feature.path)}
          >
            <Icon>{feature.icon}</Icon>
            <Title>{feature.title}</Title>
            <Description>{feature.description}</Description>
          </FeatureCard>
        ))}
      </Features>
    </Container>
  );
}