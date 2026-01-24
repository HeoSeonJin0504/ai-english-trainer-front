import { type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { apiService } from '../services/api';

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

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  
  &:hover {
    opacity: 0.9;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  color: ${(props) => props.$active ? 'white' : 'rgba(255, 255, 255, 0.85)'};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
  background: ${(props) => (props.$active ? 'rgba(255, 255, 255, 0.2)' : 'transparent')};

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Main = styled.main`
  min-height: calc(100vh - 80px);
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserName = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
`;

const AuthButton = styled.button`
  color: white;
  padding: 0.45rem 0.9rem;
  border-radius: 6px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.4);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.6);
  }
`;

const LoginLink = styled(Link)`
  color: white;
  padding: 0.45rem 0.9rem;
  border-radius: 6px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.4);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.6);
  }
`;

interface HeaderProps {
  children: ReactNode;
}

export function Header({ children }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = apiService.isLoggedIn();
  const user = apiService.getCurrentUser();

  const navItems = [
    { path: '/example', label: '예문 생성' },
    { path: '/writing', label: '영어 문제' },
    { path: '/vocabulary', label: '단어장' },
    { path: '/my-questions', label: '저장된 문제' }
  ];

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      apiService.logout();
      navigate('/login');
    }
  };

  return (
    <LayoutWrapper>
      <Nav>
        <NavContainer>
          <LeftSection>
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
          </LeftSection>

          <UserSection>
            {isLoggedIn && user ? (
              <>
                <UserName>{user.username}님</UserName>
                <AuthButton onClick={handleLogout}>로그아웃</AuthButton>
              </>
            ) : (
              <LoginLink to="/login">로그인</LoginLink>
            )}
          </UserSection>
        </NavContainer>
      </Nav>
      <Main>{children}</Main>
    </LayoutWrapper>
  );
}