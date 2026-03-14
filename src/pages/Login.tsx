import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ErrorMessage } from '../components/ErrorMessage';
import { apiService } from '../services/api';

const Container = styled.div`
  max-width: 450px;
  margin: 0 auto;
  padding: 3rem 2rem;

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
`;

const Title = styled.h1`
  color: #3f56a1;
  font-weight: 800;
  letter-spacing: -0.5px;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const FormCard = styled(Card)`
  padding: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  input {
    width: 100%;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 600;
  font-size: 0.95rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  
  button {
    width: 100%;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1.25rem;
  color: #9ca3af;
  font-size: 0.85rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }
`;

const TestLoginButton = styled.button`
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.6rem 1rem;
  background: #f3f4f6;
  color: #374151;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover:not(:disabled) {
    background: #e5e7eb;
    border-color: #9ca3af;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SignupLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #6b7280;
  font-size: 0.95rem;

  a {
    color: #3b82f6;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SocialLoginSection = styled.div`
  margin-top: 2rem;
`;

const SocialDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #9ca3af;
  font-size: 0.85rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }
`;

const SocialButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SocialButton = styled.button<{ $bgColor: string; $textColor: string; $borderColor?: string }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.7rem 1rem;
  background: ${({ $bgColor }) => $bgColor};
  color: ${({ $textColor }) => $textColor};
  border: ${({ $borderColor }) => $borderColor ? `1.5px solid ${$borderColor}` : 'none'};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.15s;

  &:hover {
    filter: brightness(0.93);
  }
`;

const SocialIcon = styled.span`
  display: flex;
  align-items: center;
  font-size: 1.1rem;
`;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const TEST_USERNAME = import.meta.env.VITE_TEST_USERNAME || '';
const TEST_PASSWORD = import.meta.env.VITE_TEST_PASSWORD || '';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (id: string, pw: string) => {
    if (!id.trim() || !pw.trim()) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiService.login(id, pw);
      navigate('/');
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = () => {
    if (!TEST_USERNAME || !TEST_PASSWORD) {
      setError('테스트 계정 정보가 설정되지 않았습니다. (.env 파일의 VITE_TEST_USERNAME / VITE_TEST_PASSWORD 확인)');
      return;
    }
    handleLogin(TEST_USERNAME, TEST_PASSWORD);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  const handleSocialLogin = (provider: 'google' | 'kakao' | 'naver') => {
    window.location.href = `${API_BASE_URL}/auth/${provider}`;
  };

  return (
    <Container>
      <Title>로그인</Title>
      
      <FormCard>
        <form onSubmit={handleSubmit}>
          {error && <ErrorMessage message={error} onClose={() => setError('')} />}
          
          <FormGroup>
            <Label htmlFor="username">아이디</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력하세요"
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              disabled={loading}
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="submit" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </ButtonGroup>

          <Divider>또는</Divider>
          <TestLoginButton type="button" onClick={handleTestLogin} disabled={loading}>
            {loading ? '로그인 중...' : '테스트 계정으로 로그인'}
          </TestLoginButton>
        </form>

        <SignupLink>
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </SignupLink>

        <SocialLoginSection>
          <SocialDivider>소셜 로그인</SocialDivider>
          <SocialButtonGroup>
            <SocialButton
              type="button"
              $bgColor="#fff"
              $textColor="#374151"
              $borderColor="#d1d5db"
              onClick={() => handleSocialLogin('google')}
            >
              <SocialIcon>
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M44.5 20H24v8.5h11.7C34.2 33.5 29.7 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l6-6C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z" fill="#4285F4"/>
                  <path d="M6.3 14.7l7 5.1C15 16.1 19.2 13 24 13c3 0 5.8 1.1 7.9 3l6-6C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" fill="#EA4335"/>
                  <path d="M24 44c5.4 0 10.3-1.8 14.1-4.9l-6.5-5.3C29.6 35.6 26.9 36.5 24 36.5c-5.7 0-10.5-3.8-12.2-9l-7 5.4C8.3 39.8 15.6 44 24 44z" fill="#34A853"/>
                  <path d="M43.6 20H24v8.5h11.7c-.8 2.3-2.3 4.3-4.2 5.7l6.5 5.3C41.8 36.2 44 30.5 44 24c0-1.3-.1-2.7-.4-4z" fill="#FBBC05"/>
                </svg>
              </SocialIcon>
              Google로 로그인
            </SocialButton>

            <SocialButton
              type="button"
              $bgColor="#FEE500"
              $textColor="#191919"
              onClick={() => handleSocialLogin('kakao')}
            >
              <SocialIcon>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 3C6.477 3 2 6.477 2 10.8c0 2.718 1.698 5.105 4.27 6.534L5.2 21l4.84-2.567A11.5 11.5 0 0012 18.6c5.523 0 10-3.477 10-7.8C22 6.477 17.523 3 12 3z" fill="#181600"/>
                </svg>
              </SocialIcon>
              카카오로 로그인
            </SocialButton>

            <SocialButton
              type="button"
              $bgColor="#03C75A"
              $textColor="#fff"
              onClick={() => handleSocialLogin('naver')}
            >
              <SocialIcon>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.6 12.4L10.1 7H7v10h3.4V11.6l3.5 5.4H17V7h-3.4v5.4z" fill="#fff"/>
                </svg>
              </SocialIcon>
              네이버로 로그인
            </SocialButton>
          </SocialButtonGroup>
        </SocialLoginSection>
      </FormCard>
    </Container>
  );
}