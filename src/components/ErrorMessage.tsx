import styled from 'styled-components';

const ErrorContainer = styled.div`
  background: #fed7d7;
  color: #c53030;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #c53030;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

export function ErrorMessage({ message, onClose }: ErrorMessageProps) {
  return (
    <ErrorContainer>
      <p>{message}</p>
      <CloseButton onClick={onClose}>×</CloseButton>
    </ErrorContainer>
  );
}
