import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import BackButton from '../../components/buttons/BackButton'
import TransactionItem from '../../components/account/TransactionItem'
import styled from 'styled-components'
import api from "../../api/index"
import dayjs from 'dayjs'

// Chart.js의 요소를 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Transaction = {
  date: string;
  description: string;
  amount: string;
  isPositive: boolean; // 입금 또는 출금 여부
};

const groupTransactionsByDate = (transactions: Transaction[]) => {
  return transactions.reduce((groups: { [key: string]: Transaction[] }, transaction) => {
    const date = dayjs(transaction.date).format('YYYY년 MM월 DD일'); // Group by formatted date
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});
};

// 차트 및 거래 내역 컴포넌트
const ChildAccount: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<string>('0');
  const [bankName, setBankName] = useState<string>('')
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: '저축 추세',
        data: [],
        fill: false,
        backgroundColor: '#3B6EBA',
        borderColor: 'white',
      },
    ],
  });

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access Token이 없음');
        }
  
        const response = await api.get('/api/v1/account/balance', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            isParent: true,
          },
        });
        setBalance(response.data.accountBalance);
        setBankName(response.data.bankName)
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    };
  
    fetchBalance();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access Token이 없음');
        }

        const endDate = dayjs().format('YYYYMMDD');
        const startDate = dayjs().subtract(1, 'month').format('YYYYMMDD');

        const response = await api.post('/api/v1/account',
          {
            startDate: startDate,
            endDate: endDate,
          },
          {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const transactionData = response.data;
        console.log(transactionData)
        const transformedTransactions = transactionData.map((transaction: any) => ({
          date: transaction.transactionDate,
          description: transaction.transactionSummary || transaction.transactionMemo,
          amount: transaction.transactionBalance,
          isPositive: transaction.transactionType === '입금', // 입금이면 true
        }));

        setTransactions(transformedTransactions);

        const chartLabels = transactionData.map((transaction: any) => transaction.transactionDate).reverse();
        const chartBalances = transactionData.map((transaction: any) => parseFloat(transaction.transactionAfterBalance)).reverse();

        setChartData({
          labels: chartLabels,
          datasets: [
            {
              label: '잔액 추세',
              data: chartBalances,
              fill: false,
              backgroundColor: '#3B6EBA',
              borderColor: 'white',
            },
          ],
        });
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false, // X축 라벨 숨기기
      },
      y: {
        display: false, // Y축 라벨 숨기기
        grid: {
          display: false, // 그리드 숨기기
        },
      },
    },
    plugins: {
      legend: {
        display: false, // 범례 숨기기
      },
      tooltip: {
        enabled: true, // 툴팁은 그대로 유지
      },
    },
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  return (
    <ChildAccountWrapper>
      <Header>
        <BackButton label='<' color='white'/>
      </Header>

      <ChartSection>
        <Line data={chartData} options={chartOptions} />
      </ChartSection>

      <BalanceSection>
        <BalanceTitle>{bankName} 주거래 통장</BalanceTitle>
        <BalanceAmount>{balance} 원</BalanceAmount>

        <TransactionList>
          {transactions.map((transaction, index) => (
            <TransactionItem
              key={index}
              date={transaction.date}
              description={transaction.description}
              amount={transaction.amount}
              isPositive={transaction.isPositive}
            />
          ))}
        </TransactionList>

        {/* 버튼 섹션
        <ButtonSection>
          <ActionButton>보내기</ActionButton>
          <ActionButton fill>채우기</ActionButton>
        </ButtonSection> */}
      </BalanceSection>
    </ChildAccountWrapper>
  );
};

export default ChildAccount

// 전체 페이지를 감싸는 래퍼 스타일 정의
const ChildAccountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #3B6EBA;
  color: white;
  box-sizing: border-box;
  position: relative;
`;

// 상단 헤더 스타일 정의
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  padding: 8px;
  color: #000;
  border-radius: 10px;
`;

// 이모지나 이미지를 표시하는 섹션
const ChartSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
`;

// 이모지 이미지를 스타일링
const EmojiImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;

// 잔액 표시 섹션
const BalanceSection = styled.div`
  background-color: #fff;
  color: #000;
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  flex-grow: 1;
  z-index: 1;
`;

// 잔액 제목 스타일
const BalanceTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 8px;
`;

// 잔액 금액 스타일
const BalanceAmount = styled.h1`
  font-size: 32px;
`;

// 트랜잭션 정보 스타일
const TransactionInfo = styled.div`
  font-size: 16px;
  color: #666;
  margin-top: 10px;
`;

// 버튼 섹션을 스타일링
const ButtonSection = styled.div`
  position: sticky;
  background: linear-gradient(transparent, rgba(255, 255, 255, 1));
  bottom: 0
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  z-index: 10;
`;

// 버튼 스타일링
const ActionButton = styled.button<{ fill?: boolean }>`
  flex: 1;
  padding: 12px;
  background-color: ${(props) => (props.fill ? '#3B6EBA' : '#ffffff')};
  color: ${(props) => (props.fill ? '#ffffff' : '#3B6EBA')};
  border: none;
  border-radius: 10px;
  margin: 0 8px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.fill ? '#173C91' : '#e0e0e0')};
  }
`;

const TransactionList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto; /* 스크롤 가능하게 */
  flex-grow: 1; /* 리스트가 남은 공간을 모두 차지 */
  max-height: 300px; /* 리스트가 화면을 넘지 않도록 설정 */
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;