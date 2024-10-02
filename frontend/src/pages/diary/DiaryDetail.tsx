import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import BackButton from "../../components/buttons/BackButton"
import axios from "axios"
import AudioPlayer from "../../components/AudioPlayer"
import styled from "styled-components"
import { ReactComponent as WonSvg } from "../../assets/images/won.svg"

const mockDiaryData = {
  date: "2024년 7월 31일",
  title: "뒤집기 한 날",
  content: "오늘은 태하가 뒤집기를 했다. 너무나도 사랑스러운 아이다!!",
  height: 163,
  weight: 110,
  money: "30,000 원",
  account: "5,000,000 원",
  imageUrl: "https://via.placeholder.com/400x300", // Placeholder image
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Sample audio URL
}

const DiaryDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [diaryData, setDiaryData] = useState<any>(mockDiaryData)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDiaryData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/diary/${id}`)
        setDiaryData(response.data)
        setLoading(false)
      } catch (e) {
        setError("일기를 불러오는 데 실패했습니다.")
        setLoading(false)
      }
    }

    fetchDiaryData()
  }, [id])

  const toDiaryUpdate = () => {
    navigate(`/diary/${id}/update`, { state: { diaryData } })
  }

  if (loading) return <Loading>로딩 중...</Loading>
  if (error) return <Error>{error}</Error>
  
  return (
    <DiaryContainer>
      <Header>
        <BackButton label="이전"/>
        <Date>{diaryData?.date || "날짜  없음"}</Date>
        <UpdateButton onClick={toDiaryUpdate}>수정</UpdateButton>
      </Header>

      <Content>
        <DiaryImage src={diaryData?.imageUrl || 'https://via.placeholder.com/400x300'} alt={diaryData.title} />
        <StatsContainer>
          <StatItem>신장 : {diaryData?.height || 0}</StatItem>
          <StatItem>체중 : {diaryData?.weight || 0}</StatItem>
        </StatsContainer>
        <Title>{diaryData?.title || "제목 없음"}</Title>
        <ContentText>{diaryData?.content || "내용 없음"}</ContentText>
        {diaryData?.audioUrl && (
        <>
          <AudioLabel>목소리 듣기</AudioLabel>
          <AudioPlayer src={diaryData.audioUrl} disableRecording={true} />
        </>
        )}
        {diaryData?.money && (
          <>
            <AudioLabel>계좌 송금</AudioLabel>
            <AccountContainer>
              <IconContainer>
                <Icon />
              </IconContainer>
              <ContentContainer>
                <TransferTitle>{diaryData.title}</TransferTitle>
                <MoneyAndAccount>
                  <Money>+ {diaryData.money}</Money>
                  <Account>{diaryData.account}</Account>
                </MoneyAndAccount>
              </ContentContainer>
            </AccountContainer>
          </>
        )}
      </Content>
    </DiaryContainer>
  );
};

export default DiaryDetail

const DiaryContainer = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Date = styled.h2`
  font-size: 16px;
  font-weight: bold;
`;

const UpdateButton = styled.button`
  background: none;
  border: none;
  color: blue;
  font-size: 16px;
`;

const Content = styled.div`
  margin-top: 20px;
`;

const DiaryImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const StatItem = styled.div`
  font-size: 14px;
  color: #555;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
`;

const ContentText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
  color: #444;
`;

const AudioLabel = styled.p`
  font-weight: bold;
  margin-top: 20px;
`;

const Loading = styled.div`
  text-align: center;
`;

const Error = styled.div`
  color: red;
  text-align: center;
`;

const AccountContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const IconContainer = styled.div`
  margin-right: 10px;
`;

const Icon = styled(WonSvg)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #007bff;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TransferTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 25px;
`;

const MoneyAndAccount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Money = styled.span`
  color: #888;
  margin-bottom: 5px;
`;

const Account = styled.span`
  font-weight: bold;
  color: #000;
`;