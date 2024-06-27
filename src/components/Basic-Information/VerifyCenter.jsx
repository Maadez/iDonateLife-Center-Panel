import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

const VerifyCenter = () => {
  const [verificationStatus, setVerificationStatus] = useState('Verifying...');
  const location = useLocation();

  useEffect(() => {
    const verifyCenter = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const centerId = params.get('centerId');

      if (!token || !centerId) {
        setVerificationStatus('Invalid verification link');
        return;
      }

      try {
        const centerRef = doc(firestore, 'centers', centerId);
        const centerDoc = await getDoc(centerRef);

        if (!centerDoc.exists()) {
          setVerificationStatus('Center not found');
          return;
        }

        const centerData = centerDoc.data();

        if (centerData.verificationToken !== token) {
          setVerificationStatus('Invalid verification token');
          return;
        }

        // Update verificationStatus to true
        await updateDoc(centerRef, {
          verificationStatus: true,
          verificationToken: null, // Clear the token after use
        });

        setVerificationStatus('Center verified successfully');
        // Display interactive message instead of navigating
        // For example, alert or confirm dialog
        window.alert('Center has been verified. Please close this tab.');
      } catch (error) {
        console.error('Error verifying center:', error);
        setVerificationStatus('Error verifying center');
      }
    };

    verifyCenter();
  }, [location]);

  return (
    <div>
      <h1>Center Verification</h1>
      <p>{verificationStatus}</p>
    </div>
  );
};

export default VerifyCenter;
