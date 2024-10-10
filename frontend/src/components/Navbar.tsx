import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as LogoSvg } from '../assets/images/onlylogo.svg';
import AlertModal from './AlertModal';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCalendar, AiOutlineBell } from "react-icons/ai";
import { useNotificationStore } from '../stores/notificationStore';
import axios from 'axios';

interface Notification {
  createdAt: string;
  isRead: boolean;
  diaryId: number;
  writer: string;
  title: string;
}

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();
  const { hasNewNotification, setHasNewNotification } = useNotificationStore();

  const toggleModal = async () => {
    setIsModalOpen(!isModalOpen);
    setHasNewNotification(false);
    if (!isModalOpen) {
      await fetchNotifications();
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/alarm`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleHomeClick = () => {
    navigate('/main');
  }

  const handleCalClick = () => {
    navigate('/mycalendar');
  }

  const handleNotificationClick = (diaryId: number) => {
    setIsModalOpen(false); // 모달 닫기
    navigate(`/diary/${diaryId}`); // 해당 일기 상세 페이지로 이동
  };

  return (
    <NavbarContainer>
      <LogoSvgStyled onClick={handleHomeClick}/>
      <IconContainer>
        <AiOutlineCalendar size={24} color="#000000" onClick={handleCalClick}/>
        <NotificationButton onClick={toggleModal}>
          <AiOutlineBell size={24} />
          {hasNewNotification && <NotificationBadge />}
        </NotificationButton>
        {isModalOpen && (
          <AlertModal
            isOpen={isModalOpen}
            onClose={toggleModal}
            content={
              <NotificationList>
                {notifications.map((notification, index) => (
                  <NotificationItem 
                    key={index} 
                    onClick={() => handleNotificationClick(notification.diaryId)}
                    isRead={notification.isRead}
                  >
                    <NotificationStatus isRead={notification.isRead}>
                      {notification.isRead ? '읽음' : '안읽음'}
                    </NotificationStatus>
                    <NotificationContent>
                      <NotificationTitle>
                        {notification.title.length > 15 
                          ? `${notification.title.substring(0, 15)}...` 
                          : notification.title}
                      </NotificationTitle>
                      <p>{notification.writer}님이 새 일기를 작성했습니다.</p>
                      <small>{new Date(notification.createdAt).toLocaleString()}</small>
                    </NotificationContent>
                  </NotificationItem>
                ))}
              </NotificationList>
            }
          />
        )}
      </IconContainer>
    </NavbarContainer>
  );
};

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
`;

const LogoSvgStyled = styled(LogoSvg)`
  width: 100px; 
  height: auto;
  cursor: pointer;
`;

const IconContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const NotificationButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
`;

const NotificationList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const NotificationItem = styled.div<{ isRead: boolean }>`
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  background-color: ${props => props.isRead ? 'white' : '#f0f8ff'};
  display: flex;
  align-items: flex-start;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const NotificationStatus = styled.span<{ isRead: boolean }>`
  font-size: 0.8em;
  color: ${props => props.isRead ? 'gray' : 'blue'};
  margin-right: 10px;
  min-width: 40px;
`;

const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationTitle = styled.strong`
  margin-bottom: 5px;
  font-size: 1em;
`;

export default Navbar;