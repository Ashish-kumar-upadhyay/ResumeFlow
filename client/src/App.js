import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ReferralForm from './components/ReferralForm';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaUsers } from 'react-icons/fa';
import './App.css';

const Navbar = styled.nav`
  width: 100vw;
  background: rgba(255,255,255,0.08);
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  backdrop-filter: blur(12px);
  border-radius: 0 0 2rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.2rem 0 1.2rem 0;
  gap: 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
`;
const NavBtn = styled.button`
  background: ${({ active }) => active ? 'linear-gradient(90deg,#43e97b,#38f9d7)' : 'rgba(255,255,255,0.12)'};
  color: #232526;
  border: none;
  border-radius: 1.5rem;
  padding: 0.7rem 2.2rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(67,233,123,0.10);
  display: flex;
  align-items: center;
  gap: 0.7rem;
  transition: background 0.2s;
  &:hover {
    background: linear-gradient(90deg,#fa8bff,#2bd2ff);
    color: #fff;
  }
`;

function App() {
  const [page, setPage] = useState('dashboard');
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="App" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #232526 0%, #414345 100%)' }}>
      <Navbar>
        <NavBtn active={page==='dashboard'} onClick={()=>setPage('dashboard')}><FaUsers /> Dashboard</NavBtn>
        <NavBtn active={page==='refer'} onClick={()=>setPage('refer')}><FaUserPlus /> Refer</NavBtn>
      </Navbar>
      <AnimatePresence mode="wait">
        {page === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard key={refresh} />
          </motion.div>
        )}
        {page === 'refer' && (
          <motion.div
            key="refer"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.5 }}
          >
            <ReferralForm onSuccess={()=>{ setPage('dashboard'); setRefresh(r=>!r); }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
