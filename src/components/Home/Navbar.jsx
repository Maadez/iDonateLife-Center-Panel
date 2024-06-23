import React, { useState } from 'react';
import styled from 'styled-components';
import { FaBars, FaTimes } from 'react-icons/fa';

const Nav = styled.nav`
  background: #18283b; /* Match --navbar-dark-primary */
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  position: fixed;
  width: 100%;
  border-radius: 0px 0px 5px 5px;
  top: 0;
  z-index: 20;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* Shadow effect */
`;







const NavCenter = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
`;

const StyledH1 = styled.h1`
  color: #f5f6fa; /* Match --navbar-light-primary */
  font-size: 1.7rem;
  text-decoration: none;
  font-weight: bold;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* Text shadow for better contrast */
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Nav>
      
      <NavCenter>
        <StyledH1>Center Dashboard</StyledH1>
      </NavCenter>
     

    </Nav>
  );
};

export default Navbar;
