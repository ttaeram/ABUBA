import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import DiaryListCard from "../../components/layouts/DiaryListCard"
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

  useEffect(() => {
    fetchDiaries()
  }, [])

  const toDiaryCreate = () => {
    navigate("/diary/create")
  }

  return (
    <Container>
      <Header>
        <Title>일기장</Title>
        <CreateButton onClick={toDiaryCreate}>작성</CreateButton>
      </Header>
      <DiaryContainer isEmpty={diaries.length === 0}>
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
  position: relative;
  display: flex;
  justify-content: flex-end; /* 작성 버튼을 오른쪽 끝으로 보냄 */
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  font-weight: bold;
`;

const DiaryContainer = styled.div<{ isEmpty: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: ${(props) => (props.isEmpty ? "center" : "flex-start")};
  align-items: ${(props) => (props.isEmpty ? "center" : "stretch")};
  height: ${(props) => (props.isEmpty ? "100vh" : "auto")};
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
`;