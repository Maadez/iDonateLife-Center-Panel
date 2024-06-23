import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Sidebar from '../Home/Sidebar'; // Adjust import path as per your project
import { collection, getDocs } from 'firebase/firestore'; // Adjust Firebase imports based on your setup
import { firestore } from '../../firebase'; // Adjust import path based on your Firebase setup
import { MdCheckCircle, MdCancel, MdPerson, MdFilterList } from 'react-icons/md'; // Import icons from react-icons library

const Container = styled.div`
  display: flex;
  background: #9c88ff;
  flex-direction: column;
  align-items: center;
  padding-left:220px;
  min-height: 100%;
`;



const TableContainer = styled.div`
  width:90%;
  max-width: 1200px;
   min-height: 100;
  background: #9c88ff;
  margin-left:15px;
  margin-bottom: 10px;

  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
   background-color: rgba(255, 255, 255, 0.8); /* Light background */
  border-radius: 12px;
  opacity: 0.99;
`;

const TableHeader = styled.thead`
  background-color: #18283b;; /* Blue background for header */
  color: #fff; /* White text color */
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
 
 border: solid #9c88ff 1px;
 box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
`;

const TableCell = styled.td`
  padding: 15px;
  text-align: left;
  font-family: 'Roboto', sans-serif; /* Use Roboto or another clean sans-serif font */
  font-size: 14px; /* Adjust font size as per your design */
  font-weight: 400; /* Normal font weight */
`;

const ProfileImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 0%;
  margin-right: 0px;
`;

const EligibilityIcon = styled.span`
  font-size: 22px;
  margin-left:0px
  vertical-align: middle;
  color: ${props => (props.eligible ? 'green' : 'red')};
`;

const FilterContainer = styled.div`
  width: 100%;
  max-width: 500px; /* Increased max-width */
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  flex: 1;
  margin-right: 10px;
  transition: all 0.3s ease; /* Smooth transition for hover effect */

  &:hover {
    background-color: #007bff;
    color: white;
    transform: scale(1.05); /* Grow on hover */
  }
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
`;

const FilterIcon = styled.span`
  margin-right: 5px; /* Increased margin for better spacing */
`;
const UserInfo = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [femaleImage, setFemaleImage] = useState(null);
  const [maleImage, setMaleImage] = useState(null);
  const [eligibilityFilter, setEligibilityFilter] = useState('All');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map(doc => ({
          ...doc.data(),
          eligible: Math.random() < 0.5 ? 'Eligible' : 'Not Eligible', // Randomly assign eligibility
        }));
        setUsers(usersData);
        setFilteredUsers(usersData); // Initially set filtered users to all users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleFemaleImageChange = (event) => {
    const file = event.target.files[0];
    setFemaleImage(file);
  };

  const handleMaleImageChange = (event) => {
    const file = event.target.files[0];
    setMaleImage(file);
  };

  const renderProfileImage = (gender) => {
    if (gender === 'female' && femaleImage) {
      return URL.createObjectURL(femaleImage);
    } else if (gender === 'male' && maleImage) {
      return URL.createObjectURL(maleImage);
    } else {
      return gender === 'female' ? '/src/assets/female.png' : '/src/assets/male.png';
    }
  };

  const handleEligibilityFilterChange = (event) => {
    const value = event.target.value;
    setEligibilityFilter(value);
    filterUsers(value, bloodGroupFilter, genderFilter);
  };

  const handleBloodGroupFilterChange = (event) => {
    const value = event.target.value;
    setBloodGroupFilter(value);
    filterUsers(eligibilityFilter, value, genderFilter);
  };

  const handleGenderFilterChange = (event) => {
    const value = event.target.value;
    setGenderFilter(value);
    filterUsers(eligibilityFilter, bloodGroupFilter, value);
  };

  const filterUsers = (eligibility, bloodGroup, gender) => {
    let filtered = users;

    if (eligibility !== 'All') {
      filtered = filtered.filter(user => user.eligible === eligibility);
    }

    if (bloodGroup !== 'All') {
      filtered = filtered.filter(user => user.bloodGroup === bloodGroup);
    }

    if (gender !== 'All') {
      filtered = filtered.filter(user => user.gender === gender);
    }

    setFilteredUsers(filtered);
  };

  return (
    
    <Container style={{minHeight: "100vh"}}>
        
      <Sidebar showSidebar={true} />
      <FilterContainer style={{marginTop:"50px"}}> Filters
        <FilterLabel>
          <FilterIcon><MdFilterList /></FilterIcon>
          <FilterSelect value={eligibilityFilter} onChange={handleEligibilityFilterChange}>
            <option value="All">All Eligibility</option>
            <option value="Eligible">Eligible</option>
            <option value="Not Eligible">Not Eligible</option>
          </FilterSelect>
        </FilterLabel>
        <FilterLabel>
          <FilterIcon><MdFilterList /></FilterIcon>
          <FilterSelect value={bloodGroupFilter} onChange={handleBloodGroupFilterChange}>
            <option value="All">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="B+">B+</option>
            <option value="O+">O+</option>
            <option value="AB+">AB+</option>
            <option value="A-">A-</option>
            <option value="B-">B-</option>
            <option value="O-">O-</option>
            <option value="AB-">AB-</option>
          </FilterSelect>
        </FilterLabel>
        <FilterLabel>
          <FilterIcon><MdPerson /></FilterIcon>
          <FilterSelect value={genderFilter} onChange={handleGenderFilterChange}>
            <option value="All">All Genders</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </FilterSelect>
        </FilterLabel>
      </FilterContainer>
      <TableContainer >
        <Table >
          <TableHeader>
            <TableRow>
              <TableCell>Users</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Blood Group</TableCell>
              <TableCell>Eligibility</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell>
                  <ProfileImage
                    src={renderProfileImage(user.gender)}
                    alt="Profile"
                  />
                  {user.gender === 'female' ? 'Female' : 'Male'}
                </TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.phoneNo}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.bloodGroup}</TableCell>
                <TableCell>
                  {user.eligible === 'Eligible' ? (
                    <EligibilityIcon eligible>
                      <MdCheckCircle />
                    </EligibilityIcon>
                  ) : (
                    <EligibilityIcon>
                      <MdCancel />
                    </EligibilityIcon>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <input type="file" accept="image/*" onChange={handleFemaleImageChange} style={{ display: 'none' }} id="femaleImageInput" />
      <input type="file" accept="image/*" onChange={handleMaleImageChange} style={{ display: 'none' }} id="maleImageInput" />
    </Container>
  );
};

export default UserInfo;
