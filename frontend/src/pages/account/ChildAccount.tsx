import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Tick } from 'chart.js'
import TransactionItem from '../../components/account/TransactionItem'
import styled from 'styled-components'
import api from "../../api/index"
import dayjs from 'dayjs'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Transaction = {
  date: string;
  description: string;
  amount: string;
  balance: string;
  isPositive: boolean;
};

const motivationMessages = [
  "잘하고 있어요!",
  "오늘도 화이팅!",
  "매일매일 쌓아보아요!",
]

const groupTransactionsByDate = (transactions: Transaction[]) => {
  return transactions.reduce((groups: { [key: string]: Transaction[] }, transaction) => {
    const date = dayjs(transaction.date).format('YYYY년 MM월 DD일');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});
};

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
        fill: true,
        backgroundColor: '#3B6EBA',
        borderColor: 'white',
      },
    ],
  });

  const getHighestTransaction = (transactions: Transaction[]) => {
    if (transactions.length === 0) return 0
    const maxTransaction = Math.max(
      ...transactions.map((transaction) => parseFloat(transaction.amount))
    )
    return maxTransaction
  }

  const [motivationMessage, setMotivationMessage] = useState<string>("");

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
            isParent: false,
          },
        });
        const formattedBalance = Number(response.data.accountBalance).toLocaleString()
        setBalance(formattedBalance);
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
          description: transaction.transactionSummary,
          amount: transaction.transactionBalance,
          balance: transaction.transactionAfterBalance,
          isPositive: transaction.transactionType === '입금',
        }));

        setTransactions(transformedTransactions);

        // const highestAmount = getHighestTransaction(transformedTransactions)
        // setMotivationMessage(`최고 금액: ${highestAmount.toLocaleString()} 원!`)

        const chartLabels = transactionData.map((transaction: any) => transaction.transactionDate).reverse();
        const chartBalances = transactionData.map((transaction: any) => parseFloat(transaction.transactionAfterBalance)).reverse();

        setChartData({
          labels: chartLabels,
          datasets: [
            {
              label: '잔액 추세',
              data: chartBalances,
              fill: true,
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

  useEffect(() => {
    const randomMessage =
      motivationMessages[Math.floor(Math.random() * motivationMessages.length)]
    setMotivationMessage(randomMessage)
  }, [])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
        },
        ticks: {
          color: `white`,
          fonst: {
            size: 10,
          },
        }
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  return (
    <ChildAccountWrapper>
      <MotivationMessaage>{motivationMessage}</MotivationMessaage>
      <ChartSection>
        <Line data={chartData} options={chartOptions} />
      </ChartSection>

      <BalanceSection>
        <BalanceTitle>{bankName} 주거래 통장</BalanceTitle>
        <BalanceAmount>{balance} 원</BalanceAmount>

        <TransactionList>
          {Object.entries(groupedTransactions).map(([date, transactionGroup]) => (
            <TransactionGroup key={date}>
              <TransactionDate>{date}</TransactionDate>
              {transactionGroup.map((transaction, index) => (
                <TransactionItem
                  key={index}
                  description={transaction.description}
                  amount={transaction.amount}
                  balance={transaction.balance}
                  isPositive={transaction.isPositive}
                />
              ))}
            </TransactionGroup>
          ))}
        </TransactionList>
      </BalanceSection>
    </ChildAccountWrapper>
  );
};

export default ChildAccount

const ChildAccountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #3B6EBA;
  color: white;
  box-sizing: border-box;
  position: relative;
  height: 100vh;
`;

const ChartSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
`;

const MotivationMessaage = styled.div`
  margin-left: 20px;
  margin-top: 20px;
  font-size: 24px;
  font-weight: bold;
  color: white;
`

const BalanceSection = styled.div`
  background-color: #fff;
  color: #000;
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  z-index: 1;
  overflow-y: auto;
`;

const BalanceTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 8px;
`;

const BalanceAmount = styled.h1`
  font-size: 32px;
`;

const TransactionList = styled.ul`
  list-style: none;
  padding: 0;
  overflow-y: auto;
  flex-grow: 1;
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  margin-top: 10px;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const TransactionGroup = styled.div`
  margin-bottom: 20px;
`;

const TransactionDate = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;