import AccountInfo from "../main/AccountInfo";
import styled from "styled-components"

interface SelectChildModalProps {
  onNext: (selectedChildAccount: string) => void;
}

const SelectChildModal: React.FC<SelectChildModalProps> = ({ onNext }) => {
  return (
    <div>
      <Title>아이 계좌 선택</Title>
      <Content>
        <AccountInfo onSelectAccount={onNext} />
      </Content>
    </div>
  )
}

export default SelectChildModal

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Content = styled.div`
  margin-bottom: 20px;
`;
