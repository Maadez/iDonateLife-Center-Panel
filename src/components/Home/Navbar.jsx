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

const NavLogo = styled.a`
  color: #f5f6fa; /* Match --navbar-light-primary */
  font-size: 1.5rem;
  text-decoration: none;
  font-weight: bold;
`;

const NavMenu = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background: #778beb; /* Match sidebar color for mobile */
    text-align: center;
    padding: 10px 0;
  }
`;

const NavItem = styled.a`
  color: #f5f6fa; /* Match --navbar-light-primary */
  text-decoration: none;
  margin: 0 15px;
  font-size: 1rem;

  &:hover {
    color: #556ee6; /* Primary blue hover color */
  }

  @media (max-width: 768px) {
    display: block;
    margin: 10px 0;
  }
`;

const MenuIcon = styled.div`
  display: none;
  color: #f5f6fa; /* Match --navbar-light-primary */
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
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
      <MenuIcon onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </MenuIcon>
      <NavMenu isOpen={isOpen}>
        {/* <NavItem href="/">Home</NavItem>
        <NavItem href="/about">About</NavItem>
        <NavItem href="/contact">Contact</NavItem> */}
      </NavMenu>
    </Nav>
  );
};

export default Navbar;
