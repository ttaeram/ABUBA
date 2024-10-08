import styled from "styled-components"

interface MemoModalProps {
  memo: string;
  setMemo: (value: string) => void;
  onConfirm: () => void;
  onBack: () => void;
}

const MemoModal: React.FC<MemoModalProps> = ({ memo, setMemo, onConfirm, onBack }) => {
  return (
    <div>
      <Title>비밀번호 입력</Title>
      <Input
        type="text"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="비밀번호"
      />
      <ButtonContainer>
        <BackButton onClick={onBack}>이전</BackButton>
        <NextButton onClick={onConfirm}>확인</NextButton>
      </ButtonContainer>
    </div>
  )
}

export default MemoModal

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const NextButton = styled.button`
  padding: 10px 20px;
  background-color: #3B6EBA;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #173C91;
  }
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