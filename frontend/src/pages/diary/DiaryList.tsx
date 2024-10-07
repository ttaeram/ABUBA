import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import DiaryListCard from "../../components/layouts/DiaryListCard"
import BackButton from "../../components/buttons/BackButton"
import styled from "styled-components"
import api from "../../api/index";

const DiaryList = () => {
  const [diaries, setDiaries] = useState<{ id: number; title: string; content: string; createdAt: string; deposit: number; imageUrl: string }[]>([])
  const navigate = useNavigate()

  const fetchDiaries = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')

      if (!accessToken) {
        throw new Error('Access Token이 없음')
      }

      const response = await api.get(`/api/v1/diary`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      setDiaries(response.data)
    } catch (error) {
      console.log("일기장을 가져오는게 안돼")
    }
  }

  // 컴포넌트가 마운트될 때 데이터 로딩
  useEffect(() => {
    fetchDiaries()
  }, [])

  const toDiaryCreate = () => {
    navigate("/diary/create")
  }

  return (
    <Container>
      <Header>
        <BackButton label="이전" />
        <Title>일기장</Title>
        <CreateButton onClick={toDiaryCreate}>작성</CreateButton>
      </Header>
      <DiaryContainer>
        {diaries.length > 0 ? (
          diaries.map((diary) => (
            <DiaryListCard key={diary.id} diary={diary} />
          ))
        ) : (
          <NoDiariesMessage>작성한 일기가 없습니다.</NoDiariesMessage>
        )}
      </DiaryContainer>
    </Container>
  );
};

export default DiaryList

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const DiaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CreateButton = styled.button`
  background: none;
  border: none;
  color: #3B6EBA;
  font-size: 16px;
  font-weight: bold;
`;

const NoDiariesMessage = styled.div`
  text-align: center;
  font-size: 16px;
  color: #999;
  margin-top: 20px;
`;