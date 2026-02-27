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
      </FormCard>
    </Container>
  );
}