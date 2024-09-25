import AccountInfo from "../main/AccountInfo";
import styled from "styled-components"

interface SelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SelectModal: React.FC<SelectModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) {
    return null
  }

  return (
    <Modal>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        <AccountInfo/>
        <ButtonContainer>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <ConfirmButton onClick={onConfirm}>확인</ConfirmButton>
        </ButtonContainer>
      </ModalContainer>
    </Modal>
  )
}

export default SelectModal

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// 모달 컨테이너
const ModalContainer = styled.div`
  width: 400px;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;

  &:hover {
    color: #333;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: #ddd;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  flex: 1;
  margin-right: 10px;

  &:hover {
    background-color: #ccc;
  }
`;

const ConfirmButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  flex: 1;

  &:hover {
    background-color: #0056b3;
  }
`;