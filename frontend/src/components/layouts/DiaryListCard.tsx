import { useNavigate } from "react-router-dom"
import styled from "styled-components"

const DiaryListCard = ({ diary }: { diary: { id: number; title: string; content: string; date: string; imageUrl: string } }) => {
  const navigate = useNavigate()

  const toDiaryDetail = () => {
    navigate(`/diary/${diary.id}`)
  }

  return (
    <Card>
      <div onClick={toDiaryDetail}>
      <DiaryImage src={diary.imageUrl} alt={diary.title} />
        <Title>{diary.title}</Title>
      </div>
      <Content>{diary.content}</Content>
      <Date>{diary.date}</Date>
    </Card>
  )
}

export default DiaryListCard

const Card = styled.div`
  border: 1px solid #ddd;
  margin: 10px;
  padding: 15px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 18px;
  color: #333;
  margin-bottom: 5px;
`;

const Content = styled.p`
  font-size: 16px;
  color: #555;
  margin: 10px 0;
`;

const Date = styled.div`
  font-size: 12px;
  color: #999;
  text-align: right;
`;

const DiaryImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 10px;
`;
