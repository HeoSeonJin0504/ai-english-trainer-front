import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const LayoutWrapper = styled.div`
  min-height: 100vh;
`;

const Nav = styled.nav`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  padding: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background 0.2s;
  background: ${(props) => (props.$active ? 'rgba(255, 255, 255, 0.2)' : 'transparent')};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    text-decoration: none;
  }
`;

const Main = styled.main`
  min-height: calc(100vh - 80px);
`;

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '홈' },
    { path: '/example', label: '예문 생성' },
    { path: '/writing', label: '영어 문제' },
    { path: '/vocabulary', label: '단어장' }
  ];

  return (
    <LayoutWrapper>
      <Nav>
        <NavContainer>
          <Logo to="/">AI 영어 학습</Logo>
          <NavLinks>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                $active={location.pathname === item.path}
              >
                {item.label}
              </NavLink>
            ))}
          </NavLinks>
        </NavContainer>
      </Nav>
      <Main>{children}</Main>
    </LayoutWrapper>
  );
}
