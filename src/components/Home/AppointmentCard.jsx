import React, { useState } from 'react';
import { firestore } from '../../firebase'; // Adjust the import based on your firebase setup
import { doc, updateDoc } from 'firebase/firestore';

export default function AppointmentCard({ appointment }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [newStatusToUpdate, setNewStatusToUpdate] = useState('');

  const handleUpdateStatus = async () => {
    try {
      const appointmentDocRef = doc(firestore, 'appointments', appointment.appointmentId);
      await updateDoc(appointmentDocRef, {
        appointmentStatus: newStatusToUpdate,
      });
      console.log(`Appointment status updated to ${newStatusToUpdate}`);
      setShowConfirmation(false); // Close confirmation dialog after status update
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const handleCancelAppointment = async () => {
    try {
      const appointmentDocRef = doc(firestore, 'appointments', appointment.appointmentId);
      await updateDoc(appointmentDocRef, {
        appointmentStatus: 'cancelled', // Assuming 'cancelled' is the status for cancellation
      });
      console.log('Appointment canceled successfully');
      setShowConfirmation(false); // Close confirmation dialog after cancellation
    } catch (error) {
      console.error('Error canceling appointment:', error);
    }
  };

  const handleStatusUpdateClick = (newStatus) => {
    setNewStatusToUpdate(newStatus);
    setShowConfirmation(true);
  };

  return (
    <li className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <p className="text-gray-600">
        <strong>Address:</strong> {appointment.address || 'N/A'}
      </p>
      <p className="text-gray-600">
        <strong>Case:</strong> {appointment.appointmentCase || 'N/A'}
      </p>
      <p className="text-gray-600">
        <strong>Creator Name:</strong> {appointment.appointmentCreaterName || 'N/A'}
      </p>
      <p className="text-gray-600">
        <strong>Creator Phone No:</strong> {appointment.appointmentCreaterPhoneNo || 'N/A'}
      </p>
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
      <p className="text-gray-600">
        <strong>Type:</strong> {appointment.appointmentType || 'N/A'}
      </p>
      <p className="text-gray-600">
        <strong>Blood Bags:</strong> {appointment.bloodBags || 'N/A'}
      </p>
      <p className="text-gray-600">
        <strong>Blood Group:</strong> {appointment.bloodGroup || 'N/A'}
      </p>

      {showConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-auto">
            <p className="text-gray-700 mb-4">Are you sure?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm
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
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
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
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
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
