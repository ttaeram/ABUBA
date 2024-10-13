import { useState, useEffect } from "react"
import SelectChildModal from "./SelectChildModal"
import AmountModal from "./AmountModal"
import SelectParentModal from "./SelectParentModal"
import styled from "styled-components"
import { FaXmark } from "react-icons/fa6";
import ParentAccountForm from "../onboardinginfo/ParentAccountForm"

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (childAccount: string, parentAccount: string, memo: string, deposit: number) => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [step, setStep] = useState(1)
  const [childAccount, setChildAccount] = useState<string>("")
  const [parentAccount, setParentAccount] = useState<string>("")
  const [deposit, setDeposit] = useState<number>(0)
  const [memo, setMemo] = useState<string>("")

  useEffect(() => {
    if (!isOpen) {
      setStep(1); // 모달이 닫히면 첫 화면으로 초기화
    }
  }, [isOpen]);

  const handleNext = () => setStep((prevStep) => prevStep + 1)
  const handleBack = () => setStep((prevStep) => prevStep - 1)

  const handleSelectChildAccount = (selectedChildAccount: string) => {
    setChildAccount(selectedChildAccount)
    handleNext()
  }

  const handleSelectParentAccount = (selectedParentAccount: string) => {
    setParentAccount(selectedParentAccount)
    handleNext()
  }

  if (!isOpen) return null

  return (
    <Modal>
      <ModalContainer>
        <CloseButton onClick={onClose}><FaXmark/></CloseButton>
        
        {/* 상태에 따른 내용물 변경 */}
        {step === 1 && <SelectChildModal onNext={handleSelectChildAccount} />}
        {step === 2 && 
          <SelectParentModal 
            onNext={handleSelectParentAccount}
            onBack={handleBack}
          />}
        {step === 3 && (
          <AmountModal
            deposit={deposit}
            setDeposit={setDeposit}
            memo={memo}
            setMemo={setMemo}
            onBack={handleBack}
            onConfirm={() => onConfirm(childAccount, parentAccount, memo, deposit)}
          />
        )}
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
  margin-right: 7px;
  margin-top: 10px;

  &:hover {
    color: #333;
  }
`;