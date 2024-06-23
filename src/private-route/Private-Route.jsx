import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../firebase';

function PrivateRoute() {
  return auth.currentUser ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;
