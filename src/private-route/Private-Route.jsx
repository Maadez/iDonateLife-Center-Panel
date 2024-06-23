import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../firebase';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'; // Import Material-UI components

function PrivateRoute() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false); // State for confirmation dialog

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    // Open the confirmation dialog
    setConfirmLogoutOpen(true);
  };

  const handleConfirmLogout = () => {
    // Perform logout actions here (if needed)

    // Navigate to the login page
    auth.signOut(); // Example sign-out function from Firebase
    setConfirmLogoutOpen(false);
  };

  const handleCancelLogout = () => {
    // Close the confirmation dialog
    setConfirmLogoutOpen(false);
  };

  if (loading) {
    return (
      
      <div className="flex items-center justify-center h-screen ">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-900"></div>
    </div>
   
    )
  }

  return authenticated ? (
    <>
      <Outlet />
      {/* Confirmation dialog for logout */}
      <Dialog open={confirmLogoutOpen} onClose={() => setConfirmLogoutOpen(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          Are you sure you want to log out?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLogout} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  ) : (
    <Navigate to="/" />
  );
}

export default PrivateRoute;
