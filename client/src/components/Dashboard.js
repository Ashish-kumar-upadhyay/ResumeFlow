import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSearch, FaEnvelope, FaPhone, FaUserTie, FaFilePdf } from 'react-icons/fa';
import PDFModal from './PDFModal';

const Container = styled.div`
  padding: 2rem 4vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #232526 0%, #414345 100%);
`;
const SearchBarWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 3.5rem 0 3rem 0;
  width: 100%;
`;
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.16);
  border-radius: 2.7rem;
  padding: 1.1rem 2.5rem;
  box-shadow: 0 8px 32px 0 rgba(67,233,123,0.10), 0 1.5px 8px 0 #fa8bff33;
  width: 100%;
  max-width: 600px;
  min-width: 340px;
  border: 2.5px solid transparent;
  backdrop-filter: blur(18px);
  transition: border 0.3s, box-shadow 0.3s;
  position: relative;
  margin: 0 auto;
  &:hover, &:focus-within {
    border: 2.5px solid #43e97b;
    box-shadow: 0 16px 48px 0 #43e97b55, 0 1.5px 8px 0 #fa8bff33;
  }
`;
const Input = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 1.25rem;
  flex: 1;
  margin-left: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 0.5rem 0;
`;
const SearchBtn = styled.button`
  background: linear-gradient(90deg,#43e97b,#38f9d7);
  color: #232526;
  border: none;
  border-radius: 1.5rem;
  padding: 0.7rem 1.7rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  margin-left: 1.2rem;
  box-shadow: 0 2px 8px #43e97b55;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: linear-gradient(90deg,#fa8bff,#2bd2ff);
    color: #fff;
  }
`;
const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2.5rem;
  margin-top: 0.5rem;
`;
const Card = styled(motion.div)`
  background: rgba(255,255,255,0.10);
  border-radius: 2.2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.22), 0 1.5px 8px 0 rgba(67,233,123,0.10);
  padding: 2.2rem 1.7rem 1.5rem 1.7rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 320px;
  max-width: 350px;
  position: relative;
  overflow: hidden;
  border: 1.5px solid rgba(255,255,255,0.13);
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-10px) scale(1.04);
    box-shadow: 0 16px 48px 0 #43e97b55, 0 1.5px 8px 0 #fa8bff33;
    border: 1.5px solid #43e97b;
  }
`;
const Status = styled.span`
  padding: 0.3rem 1.1rem;
  border-radius: 1rem;
  font-size: 1.05rem;
  background: ${({ status }) =>
    status === 'Hired' ? 'linear-gradient(90deg,#43e97b,#38f9d7)' :
    status === 'Reviewed' ? 'linear-gradient(90deg,#fa8bff,#2bd2ff)' :
    'linear-gradient(90deg,#f7971e,#ffd200)'};
  color: #232526;
  font-weight: 700;
  margin-bottom: 1.1rem;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;
const Name = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 2.1rem;
  font-weight: 800;
  letter-spacing: 1.2px;
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;
const Job = styled.h4`
  margin: 0 0 1.1rem 0;
  font-size: 1.15rem;
  font-weight: 500;
  color: #b2bec3;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const Info = styled.div`
  margin-bottom: 1.1rem;
  font-size: 1.05rem;
  color: #e0e0e0;
  width: 100%;
`;
const ResumeLink = styled.span`
  color: #00ffe7;
  text-decoration: underline;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.3rem;
  &:hover {
    color: #fa8bff;
  }
`;
const Dropdown = styled.select`
  margin: 0 1.2rem 0 1.2rem;
  padding: 0.7rem 1.7rem;
  border-radius: 1.5rem;
  border: none;
  background: linear-gradient(90deg,#232526,#414345 80%);
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px #43e97b33;
  outline: none;
  transition: background 0.2s, color 0.2s;
  appearance: none;
  cursor: pointer;
  height: 48px;
  display: flex;
  align-items: center;
  &:hover, &:focus {
    background: linear-gradient(90deg,#fa8bff,#2bd2ff);
    color: #232526;
  }
`;
const NoResult = styled.div`
  width: 100%;
  text-align: center;
  color: #ff7675;
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 3rem;
  letter-spacing: 1px;
`;

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [pendingSearch, setPendingSearch] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const searchRef = useRef();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    const res = await axios.get('https://resumeflow-vc6r.onrender.com/candidates');
    setCandidates(res.data);
  };

  const handleStatusChange = async (id, status) => {
    await axios.put(`https://resumeflow-vc6r.onrender.com/candidates/${id}/status`, { status });
    fetchCandidates();
  };

  const handleSearch = (e) => {
    e && e.preventDefault();
    setSearch(pendingSearch);
    searchRef.current.blur();
  };

  const filtered = candidates.filter(c =>
    (c.name.toLowerCase().includes(search.toLowerCase()) ||
     c.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
     c.status.toLowerCase().includes(search.toLowerCase())) &&
    (filter ? c.status === filter : true)
  );

  return (
    <Container>
      <SearchBarWrap style={{ position: 'relative' }}>
        <form onSubmit={handleSearch} style={{ width: '100%' }}>
          <SearchBar>
            <FaSearch color="#fff8" />
            <Input
              ref={searchRef}
              placeholder="Search by job title or status..."
              value={pendingSearch}
              onChange={e => setPendingSearch(e.target.value)}
            />
            <Dropdown value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Hired">Hired</option>
            </Dropdown>
            <SearchBtn type="submit"><FaSearch /> Search</SearchBtn>
          </SearchBar>
        </form>
      </SearchBarWrap>
      {filtered.length === 0 ? (
        <NoResult>No candidate found</NoResult>
      ) : (
        <CardGrid>
          {filtered.map(c => (
            <Card
              key={c._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Status status={c.status}>{c.status}</Status>
              <Name><FaUserTie /> {c.name}</Name>
              <Job><FaEnvelope /> {c.jobTitle}</Job>
              <Info>
                <div><FaEnvelope style={{marginRight:4}}/> <b>Email:</b> {c.email}</div>
                <div><FaPhone style={{marginRight:4}}/> <b>Phone:</b> {c.phone}</div>
                {c.resumeUrl && (
                  <ResumeLink onClick={() => setPdfUrl(`https://resumeflow-vc6r.onrender.com/${c.resumeUrl}`)}>
                    <FaFilePdf /> View Resume
                  </ResumeLink>
                )}
              </Info>
              <Dropdown
                value={c.status}
                onChange={e => handleStatusChange(c._id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Hired">Hired</option>
              </Dropdown>
            </Card>
          ))}
        </CardGrid>
      )}
      <PDFModal url={pdfUrl} onClose={() => setPdfUrl(null)} />
    </Container>
  );
};

export default Dashboard; 