import styled from "styled-components";

type Transaction = {
  date: string;
  description: string;
  amount: string;
  isPositive: boolean; // 입금 또는 출금 여부
};

const TransactionItem: React.FC<Transaction> = ({ date, description, amount, isPositive }) => {
  return (
    <TransactionItemWrapper>
      <TransactionDate>{date}</TransactionDate>
      <TransactionDetail>
        <span>{description}</span>
        <span style={{ color: isPositive ? '#3B6EBA' : 'black' }}>{amount}</span>
      </TransactionDetail>
    </TransactionItemWrapper>
  );
};

export default TransactionItem

// 계좌 내역 아이템 스타일링
const TransactionItemWrapper = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
`;

// 날짜 스타일링
const TransactionDate = styled.div`
  font-size: 14px;
  color: #666;
`;

// 거래 내역 정보 스타일링
const TransactionDetail = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  span {
    font-size: 16px;
  }
`;