import AccountInfo from "../main/AccountInfo";
import styled from "styled-components"

interface SelectModalProps {
  onNext: () => void;
}

const SelectModal: React.FC<SelectModalProps> = ({ onNext }) => {
  return (
    <div>
      <Title>계좌 선택</Title>
      <Content onClick={onNext}>
        <AccountInfo />
      </Content>
    </div>
  )
}

export default SelectModal

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Content = styled.div`
  margin-bottom: 20px;
`;
