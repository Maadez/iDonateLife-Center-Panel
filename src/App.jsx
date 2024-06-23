
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupPage from './components/Auth/SignUpPage';
import CenterInfoPage from './components/Basic-Information/CenterInformationPage';
import PrivateRoute from './private-route/Private-Route';
import LoginPage from './components/Auth/LoginPage';
import HomePage from './components/Home/HomePage';
import AnalyticsPage from './components/Analytics/AnalyticsPage';
import { auth } from './firebase'; 
import UserInfo from './components/Home/UserInfo';
import Navbar from './components/Home/Navbar'; // Adjust the path based on your file structure
import SettingsPage from './components/Home/SettingsPage'; // Import the SettingsPage component


function App() {

  const isLoggedIn = !!auth.currentUser;

  return (
  
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/center-info" element={<PrivateRoute />}>
          <Route path="" element={<NavbarWrapper><CenterInfoPage /></NavbarWrapper>} />
        </Route>
        <Route path="/home" element={<PrivateRoute />}>
          <Route path="" element={<NavbarWrapper><HomePage /></NavbarWrapper>} />
        </Route>
        <Route path="/analytics" element={<PrivateRoute />}>
          <Route path="" element={<NavbarWrapper><AnalyticsPage /></NavbarWrapper>} />
        </Route>
        <Route path="/userinfo" element={<PrivateRoute />}>
          <Route path="" element={<NavbarWrapper><UserInfo /></NavbarWrapper>} />
        </Route>
        <Route path="/settings" element={<PrivateRoute />}>
          <Route path="" element={<NavbarWrapper><SettingsPage /></NavbarWrapper>} />
        </Route>
      </Routes>
    </Router>
   
  );
}

const NavbarWrapper = ({ children }) => (
  <>
    <Navbar />
    <div style={{ paddingTop: '60px' }}> {/* Adjust paddingTop to avoid overlap with the navbar */}
      {children}
    </div>
  </>
);

export default App;