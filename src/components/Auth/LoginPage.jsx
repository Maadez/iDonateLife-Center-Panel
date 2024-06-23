import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../../firebase';
import { doc, getDoc } from "firebase/firestore";
import styled from 'styled-components';
import { CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import SettingsPage from '../Home/SettingsPage';
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

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 200%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 1%, rgba(255,255,255,0) 70%);
    transform: translateX(-50%);
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

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
      transform: translateY(20px) scale(0.5);
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

const LoginForm = styled(motion.div)`
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

const ErrorTypography = styled(Typography)`
  margin-top: 20px;
  color: red;
  font-family: 'Roboto, Helvetica, Arial, sans-serif';
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  //const [storedEmail, setStoredEmail] =useState('');

  useEffect(() => {
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      
      if (user) {
        try {
          const docRef = doc(firestore, "centers", user.uid);
          const centerDataSnapshot = await getDoc(docRef);

          if (centerDataSnapshot.exists) {
            const centerData = centerDataSnapshot.data();
            console.log(centerData);
            navigate('/home', { state: { centerData } });
          } else {
            console.error('Center data not found for the logged-in user.');
          }
        } catch (error) {
          console.error('Error fetching center data:', error);
        }
      }
    });

    return unsubscribe;
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if email and password are not empty
    if (!email || !password) {
      setError('Email and Password are required.');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      navigate('/home');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Background>

      <Sparkles>
        {createSparkles()}
      </Sparkles>
      <LoginForm
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <FormTypography variant="h5">Welcome to iDonate Life</FormTypography>
        <FormTypography variant="h6">Log in as Center</FormTypography>

        {error && <ErrorTypography>{error}</ErrorTypography>}
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
          <StyledButton type="submit" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
          </StyledButton>
        </form>
        <NavTypography onClick={() => navigate('/signup')}>
          Don't have an account? Sign Up
        </NavTypography>
      </LoginForm>
    </Background>
  );
}

export default LoginPage;
