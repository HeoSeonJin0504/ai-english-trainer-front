import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home, ExampleGenerator, WritingProblem, Vocabulary } from './pages';
import { Layout } from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/example" element={<ExampleGenerator />} />
          <Route path="/writing" element={<WritingProblem />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;