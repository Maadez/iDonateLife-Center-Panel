import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { auth } from '../../firebase'; // Adjust import path as per your project
import { FaCalendarAlt, FaChartLine, FaUser, FaCog } from 'react-icons/fa'; // Import icons as needed

const SidebarContainer = styled.div`
  width: 256px; /* Match --navbar-width */
  background: rgba(24, 40, 59, 0.9); /* Match --navbar-dark-primary */
  color: #f5f6fa; /* Match --navbar-light-primary */
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px; /* Adjust padding for header */
  height: 87%;
  position: fixed;
  top: 78px; /* Move the sidebar down from the top */
  left: 8px;
  z-index: 30;
  overflow: hidden; /* Ensure content doesn't overflow */
  border-radius: 15px 15px 15px 15px; /* Rounded corners only at the top */
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2); /* Floating effect shadow */
`;

const HeaderText = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
  text-align: center;
  position: relative;
  color: #18283b; /* Match --navbar-dark-primary */

  &:before {
    content: 'i ';
    position: absolute;
    left: 0;
    top: 0;
    color: red; /* Green color */
  }

  &:after {
    content: 'Donate Life';
    position: absolute;
    right: 0;
    top: 0;
    color: white; /* Red color */
  }
`;

const SidebarButton = styled.button`
  background: #2c3e50; /* Match --navbar-dark-secondary */
  border: none;
  border-radius: 4px;
  padding: 12px; /* Adjust padding */
  margin: 8px 0;
  width: calc(100% - 24px); /* Adjust width */
  cursor: pointer;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 14px; /* Adjust font size */
  display: flex;
  color:#f5f6fa;
  align-items: center;
  justify-content: flex-start;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;

  &:hover {
    background: #8392a5; /* Match --navbar-light-secondary */
    color: #18283b; /* Match --navbar-dark-primary */
    transform: scale(1.05);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Hover shadow effect */
  }
`;

const IconWrapper = styled.span`
  margin-right: 8px;
`;

const LogoutButton = styled(SidebarButton)`
  background: #2c3e50; /* Match --navbar-light-primary */
  color:#f5f6fa; /* Match --navbar-dark-primary */

  &:hover {
    background: red; /* Match --background */
    color: white;
  }
`;

const SettingsButton = styled(SidebarButton)`
  background: #2c3e50; /* Match --navbar-dark-secondary */
  color: #f5f6fa; /* Match --navbar-light-primary */

  &:hover {
    background: #8392a5; /* Match --navbar-light-secondary */
    color: #18283b; /* Match --navbar-dark-primary */
  }
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const handleSettingsNavigation = () => {
    navigate('/settings');
  };

  return (
    <SidebarContainer>
      <HeaderText>iDonate Life</HeaderText>

      <SidebarButton onClick={() => handleNavigation('/home')}>
        <IconWrapper><FaCalendarAlt /></IconWrapper>
        Appointments
      </SidebarButton>

      <SidebarButton onClick={() => handleNavigation('/analytics')}>
        <IconWrapper><FaChartLine /></IconWrapper>
        Visual Analytics
      </SidebarButton>

      <SidebarButton onClick={() => handleNavigation('/userinfo')}>
        <IconWrapper><FaUser /></IconWrapper>
        Users Information
      </SidebarButton>

      <SettingsButton onClick={handleSettingsNavigation}>
        <IconWrapper><FaCog /></IconWrapper>
        Settings
      </SettingsButton>

      <LogoutButton onClick={() => setLogoutDialogOpen(true)}>
        Logout
      </LogoutButton>

      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      >
        <DialogTitle>{"Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </SidebarContainer>
  );
};

export default Sidebar;
