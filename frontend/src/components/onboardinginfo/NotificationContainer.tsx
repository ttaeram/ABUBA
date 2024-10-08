import React from 'react';
import styled from 'styled-components';

interface Message {
    text: string;
}

interface NotificationProps {
message: Message;
}

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.5s forwards, fadeOut 0.5s forwards;
  
  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-20px);
    }
  }
`;

const Notification = ({ message }: NotificationProps) => {
    return (
      <NotificationContainer>
        {message.text}
      </NotificationContainer>
    );
  };

export default Notification;
