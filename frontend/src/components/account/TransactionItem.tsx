import styled from "styled-components";

type Transaction = {
  date?: string;
  description: string;
  amount: string;
  balance: string;
  isPositive: boolean; // 입금 또는 출금 여부
};

const TransactionItem: React.FC<Transaction> = ({ date, description, amount, balance, isPositive }) => {
  const formattedAmount = Number(amount).toLocaleString()
  const formattedBalance = Number(balance).toLocaleString()

  return (
    <TransactionItemWrapper>
      <TransactionDate>{date}</TransactionDate>
      <TransactionDetail>
        <span>{description}</span>
        <AmountContainer>
          <Amount style={{ color: isPositive ? 'black' : '#3B6EBA' }}>+{formattedAmount} 원</Amount>
          <Balance>{formattedBalance} 원</Balance>
        </AmountContainer>
      </TransactionDetail>
    </TransactionItemWrapper>
  );
};

export default TransactionItem

const TransactionItemWrapper = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
`;

const TransactionDate = styled.div`
  font-size: 14px;
  color: #666;
`;

const TransactionDetail = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  span {
    font-size: 16px;
  }
`;

const AmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Amount = styled.span`
  font-size: 16px;
`;

const Balance = styled.span`
  font-size: 12px;
  color: #999;
`;