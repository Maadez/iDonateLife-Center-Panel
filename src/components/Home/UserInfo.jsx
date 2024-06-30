import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Sidebar from '../Home/Sidebar'; // Adjust import path as per your project
import { collection, getDocs, query, where } from 'firebase/firestore'; // Adjust Firebase imports based on your setup
import { firestore } from '../../firebase'; // Adjust import path based on your Firebase setup
import { MdCheckCircle, MdCancel, MdPerson, MdFilterList, MdSearch } from 'react-icons/md'; // Import icons from react-icons library
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Import Recharts components

const Container = styled.div`
  display: flex;
  background: #9c88ff;
  flex-direction: column;
  align-items: center;
  padding-left: 220px;
  min-height: 100vh; /* Adjusted to fill entire viewport height */
`;

const TableContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  background: #9c88ff;
  margin-left: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white; /* Light background */
  border-radius: 12px;
`;

const TableHeader = styled.thead`
  background-color: #18283b; /* Blue background for header */
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
  margin-left: 0px;
  vertical-align: middle;
  color: ${props => (props.eligible === 'Eligible' ? 'green' : 'red')};
`;

const FiltersAndSearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px 10px 0px 0px;
  margin-top: 20px;
`;

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
`;

const FilterLabel = styled.label`
  margin-right: 10px;
`;

const FilterSelect = styled.select`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  margin-right: 10px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #007bff;
    color: white;
    transform: scale(1.05);
  }
`;

const CitySearchGroup = styled.div`
  display: flex;
  align-items: center;
`;

const CitySearchInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  transition: all 0.3s ease;
  width: 200px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const SearchIcon = styled.span`
  margin-right: 10px;
`;

const UserInfo = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [femaleImage, setFemaleImage] = useState(null);
  const [maleImage, setMaleImage] = useState(null);
  const [eligibilityFilter, setEligibilityFilter] = useState('All');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [citySearch, setCitySearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = await Promise.all(usersSnapshot.docs.map(async doc => {
          const userData = doc.data();
          // Query donations collection to check eligibility
          const donationsQuery = query(collection(firestore, 'donations'), where('userId', '==', userData.userId));
          const donationsSnapshot = await getDocs(donationsQuery);
          
          if (donationsSnapshot.empty) {
            // If no donations found, mark as not eligible
            return { ...userData, eligible: 'Not Eligible' };
          } else {
            // Check if any active donation (isActive === true)
            const activeDonation = donationsSnapshot.docs.find(donation => donation.data().isActive === true);
            if (activeDonation) {
              return { ...userData, eligible: 'Eligible' };
            } else {
              return { ...userData, eligible: 'Not Eligible' };
            }
          }
        }));
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchUsers();
  }, []);

  const handleFemaleImageChange = event => {
    const file = event.target.files[0];
    setFemaleImage(file);
  };

  const handleMaleImageChange = event => {
    const file = event.target.files[0];
    setMaleImage(file);
  };

  const renderProfileImage = gender => {
    if (gender === 'female' && femaleImage) {
      return URL.createObjectURL(femaleImage);
    } else if (gender === 'male' && maleImage) {
      return URL.createObjectURL(maleImage);
    } else {
      return gender === 'female'
        ? '/src/assets/female.png'
        : '/src/assets/male.png';
    }
  };

  const handleEligibilityFilterChange = event => {
    const value = event.target.value;
    setEligibilityFilter(value);
    filterUsers(value, bloodGroupFilter, genderFilter, citySearch);
  };

  const handleBloodGroupFilterChange = event => {
    const value = event.target.value;
    setBloodGroupFilter(value);
    filterUsers(eligibilityFilter, value, genderFilter, citySearch);
  };

  const handleGenderFilterChange = event => {
    const value = event.target.value;
    setGenderFilter(value);
    filterUsers(eligibilityFilter, bloodGroupFilter, value, citySearch);
  };

  const handleCitySearchChange = event => {
    const value = event.target.value;
    setCitySearch(value);
    filterUsers(eligibilityFilter, bloodGroupFilter, genderFilter, value);
  };

  const filterUsers = (eligibility, bloodGroup, gender, city) => {
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

    if (city.trim() !== '') {
      filtered = filtered.filter(user =>
        user.address.toLowerCase().includes(city.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  return (
    <Container>
      <Sidebar showSidebar={true} />
      <TableContainer>
        <FiltersAndSearchContainer>
          <FiltersContainer>
            <FilterGroup>
              <FilterLabel>
                <MdFilterList />
              </FilterLabel>
              <FilterSelect
                value={eligibilityFilter}
                onChange={handleEligibilityFilterChange}
              >
                <option value="All">All Eligibility</option>
                <option value="Eligible">Eligible</option>
                <option value="Not Eligible">Not Eligible</option>
              </FilterSelect>
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>
                <MdFilterList />
              </FilterLabel>
              <FilterSelect
                value={bloodGroupFilter}
                onChange={handleBloodGroupFilterChange}
              >
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
            </FilterGroup>
            <FilterGroup>
              <FilterLabel>
                <MdPerson />
              </FilterLabel>
              <FilterSelect
                value={genderFilter}
                onChange={handleGenderFilterChange}
              >
                <option value="All">All Genders</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </FilterSelect>
            </FilterGroup>
          </FiltersContainer>
          <CitySearchGroup>
            <SearchIcon>
              <MdSearch />
            </SearchIcon>
            <CitySearchInput
              type="text"
              placeholder="Search by City"
              value={citySearch}
              onChange={handleCitySearchChange}
            />
          </CitySearchGroup>
        </FiltersAndSearchContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Users</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>City</TableCell>
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
                <TableCell>
                  {user.address.split(',').slice(-3, -2).join('').trim()}
                </TableCell>
                <TableCell>{user.bloodGroup}</TableCell>
                <TableCell>
                  <EligibilityIcon eligible={user.eligible}>
                    {user.eligible === 'Eligible' ? (
                      <MdCheckCircle />
                    ) : (
                      <MdCancel />
                    )}
                  </EligibilityIcon>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <input
        type="file"
        accept="image/*"
        onChange={handleFemaleImageChange}
        style={{ display: 'none' }}
        id="femaleImageInput"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleMaleImageChange}
        style={{ display: 'none' }}
        id="maleImageInput"
      />
    </Container>
  );
};

export default UserInfo;
