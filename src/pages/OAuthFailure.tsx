import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1.5rem;
  padding: 2rem;
  text-align: center;
`;

const Icon = styled.div`
  font-size: 3rem;
`;

const Title = styled.h2`
  color: #ef4444;
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
`;

const Description = styled.p`
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
`;

const BackButton = styled.button`
  padding: 0.75rem 2rem;
  background: #3f56a1;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #2d4080;
  }
`;

export default function OAuthFailure() {
  const navigate = useNavigate();

  return (
    <Container>
      <Icon>😢</Icon>
      <Title>소셜 로그인 실패</Title>
      <Description>로그인 중 문제가 발생했습니다. 다시 시도해 주세요.</Description>
      <BackButton onClick={() => navigate('/login', { replace: true })}>
        로그인 페이지로 돌아가기
      </BackButton>
    </Container>
  );
}
