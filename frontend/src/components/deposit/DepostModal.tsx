import { useState, useEffect } from "react"
import SelectModal from "./SelectModal"
import AmountModal from "./AmountModal"
import MemoModal from "./MemoModal"
import styled from "styled-components"

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (account: string, memo: string, deposit: number) => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [step, setStep] = useState(1)
  const [account, setAccount] = useState<string>("")
  const [deposit, setDeposit] = useState<number>(0)
  const [memo, setMemo] = useState<string>("")

  useEffect(() => {
    if (!isOpen) {
      setStep(1); // 모달이 닫히면 첫 화면으로 초기화
    }
  }, [isOpen]);

  const handleNext = () => setStep((prevStep) => prevStep + 1)
  const handleBack = () => setStep((prevStep) => prevStep - 1)

  const handleSelectAccount = (selectedAccount: string) => {
    setAccount(selectedAccount)
    handleNext()
  }

  if (!isOpen) return null

  return (
    <Modal>
      <ModalContainer>
        <CloseButton onClick={onClose}>x</CloseButton>
        
        {/* 상태에 따른 내용물 변경 */}
        {step === 1 && <SelectModal onNext={handleSelectAccount} />}  {/* 계좌 선택 */}
        {step === 2 && (
          <AmountModal
            deposit={deposit}
            setDeposit={setDeposit}
            memo={memo}
            setMemo={setMemo}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}  {/* 금액 입력 */}
        {step === 3 && (
          <MemoModal
            memo={memo}
            setMemo={setMemo}
            onConfirm={() => onConfirm(account, memo, deposit)}
            onBack={handleBack}
          />
        )}  {/* 메모 입력 */}
      </ModalContainer>
    </Modal>
  )
}

export default DepositModal

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
  z-index: 1000;
`;

const ModalContainer = styled.div`
  position: relative;
  width: 400px;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
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