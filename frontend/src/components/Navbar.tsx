import { useState, useEffect} from 'react';
import styled from 'styled-components';
import { ReactComponent as LogoSvg } from '../assets/images/onlylogo.svg';
import AlertModal from './AlertModal';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCalendar, AiOutlineBell  } from "react-icons/ai";
import { useNotificationStore } from '../stores/notificationStore'; // 상태 가져오기
import axios from 'axios';


interface Notification {
  id: number;
  message: string;
  createdAt: string;
  // 필요한 다른 필드들을 추가하세요
}

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { hasNewNotification, setHasNewNotification } = useNotificationStore(); // 상태 가져오기
  const [notifications, setNotifications] = useState<Notification[]>([]);



  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setHasNewNotification(false); // 알림을 읽었으므로 상태를 false로 변경  
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
          {hasNewNotification && <NotificationBadge />} {/* 알림 배지 */}
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

const NotificationBadge = styled.div`
    position: absolute; /* 아이콘에 겹치게 표시하기 위해 absolute로 설정 */
    top: -5px; /* 아이콘의 위치에 따라 조정 */
    right: -5px; /* 아이콘의 위치에 따라 조정 */
    width: 12px;
    height: 12px;
    border-radius: 50%; /* 원형으로 만들기 */
    background-color: red; /* 빨간색 배경 */
`;

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