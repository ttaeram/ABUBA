import { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as LogoSvg } from '../assets/images/onlylogo.svg';
import AlertModal from './AlertModal';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCalendar, AiOutlineBell  } from "react-icons/ai";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleHomeClick = () => {
    navigate('/main');
  }

  const handleCalClick = () => {
    navigate('/mycalendar');
  }

  return (
    <NavbarContainer>
      <LogoSvgStyled onClick={handleHomeClick}/>
      <IconContainer>
        <AiOutlineCalendar size={24} color="#000000" onClick={handleCalClick}/>
        <NotificationButton onClick={toggleModal}>
          <AiOutlineBell size={24} />
        </NotificationButton>
        {isModalOpen && (
          <AlertModal
            isOpen={isModalOpen}
            onClose={toggleModal}
            message="알림 메시지를 여기에 작성하세요."
          />
        )}
      </IconContainer>
    </NavbarContainer>
  );
};

export default Navbar;

const LogoSvgStyled = styled(LogoSvg)`
  width: 100px; 
  height: auto;
  cursor: pointer;
`;

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

const IconContainer = styled.div`
    display: flex;
    gap:10px;

`