import React from 'react';
import styled from 'styled-components';

type AlertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
};

const AlertModal = ({ isOpen, onClose, message }: AlertModalProps) => {
  if (!isOpen) return null;

  return (
    <Modal>
      <ModalContent>
        <p>{message}</p>
        <CloseButton onClick={onClose}>닫기</CloseButton>
      </ModalContent>
    </Modal>
  );
};

export default AlertModal;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
`;

const CloseButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #3B6EBA;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #173C91;
  }
`;
