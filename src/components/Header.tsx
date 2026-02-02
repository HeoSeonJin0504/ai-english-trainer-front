import { type ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { apiService } from '../services/api';
import { TTSSettingsModal } from './TTSSettingsModal';

const LayoutWrapper = styled.div`
  min-height: 100vh;
`;

const Nav = styled.nav`
  background: #2563eb;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
  height: 100%;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  letter-spacing: -0.3px;
  
  &:hover {
    opacity: 0.9;
    text-decoration: none;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 0;
  align-items: center;
  height: 100%;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  color: ${(props) => props.$active ? 'white' : 'rgba(255, 255, 255, 0.75)'};
  text-decoration: none;
  padding: 0 2rem;
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: ${(props) => (props.$active ? '600' : '500')};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.08);
    text-decoration: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: white;
    transform: scaleX(${(props) => (props.$active ? '1' : '0')});
    transition: transform 0.2s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const Main = styled.main`
  min-height: calc(100vh - 64px);
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const UserName = styled.span`
  color: white;
  font-size: 1.05rem;
  font-weight: 500;
  opacity: 0.9;
`;

const AuthButton = styled.button`
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  cursor: pointer;
  font-size: 1.05rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const LoginLink = styled(Link)`
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-block;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const SettingsButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
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
  const [showTTSSettings, setShowTTSSettings] = useState(false);

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
    <>
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
                  <SettingsButton 
                    onClick={() => setShowTTSSettings(true)}
                    title="TTS 설정"
                  >
                    ⚙️
                  </SettingsButton>
                </>
              ) : (
                <LoginLink to="/login">로그인</LoginLink>
              )}
            </UserSection>
          </NavContainer>
        </Nav>
        <Main>{children}</Main>
      </LayoutWrapper>

      {showTTSSettings && (
        <TTSSettingsModal onClose={() => setShowTTSSettings(false)} />
      )}
    </>
  );
}