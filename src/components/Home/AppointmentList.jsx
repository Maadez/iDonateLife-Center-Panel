import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../../firebase'; // Adjust the import based on your firebase setup
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import AppointmentCard from './AppointmentCard';

function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('pending');
  const [loadingAnimation, setLoadingAnimation] = useState(true); // State for loading animation

  useEffect(() => {
    let unsubscribe;
    const fetchAppointments = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const q = query(
            collection(firestore, 'appointments'),
            where('appointmentParticipantId', '==', currentUser.uid)
          );
          unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedAppointments = querySnapshot.docs.map(doc => doc.data());
            setAppointments(fetchedAppointments);
            setLoading(false);
          });
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };

    fetchAppointments();

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Simulate loading animation with a timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingAnimation(false);
    }, 2000); // Set a timeout of 2000ms (adjust as needed)

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white-900"></div>
      </div>
    );
  }

  const filteredAppointments = appointments.filter(appointment => appointment.appointmentStatus === selectedSection);

  return (
   
    <div style={{    background: '#9c88ff', width: '100%', minHeight: '100vh',height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
      <h2 className="text-2xl font-bold mb-6 text-center" style={{ background: 'linear-gradient(135deg, #5DADE2, #3498DB)', color: 'white', padding: '10px', borderRadius: '5px' }}>
        Appointments
      </h2>

      <div className="flex justify-around mb-8" style={{ width: '80%' }}>
        <button
          onClick={() => setSelectedSection('pending')}
          className={`px-4 py-2 rounded-lg ${selectedSection === 'pending' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Pending
        </button>
        <button
          onClick={() => setSelectedSection('approved')}
          className={`px-4 py-2 rounded-lg ${selectedSection === 'approved' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Approved
        </button>
        <button
          onClick={() => setSelectedSection('inProgress')}
          className={`px-4 py-2 rounded-lg ${selectedSection === 'inProgress' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          In Progress
        </button>
        <button
          onClick={() => setSelectedSection('completed')}
          className={`px-4 py-2 rounded-lg ${selectedSection === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Completed
        </button>
      </div>

      <ul className="space-y-4" style={{ width: '80%' }}>
        {filteredAppointments.map((appointment) => (
          <AppointmentCard key={appointment.appointmentId} appointment={appointment} />
        ))}
      </ul>
    </div>
    
  );
}

export default AppointmentsList;
