import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Home, ExampleGenerator, WritingProblem, Vocabulary, MyQuestions, Login, Signup } from './pages';
import { Header } from './components/Header';
import { Chatbot } from './components/Chatbot';
import { apiService } from './services/api';

// ✅ 인증 필요한 라우트 보호
function PrivateRoute({ children }: { children: React.ReactElement }) {
  const isLoggedIn = apiService.isLoggedIn();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

// ✅ 로그인 상태를 라우트 변경마다 재평가하는 래퍼
function AppContent() {
  const isLoggedIn = apiService.isLoggedIn();

  return (
    <Header>
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
      
      {isLoggedIn && <Chatbot />}
    </Header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;