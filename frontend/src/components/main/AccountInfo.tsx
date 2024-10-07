import { useState, useEffect } from 'react'
import styled from 'styled-components';
import api from '../../api/index'

interface AccountInfoProps {
  onSelectAccount?: (accountNo: string) => void
}

const AccountInfo: React.FC<AccountInfoProps> = ({ onSelectAccount }) => {
  const [account, setAccount] = useState<string>('')
  const [accountBalance, setAccountBalance] = useState<string>('')

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access Token이 없음');
        }

        const response = await api.get('/api/v1/account/balance', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params:{
            isParent: true,
          },
        })
        
        console.log(response.data.account, response.data.accountBalance)
        setAccount(response.data.account)
        setAccountBalance(response.data.accountBalance)
      } catch (error) {
        console.error('Failed to fetch balance:', error)
      }
    }

    fetchAccountInfo()
  }, [])

  const handleSelect = () => {
    if (onSelectAccount) {
      onSelectAccount(account)
    }
  }

  return (
    <Container onClick={onSelectAccount ? handleSelect : undefined}>
        <TextInfo>
            <Name>
                신한 주거래 통장
            </Name>
            <Name>
                {account}
            </Name>
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
  padding: 15px;
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
  font-size:16px;

`

const Money = styled.div`
    display: flex;
    justify-content: right;
    text-align: right;
    font-size:px;

`