import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(30,32,38,0.85);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ModalBox = styled(motion.div)`
  background: rgba(40,44,52,0.98);
  border-radius: 2rem;
  box-shadow: 0 12px 48px 0 rgba(0,0,0,0.35);
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  max-width: 900px;
  width: 95vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
const CloseBtn = styled.button`
  background: linear-gradient(90deg,#fa8bff,#2bd2ff);
  color: #232526;
  border: none;
  border-radius: 1.5rem;
  padding: 0.6rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(67,233,123,0.10);
  display: flex;
  align-items: center;
  gap: 0.7rem;
  transition: background 0.2s;
  &:hover {
    background: linear-gradient(90deg,#43e97b,#38f9d7);
    color: #fff;
  }
`;
const PDFFrame = styled.iframe`
  width: 100%;
  height: 70vh;
  border: none;
  border-radius: 1rem;
  background: #222;
`;

const PDFModal = ({ url, onClose }) => (
  <AnimatePresence>
    {url && (
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ModalBox
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <CloseBtn onClick={onClose}><FaTimes /> Close</CloseBtn>
          <PDFFrame src={url} title="Resume PDF" />
        </ModalBox>
      </Overlay>
    )}
  </AnimatePresence>
);

export default PDFModal; 