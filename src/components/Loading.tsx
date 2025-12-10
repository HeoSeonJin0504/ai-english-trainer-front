import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #1e40af;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  border: 4px solid #dbeafe;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export function Loading() {
  return (
    <LoadingContainer>
      <Spinner />
      <p>생성 중...</p>
    </LoadingContainer>
  );
}
