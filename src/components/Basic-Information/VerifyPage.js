import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { firestore } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const VerifyPage = () => {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const verifyCenter = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const centerId = params.get('centerId');

      if (!token || !centerId) {
        alert('Invalid verification link');
        return;
      }

      try {
        const centerRef = doc(firestore, 'centers', centerId);
        await updateDoc(centerRef, {
          verificationStatus: true,
          verificationToken: null, // Clear the token after use
        });
        alert('Center verified successfully');
        history.push('/login'); // Redirect to login page after verification
      } catch (error) {
        console.error('Error verifying center:', error);
        alert('Error verifying center');
      }
    };

    verifyCenter();
  }, [location, history]);

  return (
    <div>
      <h1>Verifying Center...</h1>
    </div>
  );
};

export default VerifyPage;
