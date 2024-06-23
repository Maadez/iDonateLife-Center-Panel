import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import styled, { keyframes } from 'styled-components';
import { Container, Button as MuiButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Sidebar from '../Home/Sidebar'; // Adjust import path as per your project

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SettingsPageContainer = styled.div`
  font-family: 'Roboto', sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const CenterDetails = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.2); /* Added box-shadow */
  animation: ${fadeIn} 0.5s ease-out;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  label {
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }
`;

const CenterInfo = styled.div`
  p {
    margin: 10px 0;
    font-size: 16px;
  }
`;

const Button = styled(MuiButton)`
  && {
    padding: 10px 20px;
    margin-top: 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
      background-color: #45a049;
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

const EditButton = styled(Button)`
  && {
    background-color: #2196F3;

    &:hover {
      background-color: #1e88e5;
    }
  }
`;

const SaveButton = styled(Button)`
  && {
    background-color: #4CAF50;

    &:hover {
      background-color: #45a049;
    }
  }
`;

const BackButton = styled(Button)`
  && {
    background-color: #f44336;

    &:hover {
      background-color: #d32f2f;
    }
  }
`;

const SettingsPage = (props) => {
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    centerName: '',
    centerPhone: '',
    openingTime: '',
    closingTime: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    const fetchData = async (userId) => {
      try {
        const centersCollection = collection(firestore, 'centers');
        const q = query(centersCollection, where('centerId', '==', userId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const centerData = querySnapshot.docs[0].data();
          setCenter({ id: querySnapshot.docs[0].id, ...centerData });
          setFormData({
            centerName: centerData.centerName,
            centerPhone: centerData.centerPhone,
            openingTime: centerData.openingTime,
            closingTime: centerData.closingTime
          });
        } else {
          console.error('No center found for the current user.');
        }
      } catch (error) {
        console.error('Error fetching center:', error);
      } finally {
        setLoading(false);
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user.uid);
        console.log(user.uid);
      } else {
        console.error('No user is currently logged in.');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBack = () => {
    setIsEditing(false);
    setShowConfirmation(false); // Reset confirmation state
  };

  const handleSave = async () => {
    setShowConfirmation(false); // Hide confirmation dialog

    if (center) {
      const centerRef = doc(firestore, 'centers', center.id);
      try {
        await updateDoc(centerRef, formData);
        setCenter({ ...center, ...formData });
        setIsEditing(false);
        setShowSuccessDialog(true); // Show success dialog after saving
      } catch (error) {
        console.error('Error updating center:', error);
      }
    }
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false); // Close success dialog
  };

  return (
    <Container style={{ minHeight: "100vh" }}>
      <Sidebar showSidebar={true} />
      <SettingsPageContainer>
        <h1 style={{textAlign:"center"}}>Center Data</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          center ? (
            <CenterDetails>
              {isEditing ? (
                <FormContainer>
                  <label>
                    Center Name:
                    <input
                      type="text"
                      name="centerName"
                      value={formData.centerName}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Phone:
                    <input
                      type="text"
                      name="centerPhone"
                      value={formData.centerPhone}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Opening Time:
                    <input
                      type="time"
                      name="openingTime"
                      value={formData.openingTime}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Closing Time:
                    <input
                      type="time"
                      name="closingTime"
                      value={formData.closingTime}
                      onChange={handleChange}
                    />
                  </label>
                  <Dialog
                    open={showConfirmation}
                    onClose={() => setShowConfirmation(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">{"Confirm Save Changes"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Are you sure you want to save these changes?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setShowConfirmation(false)} style={{background:"red"}}>
                        Cancel
                      </Button>
                      <SaveButton onClick={handleSave} autoFocus>
                        Save
                      </SaveButton>
                    </DialogActions>
                  </Dialog>
                  <SaveButton onClick={() => setShowConfirmation(true)}>Save</SaveButton>
                  <BackButton onClick={handleBack}>Back</BackButton>
                </FormContainer>
              ) : (
                <CenterInfo>
                  <p><strong>Center Name:</strong> {center.centerName}</p>
                  <p><strong>Phone:</strong> {center.centerPhone}</p>
                  <p><strong>Opening Time:</strong> {center.openingTime}</p>
                  <p><strong>Closing Time:</strong> {center.closingTime}</p>
                  <EditButton onClick={handleEdit}>Edit</EditButton>
                </CenterInfo>
              )}
            </CenterDetails>
          ) : (
            <p>No center found for the current user.</p>
          )
        )}
        <Dialog
          open={showSuccessDialog}
          onClose={handleCloseSuccessDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Success"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Center settings have been updated successfully.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSuccessDialog} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </SettingsPageContainer>
    </Container>
  );
};

export default SettingsPage;
