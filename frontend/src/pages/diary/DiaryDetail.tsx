import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import BackButton from "../../components/buttons/BackButton"
import axios from "axios"
import AudioPlayer from "../../components/AudioPlayer"
import styled from "styled-components"
import { ReactComponent as WonSvg } from "../../assets/images/won.svg"
import api from "../../api/index"
import dayjs from "dayjs"
import FullLogo from "../../assets/images/fulllogo.svg"

const DiaryDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [diaryData, setDiaryData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [formattedDate, setFormattedDate] = useState<string>('')

  useEffect(() => {
    const fetchDiaryData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')

        if (!accessToken) {
          console.error('Access Token이 없음')
          return
        }
        
        const response = await api.get(`/api/v1/diary/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            diaryId: id,
          }
        })
        console.log(response.data)
        setDiaryData(response.data)
        setLoading(false)
        setFormattedDate(dayjs(response.data.createdAt).format('YYYY년 MM월 DD일'))
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
  
  if (!diaryData) return null;

  const displayImageUrl =
    diaryData.imageUrl === "https://hexagon-abuba.s3.amazonaws.com/null" || !diaryData.imageUrl
      ? FullLogo
      : diaryData.imageUrl

  return (
    <DiaryContainer>
      <Header>
        <BackButton label="이전"/>
        <Date>{formattedDate || "날짜  없음"}</Date>
        <UpdateButton onClick={toDiaryUpdate}>수정</UpdateButton>
      </Header>

      <Content>
        <DiaryImage src={displayImageUrl || 'https://via.placeholder.com/400x300'} alt={diaryData.title} />
        <StatsContainer>
          <StatItem>신장 : {diaryData?.height || 0}</StatItem>
          <StatItem>체중 : {diaryData?.weight || 0}</StatItem>
        </StatsContainer>
        <Title>{diaryData?.title || "제목 없음"}</Title>
        <ContentText>{diaryData?.content || "내용 없음"}</ContentText>
        {diaryData?.recordUrl !== "https://hexagon-abuba.s3.amazonaws.com/null" && (
        <>
          <AudioLabel>목소리 듣기</AudioLabel>
          <AudioPlayer src={diaryData.recordUrl} disableRecording={true} />
        </>
        )}
        {diaryData?.deposit !== 0 && (
          <>
            <AudioLabel>계좌 송금</AudioLabel>
            <AccountContainer>
              <Account>{diaryData.account}</Account>
              <Money>+{Number(diaryData.deposit).toLocaleString()} 원</Money>
            </AccountContainer>
            <AccountContainer>
            <MemoLabel>내 통장 메모</MemoLabel>
            <TransferTitle>{diaryData.memo}</TransferTitle>
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
  font-size: 18px;
  font-weight: bold;
`;

const UpdateButton = styled.button`
  background: none;
  border: none;
  color: #3B6EBA;
  font-size: 16px;
  font-weight: bold;
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
  font-size: 18px;
  color: #555;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
`;

const ContentText = styled.p`
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 20px;
  color: #444;
`;

const AudioLabel = styled.p`
  font-weight: bold;
  margin-top: 20px;
  font-size: 18px;
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
  justify-content: space-between; /* 양 끝에 배치 */
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const TransferTitle = styled.span`
  font-weight: bold;
  color: #000;
  font-size: 14px;
`;

const Money = styled.span`
  color: #3B6EBA;
  margin-bottom: 5px;
  font-size: 14px;
`;

const Account = styled.span`
  font-weight: bold;
  color: #000;
  font-size: 14px;
`;

const MemoLabel = styled.p`
  margin-right: 10px;
  font-size: 14px;
`;