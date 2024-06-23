import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import styled from 'styled-components';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #FF217A, #FF4D4D);
  overflow: hidden;
  width: 100vw;
  position: relative;
`;

const Sparkles = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;

  .sparkle {
    position: absolute;
    width: 2px;
    height: 2px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    animation: sparkle 5s infinite ease-in-out;

    &:nth-child(odd) {
      animation-duration: 4s;
    }
  }

  @keyframes sparkle {
    0%, 100% {
      opacity: 0;
      transform: translateY(-100px) scale(0.5);
    }
    50% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const createSparkles = () => {
  const sparkles = [];
  for (let i = 0; i < 50; i++) {
    const sparkleStyle = {
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
    };
    sparkles.push(<div key={i} className="sparkle" style={sparkleStyle} />);
  }
  return sparkles;
};

const SignupForm = styled(motion.div)`
  background: white;
  padding: 40px 30px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 400px;
  position: relative;
  z-index: 1;
`;

const StyledButton = styled.button`
  margin-top: 20px;
  padding: 10px;
  width: 100%;
  background: linear-gradient(135deg, #FF217A, #FF4D4D);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  font-family: 'Roboto, Helvetica, Arial, sans-serif';

  &:hover {
    background: linear-gradient(135deg, #FF4D4D, #FF217A);
    transform: scale(1.05);
  }
`;

const StyledTextField = styled.input`
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto, Helvetica, Arial, sans-serif';
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #FF217A;
  }
`;

const FormTypography = styled(Typography)`
  margin-bottom: 20px;
  font-family: 'Roboto, Helvetica, Arial, sans-serif';
`;

const NavTypography = styled(Typography)`
  margin-top: 10px;
  color: #FF217A;
  font-family: 'Roboto, Helvetica, Arial, sans-serif';
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      navigate('/center-info');
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <Background>
      <Sparkles>
        {createSparkles()}
      </Sparkles>
      <SignupForm
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <FormTypography variant="h4">Sign Up</FormTypography>
        <form onSubmit={handleSubmit}>
          <StyledTextField
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
          <StyledTextField
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
          <StyledButton type="submit">
            Sign Up
          </StyledButton>
        </form>
        <NavTypography onClick={() => navigate('/')}>
          Already have an account? Log In
        </NavTypography>
      </SignupForm>
    </Background>
  );
}

export default SignupPage;
