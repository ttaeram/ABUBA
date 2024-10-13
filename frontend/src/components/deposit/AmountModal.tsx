import styled from "styled-components";
import { IoIosArrowBack } from "react-icons/io";

interface AmountModalProps {
  deposit: number;
  setDeposit: (value: number) => void;
  memo: string;
  setMemo: (value: string) => void;
  onConfirm: () => void;
  onBack: () => void;
}

const AmountModal: React.FC<AmountModalProps> = ({ deposit, setDeposit, memo, setMemo, onConfirm, onBack }) => {
  return (
    <div>
      <Header>
        <BackButton onClick={onBack}><IoIosArrowBack /></BackButton>
        <Title>송금하기</Title>
      </Header>
      <SubTitle>금액 입력</SubTitle>
      <DepositInput
        type="number"
        value={deposit}
        onChange={(e) => setDeposit(Number(e.target.value))}
        placeholder="송금할 금액"
      />
      <SubTitle>메모 입력</SubTitle>
      <Input
        type="text"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="메모를 입력하세요."
      />
      <NextButton onClick={onConfirm}>완료</NextButton>
    </div>
  )
}

export default AmountModal

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

const SubTitle = styled.h2`
  text-align: left;
  font-size: 18px;
  font-weight: bold;
  display: block;
  margin-top: 10px;
  margin-bottom: 10px
`;

const DepositInput = styled.input`
  text-align: right;
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  border-bottom: 2px solid #ccc;
  border-radius: 0;
  outline: none;
  transition: border-bottom-color 0.3s ease;

  &:focus {
    border-bottom: 2px solid #3B6EBA;
  }
`;

const Input = styled.input`
  text-align: center;
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: none;
  border-bottom: 2px solid #ccc;
  border-radius: 0;
  outline: none;
  transition: border-bottom-color 0.3s ease;

  &:focus {
    border-bottom: 2px solid #3B6EBA;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const NextButton = styled.div`
  padding: 10px 20px;
  background-color: #3B6EBA;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: #173C91;
  }
`;

const BackButton = styled.div`
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 24px;
  color: #999;
`;