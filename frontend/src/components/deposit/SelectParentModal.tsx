import AccountInfo from "../main/AccountInfo";
import styled from "styled-components"

interface SelectParentModalProps {
  onNext: (selectedParentAccount: string) => void;
  onBack: () => void;
}

const SelectParentModal: React.FC<SelectParentModalProps> = ({ onNext, onBack }) => {
  return (
    <div>
      <Title>부모 계좌 선택</Title>
      <Content>
        <AccountInfo onSelectAccount={onNext} isParent={true} />
      </Content>
      <ButtonContainer>
        <BackButton onClick={onBack}>이전</BackButton>
      </ButtonContainer>
    </div>
  )
}

export default SelectParentModal

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Content = styled.div`
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  background-color: #ddd;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #ccc;
  }
`;