import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // Import your Firebase auth instance

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the current user
      navigate('/'); // Redirect to the login page or any other page after logout
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-indigo-600 hover:text-indigo-900"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
