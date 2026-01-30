import { type HTMLAttributes, type ReactNode } from 'react';
import styled from 'styled-components';

const StyledCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03);
  border: 2px solid #f1f5f9;
  transition: all 0.3s ease;
`;

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, ...props }: CardProps) {
  return <StyledCard {...props}>{children}</StyledCard>;
}