import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ErrorMessage } from '../components/ErrorMessage';
import { apiService, type SignupRequest } from '../services/api';

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 3rem 2rem;
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
  
  input, select {
    width: 100%;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 600;
  font-size: 0.95rem;

  .optional {
    color: #9ca3af;
    font-weight: 400;
    font-size: 0.85rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3b82f6;
  }
`;

const HelpText = styled.p`
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
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

const LoginLink = styled.div`
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

const CheckButton = styled.button<{ $available?: boolean; $checked?: boolean }>`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => {
    if (props.$checked && props.$available) return '#10b981';
    if (props.$checked && !props.$available) return '#ef4444';
    return '#3b82f6';
  }};
  background: ${props => {
    if (props.$checked && props.$available) return '#d1fae5';
    if (props.$checked && !props.$available) return '#fee2e2';
    return 'white';
  }};
  color: ${props => {
    if (props.$checked && props.$available) return '#065f46';
    if (props.$checked && !props.$available) return '#991b1b';
    return '#3b82f6';
  }};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: ${props => {
      if (props.$checked && props.$available) return '#a7f3d0';
      if (props.$checked && !props.$available) return '#fecaca';
      return '#eff6ff';
    }};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const InputWithButton = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
`;

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupRequest>({
    username: '',
    password: '',
    phone: '',
    email: '',
    gender: 'MALE',  // ✅ 기본값 설정
    age: 0  // ✅ 기본값 설정
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayPhone, setDisplayPhone] = useState('');
  
  // 중복 확인 상태 추가
  const [usernameCheck, setUsernameCheck] = useState<{ checked: boolean; available: boolean }>({ 
    checked: false, 
    available: false 
  });
  const [phoneCheck, setPhoneCheck] = useState<{ checked: boolean; available: boolean }>({ 
    checked: false, 
    available: false 
  });

  const handleChange = (field: keyof SignupRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 값 변경 시 중복 확인 상태 초기화
    if (field === 'username') {
      setUsernameCheck({ checked: false, available: false });
    }
  };

  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/[^\d]/g, '');
    
    if (numbers.length > 11) {
      return displayPhone;
    }

    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/[^\d]/g, '');
    
    setFormData(prev => ({ ...prev, phone: numbers }));
    setDisplayPhone(formatPhoneNumber(value));
    
    // 전화번호 변경 시 중복 확인 상태 초기화
    setPhoneCheck({ checked: false, available: false });
  };

  // 아이디 중복 확인
  const handleCheckUsername = async () => {
    if (!formData.username.trim()) {
      setError('아이디를 입력해주세요.');
      return;
    }

    // 테스트용 - 검증 임시 해제
    // if (formData.username.length < 4 || formData.username.length > 50) {
    //   setError('아이디는 4~50자 사이여야 합니다.');
    //   return;
    // }

    // if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
    //   setError('아이디는 영문, 숫자, 언더스코어만 사용 가능합니다.');
    //   return;
    // }

    try {
      const response = await apiService.checkUsername(formData.username);
      setUsernameCheck({ checked: true, available: response.data });
      
      if (response.data) {
        setError('');
        alert('사용 가능한 아이디입니다.');
      } else {
        setError('이미 사용 중인 아이디입니다.');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // 핸드폰 중복 확인
  const handleCheckPhone = async () => {
    if (!formData.phone) {
      setError('전화번호를 입력해주세요.');
      return;
    }

    // 테스트용 - 검증 임시 해제
    // if (!/^01\d{8,9}$/.test(formData.phone)) {
    //   setError('전화번호는 01로 시작하는 10~11자리 번호를 입력해주세요.');
    //   return;
    // }

    try {
      const response = await apiService.checkPhone(formData.phone);
      setPhoneCheck({ checked: true, available: response.data });
      
      if (response.data) {
        setError('');
        alert('사용 가능한 전화번호입니다.');
      } else {
        setError('이미 사용 중인 전화번호입니다.');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const validateForm = (): boolean => {
    // 테스트용 - 검증 임시 해제
    // 중복 확인 여부 검증
    // if (!usernameCheck.checked) {
    //   setError('아이디 중복 확인을 해주세요.');
    //   return false;
    // }

    // if (!usernameCheck.available) {
    //   setError('이미 사용 중인 아이디입니다.');
    //   return false;
    // }

    // if (!phoneCheck.checked) {
    //   setError('전화번호 중복 확인을 해주세요.');
    //   return false;
    // }

    // if (!phoneCheck.available) {
    //   setError('이미 사용 중인 전화번호입니다.');
    //   return false;
    // }

    if (!formData.password) {
      setError('비밀번호를 입력해주세요.');
      return false;
    }

    // 테스트용 - 비밀번호 길이 검증 임시 해제
    // if (formData.password.length < 8) {
    //   setError('비밀번호는 8자 이상이어야 합니다.');
    //   return false;
    // }

    if (formData.password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    // 테스트용 - 전화번호 검증 임시 해제
    // 전화번호 규칙 수정 (10~11자리)
    // if (!/^01\d{8,9}$/.test(formData.phone)) {
    //   setError('전화번호는 01로 시작하는 10~11자리 번호를 입력해주세요.');
    //   return false;
    // }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return false;
    }

    // 성별 필수 검증
    if (!formData.gender) {
      setError('성별을 선택해주세요.');
      return false;
    }

    // 나이 필수 검증 수정
    if (!formData.age || formData.age < 1 || formData.age > 150) {
      setError('나이를 입력해주세요. (1~150)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ✅ 필수 필드로 변경되었으므로 조건부 처리 제거
      const submitData: SignupRequest = {
        username: formData.username,
        password: formData.password,
        phone: formData.phone,
        email: formData.email,
        gender: formData.gender,
        age: formData.age
      };

      // 이메일만 선택 사항
      if (!formData.email) {
        delete submitData.email;
      }

      await apiService.signup(submitData);
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>회원가입</Title>
      
      <FormCard>
        <form onSubmit={handleSubmit}>
          {error && <ErrorMessage message={error} onClose={() => setError('')} />}
          
          <FormGroup>
            <Label htmlFor="username">아이디</Label>
            <InputWithButton>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="영문, 숫자, 언더스코어 4~50자"
                disabled={loading}
              />
              <CheckButton
                type="button"
                onClick={handleCheckUsername}
                disabled={loading}
                $checked={usernameCheck.checked}
                $available={usernameCheck.available}
              >
                {usernameCheck.checked 
                  ? (usernameCheck.available ? '✓ 사용가능' : '✗ 사용불가')
                  : '중복확인'
                }
              </CheckButton>
            </InputWithButton>
            <HelpText>영문, 숫자, 언더스코어(_)만 사용 가능합니다.</HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="8자 이상"
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">전화번호</Label>
            <InputWithButton>
              <Input
                id="phone"
                type="text"
                value={displayPhone}
                onChange={handlePhoneChange}
                placeholder="010-1234-5678"
                disabled={loading}
              />
              <CheckButton
                type="button"
                onClick={handleCheckPhone}
                disabled={loading}
                $checked={phoneCheck.checked}
                $available={phoneCheck.available}
              >
                {phoneCheck.checked 
                  ? (phoneCheck.available ? '✓ 사용가능' : '✗ 사용불가')
                  : '중복확인'
                }
              </CheckButton>
            </InputWithButton>
            <HelpText>자동으로 하이픈(-)이 추가됩니다. (10~11자리)</HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">
              이메일 <span className="optional">(선택)</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="example@email.com"
              disabled={loading}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="gender">
              성별 <span style={{ color: '#ef4444' }}>*</span>
            </Label>
            <Select
              id="gender"
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value as 'MALE' | 'FEMALE')}
              disabled={loading}
              required
            >
              <option value="MALE">남자</option>
              <option value="FEMALE">여자</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="age">
              나이 <span style={{ color: '#ef4444' }}>*</span>
            </Label>
            <Input
              id="age"
              type="number"
              value={formData.age || ''}
              onChange={(e) => handleChange('age', e.target.value ? Number(e.target.value) : 0)}
              placeholder="1~150"
              min="1"
              max="150"
              disabled={loading}
              required
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="submit" disabled={loading}>
              {loading ? '가입 중...' : '회원가입'}
            </Button>
          </ButtonGroup>
        </form>

        <LoginLink>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </LoginLink>
      </FormCard>
    </Container>
  );
}