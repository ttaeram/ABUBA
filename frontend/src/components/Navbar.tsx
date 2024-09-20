import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
<<<<<<< HEAD
import { IoNotificationsOutline } from 'react-icons/io5';
import AlertModal from './AlertModal';
import { LogoSvgStyled } from '../styles/styledComponents';
=======
import { ReactComponent as LogoSvg } from '../assets/images/onlylogo.svg';
import { IoNotificationsOutline } from 'react-icons/io5';
import AlertModal from './AlertModal';
>>>>>>> f15746bd10d9c3487122ba2848a56b0376331636

type NavbarProps = {};

const Navbar = (props: NavbarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <NavbarContainer>
      <LogoSvgStyled />
      <NotificationButton onClick={toggleModal}>
        <IoNotificationsOutline size={24} />
      </NotificationButton>
      {isModalOpen && (
        <AlertModal
          isOpen={isModalOpen}
          onClose={toggleModal}
          message="알림 메시지를 여기에 작성하세요."
        />
      )}
    </NavbarContainer>
  );
};

export default Navbar;

<<<<<<< HEAD
=======
const LogoSvgStyled = styled(LogoSvg)`
  width: 100px; 
  height: auto;  
`;
>>>>>>> f15746bd10d9c3487122ba2848a56b0376331636

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  color: white;
`;

const NotificationButton = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: black;

  &:hover {
    opacity: 0.8;
  }
`;
