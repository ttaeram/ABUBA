import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../styles/styledComponents';
import { sendMoney, submitAccountInfo, verifyAuthCode } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { getBabyInfo } from '../../api/user';
import { useChildAuthStore } from '../../stores/authStore';


interface ParentAccountFormProps {
  onComplete: () => void;
  onPrevious: () => void;
}

interface Bank {
  name: string;
  logo: string;
}

const banks: Bank[] = [
  { name: '농협', logo: '/banklogo/PNG/금융아이콘_PNG_농협.png' },
  { name: '국민', logo: '/banklogo/PNG/금융아이콘_PNG_KB.png' },
  { name: '카카오뱅크', logo: '/banklogo/PNG/금융아이콘_PNG_카카오뱅크.png' },
  { name: '신한', logo: '/banklogo/PNG/금융아이콘_PNG_신한.png' },
  { name: '우리', logo: '/banklogo/PNG/금융아이콘_PNG_우리.png' },
  { name: 'IBK기업', logo: '/banklogo/PNG/금융아이콘_PNG_IBK.png' },
  { name: '하나', logo: '/banklogo/PNG/금융아이콘_PNG_하나.png' },
  { name: '새마을', logo: '/banklogo/PNG/금융아이콘_PNG_MG새마을금고.png' },
  { name: '대구', logo: '/banklogo/PNG/금융아이콘_PNG_DGB.png' },
  { name: '부산', logo: '/banklogo/PNG/금융아이콘_PNG_BNK.png' },
  { name: '토스뱅크', logo: '/banklogo/PNG/금융아이콘_PNG_토스.png' },
  { name: '저축은행', logo: '/banklogo/PNG/금융아이콘_PNG_저축은행.png' },
];

const ParentAccountForm = ({ onComplete, onPrevious }: ParentAccountFormProps) => {
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [authText, setAuthText] = useState('');
  const [sendResponseMessage, setSendResponseMessage] = useState('');  
  const [verifyResponseMessage, setVerifyResponseMessage] = useState('');  
  const [isVerified, setIsVerified] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isVerified) {
      setSendResponseMessage('계좌 인증이 완료되지 않았습니다. 인증을 완료해주세요.');
      return;
    }

    if (!selectedBank) {
      setSendResponseMessage('은행을 선택해주세요.');
      return;
    }

    if (!accountNumber) {
      setSendResponseMessage('계좌번호를 입력해주세요.');
      return;
    }

    try {
      const response = await submitAccountInfo({
        isParent: true, 
        accountNo: accountNumber,
        bankName: selectedBank.name,
      });


      if (response.status === 200) {
        onComplete();
      } else {
        setSendResponseMessage('계좌 정보 전송 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error(error);  
      setSendResponseMessage('계좌 정보 전송 중 오류가 발생했습니다.');
    }
};

  const handleSendMoney = async () => {
    if (!selectedBank || !accountNumber) {
      setSendResponseMessage('은행과 계좌번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await sendMoney(accountNumber, selectedBank.name);

      if (response.status === 200 && response.data) {
        setAuthCode(response.data.authCode);
        setAuthText(response.data.authText);
        setSendResponseMessage('1원 송금이 완료되었습니다. 인증번호를 확인해주세요.');
        alert(response.data.authCode);
      } else if (response.status === 401) {
        setSendResponseMessage('계좌번호가 유효하지 않습니다. 다시 확인해주세요.');
      } else if (response.status === 422) {
        setSendResponseMessage('이미 등록된 아이의 계좌입니다. 아이의 이름을 제대로 입력했는지 확인해주세요.');
      }
    } catch (error) {
      setSendResponseMessage('계좌 정보를 전송하는 중 오류가 발생했습니다.');
    }
  };

  const handleVerifyAuthCode = async () => {
    if (!verificationCode) {
      setVerifyResponseMessage('인증번호를 입력해주세요.');
      return;
    }

    try {
      const response = await verifyAuthCode(authCode, authText, accountNumber);

      if (response.data.status === 'SUCCESS') {
        setIsVerified(true);
        setVerifyResponseMessage('인증 성공!');
      } else {
        setVerifyResponseMessage('인증 실패. 다시 시도해주세요.');
      }
    } catch (error) {
      setVerifyResponseMessage('인증 중 오류가 발생했습니다.');
    }
  };


  return (
    <FormContainer onSubmit={handleSubmit}>
      <DropdownContainer>
        <DropdownHeader onClick={toggleDropdown}>
          {selectedBank ? (
            <>
              <BankLogo src={selectedBank.logo} alt={selectedBank.name} />
              {selectedBank.name}
            </>
          ) : (
            '입금 은행 선택'
          )}
        </DropdownHeader>
        {isOpen && (
          <DropdownList>
            <BankGrid>
              {banks.map((bank) => (
                <BankItem key={bank.name} onClick={() => handleBankSelect(bank)}>
                  <BankLogo src={bank.logo} alt={bank.name} />
                  {bank.name}
                </BankItem>
              ))}
            </BankGrid>
          </DropdownList>
        )}
      </DropdownContainer>
      <AccountContainer>
        <Input
          type="text"
          placeholder="계좌번호 ('-' 없이)"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          required
        />
        <Button type="submit" onClick={handleSendMoney}>확인</Button>
        </AccountContainer>
      
        {sendResponseMessage && (
        <ResponseMessage>{sendResponseMessage}</ResponseMessage>
      )}
        
      <Description>
      입금자명 네자리를 입력해주세요.
      </Description>
      <SubDescription>
      은행 입금 내역에서 송금된 1원 내역을 확인해주세요.
      </SubDescription>

      <InputRow>
        <Input
          type="text"
          placeholder="인증번호 (숫자 4자리)"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
        />
        <Button type="submit" onClick={handleVerifyAuthCode}>확인</Button>
      </InputRow>

      {verifyResponseMessage && (
        <ResponseMessage>{verifyResponseMessage}</ResponseMessage>
      )}
        
      <ButtonContainer>
        <Button type="button" onClick={onPrevious}>이전</Button>
        <Button type="submit" >완료</Button>
      </ButtonContainer>
    </FormContainer>
  );
};

export default ParentAccountForm;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding: 20px;
  border-radius: 8px;
`;

const DropdownContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const DropdownHeader = styled.div`
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap:10px;
`;

const DropdownList = styled.div`
  position: absolute;
  width: 100%;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 5px;
  z-index: 1;
`;

const BankGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 10px;
`;

const BankItem = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  gap:10px;
  align-items: center;
  justify-content: left;
  padding: 10px;
  border-radius: 8px;
  font-weight: 900;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const BankLogo = styled.img`
  width: 25px;
  height: 25px;
`;


const AccountContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Input = styled.input`
  display: flex;
  width: 70%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap:20px;
  margin-top: 20px;
`;

const Description = styled.div`
  display: flex;
  font-size: 18px;
  font-weight: 900;
  margin-bottom: 5px;
`;

const SubDescription = styled.div`
  display: flex;
  font-size: 12px;
  font-weight: 900;
  margin-bottom: 20px;
`;

const ResponseMessage = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #ff0000dc;
`