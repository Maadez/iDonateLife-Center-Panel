import React, { useState } from 'react';
import styled from 'styled-components';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import AppointmentsList from '../Home/AppointmentList';
import Sidebar from '../Home/Sidebar'; // Adjust import path as per your project

const Container = styled.div`
  display: flex;
 flex-direction: column;
  height: 100%;
  background:#9c88ff;
  min-height: 100%;
`;

const Content = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

const HomePage = () => {
  const navigate = useNavigate();
  const [showAppointments, setShowAppointments] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true); // State to manage sidebar visibility

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <Container  style={{ background: '#9c88ff' , paddingLeft: '220px' }}>
      <Sidebar
        showSidebar={showSidebar}
      
        setLogoutDialogOpen={setLogoutDialogOpen}
      />
      <Content>{showAppointments && <AppointmentsList />}
     
      </Content>
    </Container>
  );
}

export default HomePage;
