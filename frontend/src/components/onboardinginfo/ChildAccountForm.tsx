import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../styles/styledComponents';

interface ChildAccountFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

interface Bank {
  name: string;
  logo: string;
}

const banks: Bank[] = [
  { name: '신한은행', logo: '/banklogo/PNG/금융아이콘_PNG_신한.png' },
  { name: '국민은행', logo: '/banklogo/PNG/금융아이콘_PNG_KB.png' },
  { name: '하나은행', logo: '/banklogo/PNG/금융아이콘_PNG_하나.png' },
  { name: '우리은행', logo: '/banklogo/PNG/금융아이콘_PNG_우리.png' },
  { name: '농협은행', logo: '/banklogo/PNG/금융아이콘_PNG_농협.png' },
  { name: '토스뱅크', logo: '/banklogo/PNG/금융아이콘_PNG_토스.png' },
  { name: '카카오뱅크', logo: '/banklogo/PNG/금융아이콘_PNG_카카오뱅크.png' },
  { name: '저축은행', logo: '/banklogo/PNG/금융아이콘_PNG_저축은행.png' },
];

const ChildAccountForm = ({ onNext, onPrevious }: ChildAccountFormProps) => {
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        <Button type="submit">확인</Button>
        </AccountContainer>

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
        <Button type="submit">확인</Button>
      </InputRow>

      <ButtonContainer>
        <Button type="button" onClick={onPrevious}>이전</Button>
        <Button type="submit" onClick={onNext}>다음</Button>
      </ButtonContainer>
    </FormContainer>
  );
};

export default ChildAccountForm;

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
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 10px;
`;

const BankItem = styled.div`
  display: flex;
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
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Description = styled.div`
  display: flex;
  font-size: 22px;
  font-weight: 900;
`;

const SubDescription = styled.div`
  display: flex;
  font-size: 14px;
  font-weight: 900;
  margin-bottom: 60px;
`;

