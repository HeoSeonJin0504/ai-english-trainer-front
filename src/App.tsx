import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Home, ExampleGenerator, WritingProblem, Vocabulary, MyQuestions, Login, Signup } from './pages';
import { Header } from './components/Header';
import { apiService } from './services/api';

// ✅ 인증 필요한 라우트 보호
function PrivateRoute({ children }: { children: React.ReactElement }) {
  const isLoggedIn = apiService.isLoggedIn();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

// ✅ 토큰 만료 체크 컴포넌트
function TokenExpiryChecker() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiry = () => {
      if (!apiService.isLoggedIn()) {
        return;
      }

      const expiry = apiService.getTokenExpiry();
      if (expiry) {
        const timeLeft = expiry - Date.now();
        
        // 5분 전에 경고
        if (timeLeft > 0 && timeLeft < 5 * 60 * 1000) {
          console.warn('토큰이 곧 만료됩니다.');
        }
        
        // 만료되면 로그아웃
        if (timeLeft <= 0) {
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          apiService.logout();
          navigate('/login');
        }
      }
    };

    // 1분마다 체크
    const interval = setInterval(checkTokenExpiry, 60 * 1000);
    
    return () => clearInterval(interval);
  }, [navigate]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <Header>
        <TokenExpiryChecker />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/example" element={
            <PrivateRoute>
              <ExampleGenerator />
            </PrivateRoute>
          } />
          <Route path="/writing" element={
            <PrivateRoute>
              <WritingProblem />
            </PrivateRoute>
          } />
          <Route path="/vocabulary" element={
            <PrivateRoute>
              <Vocabulary />
            </PrivateRoute>
          } />
          <Route path="/my-questions" element={
            <PrivateRoute>
              <MyQuestions />
            </PrivateRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Header>
    </BrowserRouter>
  );
}

export default App;