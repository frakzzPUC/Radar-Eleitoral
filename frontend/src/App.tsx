import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Home } from './pages/Home';
import { Candidate } from './pages/Candidate';
import { Compare } from './pages/Compare';
import './App.css';

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/candidate/:id" element={<Candidate />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <a href="#maincontent" className="sr-only">
        Pular para o conteúdo principal
      </a>
      <nav aria-label="Navegação principal" style={navStyle}>
        <Link to="/" style={navLinkStyle} aria-label="Página inicial">
          <span style={{ color: '#009C3B', fontWeight: 800 }}>Radar</span>{' '}
          <span style={{ color: '#FFDF00', fontWeight: 800 }}>Eleitoral</span>
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={navLinkStyle}>Início</Link>
          <Link to="/compare" style={navLinkStyle}>Comparar</Link>
        </div>
      </nav>
      <AppRoutes />
      <footer style={footerStyle}>
        <p>&copy; 2026 Radar Eleitoral — Agregador de pesquisas eleitorais brasileiras</p>
      </footer>
    </BrowserRouter>
  );
}

const navStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 2rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  background: 'rgba(10, 15, 30, 0.8)',
  backdropFilter: 'blur(12px)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

const navLinkStyle: React.CSSProperties = {
  color: '#e2e8f0',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontWeight: 500,
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '2rem 1rem',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  color: '#475569',
  fontSize: '0.8rem',
};

export default App;
