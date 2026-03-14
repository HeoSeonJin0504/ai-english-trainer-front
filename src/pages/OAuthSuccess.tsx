import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { apiService } from '../services/api';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1.5rem;
  padding: 2rem;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #3f56a1;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Message = styled.p`
  color: #374151;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 1rem;
  font-weight: 600;
`;

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const initAuth = async () => {
      try {
        await apiService.getMe();
        navigate('/', { replace: true });
      } catch {
        setError('로그인 처리 중 오류가 발생했습니다. 로그인 페이지로 이동합니다...');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    initAuth();
  }, [navigate]);

  if (error) {
    return (
      <Container>
        <ErrorText>{error}</ErrorText>
      </Container>
    );
  }

  return (
    <Container>
      <Spinner />
      <Message>로그인 처리 중...</Message>
    </Container>
  );
}
