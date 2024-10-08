import { useState, useEffect } from 'react'
import styled from 'styled-components';
import api from '../../api/index'
import { ChildAccountInfo } from '../../api/account';

interface AccountInfoProps {
  onSelectAccount?: (accountNo: string) => void
}

const AccountInfo: React.FC<AccountInfoProps> = ({ onSelectAccount }) => {
  const [account, setAccount] = useState<string>('');
  const [accountBalance, setAccountBalance] = useState<string>('0');
  const [bankName, setBankName] = useState<string>('');

  useEffect(() => {
    const getAccountInfo = async () => {
      try {

        const accountInfo = await ChildAccountInfo();
        
        setAccount(accountInfo.account);
        setAccountBalance(formatCurrency(accountInfo.accountBalance));
        setBankName(accountInfo.bankName);
      } catch (error) {
        console.error('Failed to fetch balance:', error)
      }
    }

    getAccountInfo()
  }, []);

  const handleSelect = () => {
    if (onSelectAccount) {
      onSelectAccount(account)
    }
  };

  const formatCurrency = (amount: string): string => {
    const numberAmount = Number(amount);
    return numberAmount.toLocaleString();
  };

  return (
    <Container onClick={onSelectAccount ? handleSelect : undefined}>
        <TextInfo>
            <Name>
                {bankName} 주거래 통장
            </Name>
            <AccountName>
                {account}
            </AccountName>
        </TextInfo>
        <Money>
            {accountBalance} 원
        </Money>
    </Container>
  )
}

export default AccountInfo

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #3B6EBA;
  color:white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  width: 100%;
  margin: 20px auto; 
`;


const TextInfo = styled.div` 
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 10px auto;
  justify-content: space-between;
`

const Name = styled.div`
  font-size:22px;
  margin-bottom: 6px;

`

const AccountName = styled.div`
  font-size:14px;
  margin-bottom: 6px;

`

const Money = styled.div`
    display: flex;
    justify-content: flex-end;
    text-align: right;
    margin-bottom: 5px;
    font-size:25px;

`