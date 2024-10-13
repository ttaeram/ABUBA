import AccountInfo from "../main/AccountInfo";
import styled from "styled-components"
import { IoIosArrowBack } from "react-icons/io";

interface SelectParentModalProps {
  onNext: (selectedParentAccount: string) => void;
  onBack: () => void;
}

const SelectParentModal: React.FC<SelectParentModalProps> = ({ onNext, onBack }) => {
  return (
    <div>
      <Header>
        <BackButton onClick={onBack}><IoIosArrowBack /></BackButton>
        <Title>부모 계좌 선택</Title>
      </Header>
      <Content>
        <AccountInfo onSelectAccount={onNext} isParent={true} />
      </Content>
    </div>
  )
}

export default SelectParentModal

const Header = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 20px;
`

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const Content = styled.div`
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BackButton = styled.div`
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 24px;
  color: #999;
`;