import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { doc, updateDoc, getDoc, getFirestore } from 'firebase/firestore';
import DatePicker from 'react-datepicker';
import { Calendar, Clock } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const firestore = getFirestore();

export default function AppointmentCard({ appointment }) {
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [newDateTime, setNewDateTime] = useState(new Date());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [action, setAction] = useState('');

  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/');
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  const handleUpdateStatus = async () => {
    try {
      const appointmentDocRef = doc(firestore, 'appointments', appointment.appointmentId);
      const updateData = action === 'approved' ? { appointmentStatus: action, appointmentDateTime: newDateTime, participantIsCompleted: action === 'completed' } : { appointmentStatus: action };

      await updateDoc(appointmentDocRef, updateData);
      console.log(`Appointment status updated to ${action}`);
      setShowDateTimePicker(false);
      setShowConfirmation(false);

      // Send notification
      await sendNotification(appointment.appointmentCreaterId, action);
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const sendNotification = async (userId, newStatus) => {
    try {
      const userDocRef = doc(firestore, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.error('No such user!');
        return;
      }

      const userData = userDoc.data();
      const payload = {
        to: userData.fcmToken,
        priority: 'high',
        notification: {
          title: 'iDonate Life',
          body: `Your appointment status has been changed to ${newStatus}`,
        },
        data: {
          receiverId: userId,
        },
      };

      const response = await axios.post('https://fcm.googleapis.com/fcm/send', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=AAAAaFJxmek:APA91bHLjMjjx2mK_AHsdsRsVigrj8O8huEG5MB6QBxyTebMyZeSR58X9jQtUlq0Bd_3rM2bagmnhoHNBUGiLbN_i8JUfPDHBxfKWBK35RMWQm-nm3a3C11pV-4HV8mw1iW4Uk8kQjl7`,
        },
      });

      if (response.status === 200) {
        console.log('Notification sent successfully');
      } else {
        console.error('Failed to send notification:', response.data);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleStatusUpdateClick = (newStatus) => {
    if (newStatus === 'approved' && appointment.appointmentStatus === 'pending') {
      setShowDateTimePicker(true);
    } else {
      setAction(newStatus);
      setShowConfirmation(true);
    }
  };

  return (
    <li className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <p className="text-gray-600"><strong>Address:</strong> {appointment.address || 'N/A'}</p>
      <p className="text-gray-600"><strong>Case:</strong> {appointment.appointmentCase || 'N/A'}</p>
      <p className="text-gray-600"><strong>Creator Name:</strong> {appointment.appointmentCreaterName || 'N/A'}</p>
      <p className="text-gray-600"><strong>Creator Phone No:</strong> {appointment.appointmentCreaterPhoneNo || 'N/A'}</p>
      <p className="text-gray-600">
        <strong>Date Time:</strong>{' '}
        {appointment.appointmentDateTime
          ? appointment.appointmentDateTime.toDate().toLocaleString()
          : 'N/A'}
      </p>
      <p className="text-gray-600">
        <strong>Status:</strong>{' '}
        <span
          className={`px-2 py-1 rounded ${
            appointment.appointmentStatus === 'approved'
              ? 'bg-green-100 text-green-800'
              : appointment.appointmentStatus === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : appointment.appointmentStatus === 'inProgress'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {appointment.appointmentStatus || 'N/A'}
        </span>
      </p>
      <p className="text-gray-600"><strong>Type:</strong> {appointment.appointmentType || 'N/A'}</p>
      <p className="text-gray-600"><strong>Blood Bags:</strong> {appointment.bloodBags || 'N/A'}</p>
      <p className="text-gray-600"><strong>Blood Group:</strong> {appointment.bloodGroup || 'N/A'}</p>

      {showDateTimePicker && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-sm w-full mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Schedule Date and Time</h2>
            <div className="relative mb-4">
              <DatePicker
                selected={newDateTime}
                onChange={(date) => setNewDateTime(date)}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                calendarClassName="bg-white shadow-lg rounded-md"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <div className="mb-4 flex items-center text-sm text-gray-600">
              <Clock size={16} className="mr-2" />
              <span>Current selection: {newDateTime.toLocaleString()}</span>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDateTimePicker(false)}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setAction('approved');
                  setShowConfirmation(true);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-auto">
            <p className="text-gray-700 mb-4">Are you sure?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {appointment.appointmentStatus === 'pending' && (
        <>
          <button
            onClick={() => handleStatusUpdateClick('approved')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            Mark as Approved
          </button>
          <button
            onClick={() => handleStatusUpdateClick('cancelled')}
            className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
          >
            Mark as Cancel
          </button>
        </>
      )}
      {appointment.appointmentStatus === 'approved' && (
        <>
          <button
            onClick={() => handleStatusUpdateClick('inProgress')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            Mark as In Progress
          </button>
          <button
            onClick={() => handleStatusUpdateClick('cancelled')}
            className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
          >
            Mark as Cancel
          </button>
        </>
      )}
      {appointment.appointmentStatus === 'inProgress' && (
        <>
          <button
            onClick={() => handleStatusUpdateClick('completed')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
          >
            Mark as Completed
          </button>
          <button
            onClick={() => handleStatusUpdateClick('cancelled')}
            className="mt-4 ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
          >
            Mark as Cancel
          </button>
        </>
      )}
    </li>
  );
}
