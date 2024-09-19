import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import DiaryListCard from "../../components/layouts/DiaryListCard"
import BackButton from "../../components/buttons/BackButton"
import styled from "styled-components"

const DiaryList = () => {
  const [diaries, setDiaries] = useState<{ id: number; title: string; content: string; date: string; imageUrl: string }[]>([])
  const navigate = useNavigate()

  // 10개의 임시 데이터 생성
  const fetchDiaries = () => {
    const newDiaries = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      title: `일기 ${index + 1}`,
      content: `일기 내용 ${index + 1}`,
      date: '09/19 10:19',
      imageUrl: 'https://via.placeholder.com/400x300',
    }))
    setDiaries(newDiaries)
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
        {diaries.map((diary) => (
          <DiaryListCard key={diary.id} diary={diary} />
        ))}
      </DiaryContainer>
    </Container>
  );
};

export default DiaryList

const Container = styled.div`
  padding: 20px;
  font-family: sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
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
  color: blue;
  font-size: 16px;
`;