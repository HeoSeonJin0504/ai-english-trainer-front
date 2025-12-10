import { type ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button<{ $variant: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s;
  cursor: pointer;
  background: ${props => {
    switch (props.$variant) {
      case 'secondary': return '#10b981';
      case 'danger': return '#ef4444';
      default: return '#3b82f6';
    }
  }};
  color: white;

  &:hover:not(:disabled) {
    background: ${props => {
      switch (props.$variant) {
        case 'secondary': return '#059669';
        case 'danger': return '#dc2626';
        default: return '#2563eb';
      }
    }};
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ 
  children, 
  variant = 'primary', 
  ...props 
}: ButtonProps) {
  return (
    <StyledButton $variant={variant} {...props}>
      {children}
    </StyledButton>
  );
}
