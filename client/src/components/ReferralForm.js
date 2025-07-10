import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaBriefcase, FaFilePdf } from 'react-icons/fa';

const FormContainer = styled(motion.div)`
  background: rgba(40,44,52,0.65);
  border-radius: 2.5rem;
  box-shadow: 0 12px 48px 0 rgba(0,0,0,0.25), 0 1.5px 8px 0 rgba(67,233,123,0.08);
  padding: 3.5rem 2.5rem 2.5rem 2.5rem;
  max-width: 420px;
  margin: 4rem auto 0 auto;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  backdrop-filter: blur(18px);
  border: 2.5px solid transparent;
  background-clip: padding-box;
  position: relative;
  transition: border 0.3s;
  &:hover {
    border: 2.5px solid #43e97b;
    box-shadow: 0 16px 48px 0 #43e97b55, 0 1.5px 8px 0 #fa8bff33;
  }
  @media (max-width: 600px) {
    padding: 2rem 0.7rem;
    max-width: 98vw;
  }
`;
const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 2.2rem;
  text-align: center;
  letter-spacing: 1.5px;
  color: #fff;
`;
const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.3rem;
  position: relative;
`;
const Label = styled.label`
  font-size: 1.08rem;
  margin-bottom: 0.5rem;
  color: #b2bec3;
  font-weight: 600;
  letter-spacing: 0.5px;
`;
const IconWrap = styled.span`
  position: absolute;
  left: 1.1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #43e97b;
  font-size: 1.1rem;
  opacity: 0.85;
`;
const Input = styled.input`
  background: rgba(255,255,255,0.10);
  border: none;
  border-radius: 1.2rem;
  padding: 1.1rem 1.2rem 1.1rem 2.8rem;
  color: #fff;
  font-size: 1.08rem;
  outline: none;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: box-shadow 0.2s, border 0.2s;
  border: 1.5px solid transparent;
  &:focus {
    box-shadow: 0 4px 16px #43e97b44;
    border: 1.5px solid #43e97b;
  }
`;
const FileInput = styled.input`
  margin-top: 0.3rem;
  color: #fff;
`;
const ErrorMsg = styled.div`
  color: #fff;
  background: linear-gradient(90deg,#ff7675,#f7971e);
  border-radius: 1rem;
  padding: 0.7rem 1rem;
  margin-bottom: 1.2rem;
  text-align: center;
  font-weight: 700;
  font-size: 1.08rem;
  box-shadow: 0 2px 8px #ff767555;
`;
const SubmitBtn = styled(motion.button)`
  background: linear-gradient(90deg,#43e97b,#38f9d7);
  color: #232526;
  border: none;
  border-radius: 1.7rem;
  padding: 1.1rem 0;
  font-size: 1.25rem;
  font-weight: 800;
  cursor: pointer;
  margin-top: 0.7rem;
  box-shadow: 0 4px 24px #43e97b55, 0 1.5px 8px 0 #fa8bff33;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  width: 100%;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px #fff8;
  &:hover {
    background: linear-gradient(90deg,#fa8bff,#2bd2ff);
    color: #fff;
    box-shadow: 0 8px 32px #fa8bff55;
  }
`;

const ReferralForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', jobTitle: '', resume: null });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.name || !form.email || !form.phone || !form.jobTitle) return 'All fields are required.';
    if (!/^[A-Za-z ]+$/.test(form.name)) return 'Name must contain only letters and spaces.';
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email)) return 'Email must be a valid Gmail address.';
    if (!/^\d{10}$/.test(form.phone)) return 'Phone must be exactly 10 digits.';
    if (form.resume && form.resume.type !== 'application/pdf') return 'Resume must be a PDF.';
    return '';
  };

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setForm(f => ({ ...f, resume: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setError('');
    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v) data.append(k, v);
    });
    try {
      await axios.post('https://resumeflow-vc6r.onrender.com/candidates', data);
      setForm({ name: '', email: '', phone: '', jobTitle: '', resume: null });
      if (onSuccess) onSuccess();
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Title>Refer a Candidate</Title>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <form onSubmit={handleSubmit} autoComplete="off">
        <Field>
          <Label>Name</Label>
          <IconWrap><FaUser /></IconWrap>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Candidate Name" />
        </Field>
        <Field>
          <Label>Email</Label>
          <IconWrap><FaEnvelope /></IconWrap>
          <Input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        </Field>
        <Field>
          <Label>Phone</Label>
          <IconWrap><FaPhone /></IconWrap>
          <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" />
        </Field>
        <Field>
          <Label>Job Title</Label>
          <IconWrap><FaBriefcase /></IconWrap>
          <Input name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="Job Title" />
        </Field>
        <Field>
          <Label>Resume (PDF only, optional)</Label>
          <IconWrap><FaFilePdf /></IconWrap>
          <FileInput type="file" name="resume" accept="application/pdf" onChange={handleChange} style={{paddingLeft:'2.8rem'}} />
        </Field>
        <SubmitBtn
          type="submit"
          whileTap={{ scale: 0.97 }}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Refer Now'}
        </SubmitBtn>
      </form>
    </FormContainer>
  );
};

export default ReferralForm; 