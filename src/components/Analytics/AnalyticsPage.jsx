import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Tooltip, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Label } from 'recharts';
import Sidebar from '../Home/Sidebar';
import { firestore, collection, getDocs } from '../../firebase';

const Container = styled.div`
  display: flex;
  margin-left: 0px;
  background: #9c88ff;
  padding-top: 20px;
 
`;

const Content = styled.div`
  display: flex;
  margin-left: 250px;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const CardContainer = styled.div`
  width: 45%;
  padding: 20px;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 20px;
`;

const COLORS = ['#FF217A', '#FF4D4D', '#FF728B', '#FFA3B1'];

const AnalyticsPage = () => {
  const [genderData, setGenderData] = useState([]);
  const [bloodGroupData, setBloodGroupData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [appointmentData, setAppointmentData] = useState([]);
  const [activeBloodRequestData, setActiveBloodRequestData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const usersCollection = collection(firestore, 'users');
      const usersSnapshot = await getDocs(usersCollection);

      const genderCounts = {};
      const bloodGroupCounts = {};
      const ageCounts = {};

      usersSnapshot.forEach(doc => {
        const user = doc.data();
        
        // Count gender distribution
        const gender = user.gender.toLowerCase();
        if (genderCounts[gender]) {
          genderCounts[gender]++;
        } else {
          genderCounts[gender] = 1;
        }

        // Count blood group distribution
        const bloodGroup = user.bloodGroup;
        if (bloodGroupCounts[bloodGroup]) {
          bloodGroupCounts[bloodGroup]++;
        } else {
          bloodGroupCounts[bloodGroup] = 1;
        }

        // Calculate age and count age distribution
        const birthDate = user.dob.toDate(); // assuming dob is a Firestore Timestamp
        const age = new Date().getFullYear() - birthDate.getFullYear();
        if (ageCounts[age]) {
          ageCounts[age]++;
        } else {
          ageCounts[age] = 1;
        }
      });

      // Transform gender data for pie chart
      const transformedGenderData = Object.keys(genderCounts).map((key, index) => ({
        name: key,
        value: genderCounts[key],
        fill: COLORS[index % COLORS.length],
      }));

      // Transform blood group data for bar chart
      const transformedBloodGroupData = Object.keys(bloodGroupCounts).map((key, index) => ({
        name: key,
        value: bloodGroupCounts[key],
        fill: COLORS[index % COLORS.length],
      }));

      // Transform age data for bar chart
      const transformedAgeData = Object.keys(ageCounts).map((key, index) => ({
        name: key,
        value: ageCounts[key],
        fill: COLORS[index % COLORS.length],
      }));

      setGenderData(transformedGenderData);
      setBloodGroupData(transformedBloodGroupData);
      setAgeData(transformedAgeData);
    };

    const fetchAppointmentData = async () => {
      const appointmentsCollection = collection(firestore, 'appointments');
      const appointmentsSnapshot = await getDocs(appointmentsCollection);

      const appointmentStatusCounts = {};

      appointmentsSnapshot.forEach(doc => {
        const appointment = doc.data();
        
        // Count appointment status distribution
        const status = appointment.appointmentStatus.toLowerCase();
        if (appointmentStatusCounts[status]) {
          appointmentStatusCounts[status]++;
        } else {
          appointmentStatusCounts[status] = 1;
        }
      });

      // Transform appointment status data for bar chart
      const transformedAppointmentData = Object.keys(appointmentStatusCounts).map((key, index) => ({
        name: key,
        value: appointmentStatusCounts[key],
        fill: COLORS[index % COLORS.length],
      }));

      setAppointmentData(transformedAppointmentData);
    };

    const fetchRequestData = async () => {
      const requestsCollection = collection(firestore, 'requests');
      const requestsSnapshot = await getDocs(requestsCollection);

      const activeBloodRequestCounts = {};

      requestsSnapshot.forEach(doc => {
        const request = doc.data();
        
        if (request.isActive) {
          const bloodGroup = request.bloodGroup;
          if (activeBloodRequestCounts[bloodGroup]) {
            activeBloodRequestCounts[bloodGroup]++;
          } else {
            activeBloodRequestCounts[bloodGroup] = 1;
          }
        }
      });

      // Transform active blood request data for bar chart
      const transformedActiveBloodRequestData = Object.keys(activeBloodRequestCounts).map((key, index) => ({
        name: key,
        value: activeBloodRequestCounts[key],
        fill: COLORS[index % COLORS.length],
      }));

      setActiveBloodRequestData(transformedActiveBloodRequestData);
    };

    fetchUserData();
    fetchAppointmentData();
    fetchRequestData();
  }, []);

  return (
    <Container>
      <Sidebar showSidebar={true} />
      <Content>
        <Row>
          <CardContainer style={{ paddingLeft: '50px' }}>
            <h2 style={{ textAlign: 'center', paddingRight: '50px' }}>Gender Distribution</h2>
            <PieChart width={450} height={400}>
              <Pie
                data={genderData}
                cx={220}
                cy={200}
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </CardContainer>
          <CardContainer>
            <h2 style={{ textAlign: 'center' }}>Blood Group Distribution</h2>
            <BarChart width={500} height={400} data={bloodGroupData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name">
                <Label value="Blood Groups" offset={-10} position="insideBottom" />
              </XAxis>
              <YAxis>
                <Label value="Users" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="transparent"/>
            </BarChart>
          </CardContainer>
        </Row>
        <Row>
          <CardContainer>
            <h2 style={{ textAlign: 'center' }}>Age Distribution</h2>
            <BarChart width={500} height={400} data={ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name">
                <Label value="Age" offset={-10} position="insideBottom" />
              </XAxis>
              <YAxis>
                <Label value="Users" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="transparent" />
            </BarChart> 
          </CardContainer>
          <CardContainer>
            <h2 style={{ textAlign: 'center' }}>Appointment Status Distribution</h2>
            <BarChart width={500} height={400} data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name">
                <Label value="Appointment Status" offset={-10} position="insideBottom" />
              </XAxis>
              <YAxis>
                <Label value="Users" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip />
              <Legend />
              <Bar  dataKey="value" fill="transparent"  />
            </BarChart>
          </CardContainer>
        </Row>
        <Row>

    <CardContainer style={{width:'80%'}} >
    <h2 style={{ textAlign: 'center' }}>Active Blood Request Distribution</h2>
    <BarChart width={930} height={400} data={activeBloodRequestData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name">
        <Label value="Blood Group" offset={-10} position="insideBottom" />
      </XAxis>
      <YAxis>
        <Label value="Requests" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
      </YAxis>
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="transparent" />
    </BarChart>
  </CardContainer>
 
</Row>
      </Content>
    </Container>
  );
};

export default AnalyticsPage;