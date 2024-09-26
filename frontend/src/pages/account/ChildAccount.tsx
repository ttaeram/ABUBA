import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import BackButton from '../../components/buttons/BackButton'
import TransactionItem from '../../components/account/TransactionItem'
import styled from 'styled-components'

// Chart.js의 요소를 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// 예시 데이터를 사용한 차트 데이터
const data = {
  labels: ['9월 1일', '9월 10일', '9월 20일', '9월 30일'],
  datasets: [
    {
      label: '저축 추세',
      data: [100000, 150000, 300000, 240000], // 각 날짜에 해당하는 값
      fill: false,
      backgroundColor: '#3B6EBA',
      borderColor: 'white',
    },
  ],
};

// 차트 옵션 설정
const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
    title: {
      display: true,
    },
  },
};

type Transaction = {
  date: string;
  description: string;
  amount: string;
  isPositive: boolean; // 입금 또는 출금 여부
};

const ChildAccount: React.FC = () => {
  const transactions: Transaction[] = [
    { date: '9월 30일', description: '기저귀', amount: '-50,000 원', isPositive: false },
    { date: '9월 28일', description: '저축', amount: '+100,000 원', isPositive: true },
    { date: '9월 25일', description: '기저귀', amount: '-30,000 원', isPositive: false },
    { date: '9월 20일', description: '저축', amount: '+150,000 원', isPositive: true },
    { date: '9월 30일', description: '기저귀', amount: '-50,000 원', isPositive: false },
    { date: '9월 28일', description: '저축', amount: '+100,000 원', isPositive: true },
    { date: '9월 25일', description: '기저귀', amount: '-30,000 원', isPositive: false },
    { date: '9월 20일', description: '저축', amount: '+150,000 원', isPositive: true },
    { date: '9월 30일', description: '기저귀', amount: '-50,000 원', isPositive: false },
    { date: '9월 28일', description: '저축', amount: '+100,000 원', isPositive: true },
    { date: '9월 25일', description: '외식비', amount: '-30,000 원', isPositive: false },
    { date: '9월 20일', description: '저축', amount: '+150,000 원', isPositive: true },
  ];

  return (
    <ChildAccountWrapper>
      <Header>
        <BackButton label='<' color='white'/>
      </Header>

      {/* 이모지 아이콘 섹션 */}
      <ChartSection>
        <Line data={data} options={options} />
      </ChartSection>

      {/* 잔액 및 소비 정보 섹션 */}
      <BalanceSection>
        <BalanceTitle>내 아이 초등학생 마련</BalanceTitle>
        <BalanceAmount>2,043,000 원</BalanceAmount>
        <TransactionInfo>9월 저축 240,000 원</TransactionInfo>
        <TransactionInfo>지난달에 비해 60,000 원 더 저축했어요</TransactionInfo>
        {/* 계좌 내역 리스트 */}
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

        {/* 버튼 섹션 */}
        <ButtonSection>
          <ActionButton>보내기</ActionButton>
          <ActionButton fill>채우기</ActionButton>
        </ButtonSection>
      </BalanceSection>
    </ChildAccountWrapper>
  );
};

export default ChildAccount

// 전체 페이지를 감싸는 래퍼 스타일 정의
const ChildAccountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #3B6EBA; /* 배경색 (이미지와 유사한 색상) */
  color: white;
  box-sizing: border-box;
  position: relative; /* 절대 위치의 기준이 되는 부모 요소 */
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
  margin: 20px 0;
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
  border-top-left-radius: 20px;  /* 상단 왼쪽 모서리 둥글게 */
  border-top-right-radius: 20px; /* 상단 오른쪽 모서리 둥글게 */
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
  position: sticky; /* 절대 위치 지정 */
  background: linear-gradient(transparent, rgba(255, 255, 255, 1));
  bottom: 0; /* 페이지의 아래쪽에 배치 */
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  z-index: 10; /* z축 상에서 위로 배치 */
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

// 계좌 내역 리스트 섹션 스타일링
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

  /* 웹킷 브라우저 (Chrome, Safari) */
  &::-webkit-scrollbar {
    display: none;
  }

  /* IE와 Edge */
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
`;