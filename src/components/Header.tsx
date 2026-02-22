import { type ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { apiService } from '../services/api';
import { TTSSettingsModal } from './TTSSettingsModal';

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const LayoutWrapper = styled.div`
  min-height: 100vh;
`;

const Nav = styled.nav`
  background: #2563eb;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 100;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;

  @media (max-width: 768px) {
    padding: 0 1rem;
    height: 60px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
  height: 100%;

  @media (max-width: 768px) {
    gap: 0;
  }
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

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 0;
  align-items: center;
  height: 100%;

  @media (max-width: 768px) {
    display: none;
  }
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

/* ── Mobile Menu ── */
const HamburgerButton = styled.button`
  display: none;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const HamburgerLine = styled.span<{ $open: boolean; $pos: 'top' | 'mid' | 'bot' }>`
  display: block;
  width: 20px;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: all 0.25s ease;

  ${({ $open, $pos }) =>
    $open &&
    $pos === 'top' &&
    css`transform: translateY(7px) rotate(45deg);`}
  ${({ $open, $pos }) =>
    $open && $pos === 'mid' && css`opacity: 0; transform: scaleX(0);`}
  ${({ $open, $pos }) =>
    $open &&
    $pos === 'bot' &&
    css`transform: translateY(-7px) rotate(-45deg);`}
`;

const MobileMenu = styled.div<{ $open: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? 'block' : 'none')};
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background: #1d4ed8;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    animation: ${slideDown} 0.2s ease-out;
    z-index: 99;
  }
`;

const MobileNavLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: ${({ $active }) => ($active ? 'white' : 'rgba(255,255,255,0.8)')};
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  font-size: 1rem;
  text-decoration: none;
  border-left: 4px solid ${({ $active }) => ($active ? 'white' : 'transparent')};
  background: ${({ $active }) => ($active ? 'rgba(255,255,255,0.1)' : 'transparent')};
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: white;
    text-decoration: none;
  }
`;

const MobileDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 1.5rem;
`;

const MobileUserSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
`;

const MobileUserName = styled.span`
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
`;

const MobileButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;
/* ── End Mobile Menu ── */

const Main = styled.main`
  min-height: calc(100vh - 70px);

  @media (max-width: 768px) {
    min-height: calc(100vh - 60px);
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;

  @media (max-width: 768px) {
    display: none;
  }
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
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleNavClick = () => setMenuOpen(false);

  return (
    <>
      <LayoutWrapper>
        <Nav>
          <NavContainer>
            <LeftSection>
              <Logo to="/" onClick={handleNavClick}>AI 영어 학습</Logo>
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

            {/* Desktop */}
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

            {/* Mobile hamburger */}
            <HamburgerButton
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="메뉴 열기"
            >
              <HamburgerLine $open={menuOpen} $pos="top" />
              <HamburgerLine $open={menuOpen} $pos="mid" />
              <HamburgerLine $open={menuOpen} $pos="bot" />
            </HamburgerButton>
          </NavContainer>

          {/* Mobile dropdown */}
          <MobileMenu $open={menuOpen}>
            {navItems.map((item) => (
              <MobileNavLink
                key={item.path}
                to={item.path}
                $active={location.pathname === item.path}
                onClick={handleNavClick}
              >
                {item.label}
              </MobileNavLink>
            ))}
            <MobileDivider />
            <MobileUserSection>
              {isLoggedIn && user ? (
                <>
                  <MobileUserName>{user.username}님</MobileUserName>
                  <MobileButtons>
                    <SettingsButton
                      onClick={() => { setShowTTSSettings(true); setMenuOpen(false); }}
                      title="TTS 설정"
                    >
                      ⚙️
                    </SettingsButton>
                    <AuthButton onClick={() => { handleLogout(); setMenuOpen(false); }}>
                      로그아웃
                    </AuthButton>
                  </MobileButtons>
                </>
              ) : (
                <LoginLink to="/login" onClick={handleNavClick}>로그인</LoginLink>
              )}
            </MobileUserSection>
          </MobileMenu>
        </Nav>
        <Main>{children}</Main>
      </LayoutWrapper>

      {showTTSSettings && (
        <TTSSettingsModal onClose={() => setShowTTSSettings(false)} />
      )}
    </>
  );
}