import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore, auth } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import GeoFirePoint from '../../GeoPoint/geofirepoint';
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

const CenterForm = styled(motion.div)`
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
  margin-top: 10px;
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

const FieldLabel = styled(Typography)`
  font-family: 'Roboto, Helvetica, Arial, sans-serif';
  text-align: left;
  margin-top: 20px;
  color: #FF217A;
`;

const CenterInfoPage = () => {
  const navigate = useNavigate();
  const [centerName, setCenterName] = useState('');
  const [centerPhone, setCenterPhone] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationFetched, setLocationFetched] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationFetched(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          
        }

      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!locationFetched) {
        setSubmitError('Please fetch location before submitting.');
        return;
      }

      if (!auth.currentUser) {
        throw new Error("User not authenticated");
      }
      const geofirepoint = new GeoFirePoint(latitude, longitude);
      await setDoc(doc(firestore, 'centers', auth.currentUser.uid), {
        centerName,
        centerEmail: userEmail,
        centerPhone,
        openingTime,
        closingTime,
        position: geofirepoint.data,
        centerId: auth.currentUser.uid,
      });
      navigate('/home');
    } catch (error) {
      console.error("Error saving center info:", error.message);
    }
  };

  return (
    <Background>
      <Sparkles>
        {createSparkles()}
      </Sparkles>
      <CenterForm
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <FormTypography variant="h4">Center Info</FormTypography>
        <form onSubmit={handleSubmit}>
          <FieldLabel variant="body1">Center Name</FieldLabel>
          <StyledTextField
            type="text"
            id="centerName"
            name="centerName"
            value={centerName}
            onChange={(e) => setCenterName(e.target.value)}
            required
            placeholder="Center Name"
          />
          <FieldLabel variant="body1">Center Phone Number</FieldLabel>
          <StyledTextField
            type="text"
            id="centerPhone"
            name="centerPhone"
            value={centerPhone}
            onChange={(e) => setCenterPhone(e.target.value)}
            required
            placeholder="Center Phone Number"
          />
          <FieldLabel variant="body1">Opening Time</FieldLabel>
          <StyledTextField
            type="time"
            id="openingTime"
            name="openingTime"
            value={openingTime}
            onChange={(e) => setOpeningTime(e.target.value)}
            required
            placeholder="Opening Time"
          />
          <FieldLabel variant="body1">Closing Time</FieldLabel>
          <StyledTextField
            type="time"
            id="closingTime"
            name="closingTime"
            value={closingTime}
            onChange={(e) => setClosingTime(e.target.value)}
            required
            placeholder="Closing Time"
          />
          {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
          <StyledButton
            type="button"
            onClick={getCurrentLocation}
            disabled={locationFetched}
          >
            {locationFetched ? 'Location Fetched' : 'Get Current Location'}
          </StyledButton>
          <StyledButton
            type="submit"
            disabled={!locationFetched}
          >
            Save Center Info
          </StyledButton>
        </form>
      </CenterForm>
    </Background>
  );
}

export default CenterInfoPage;
