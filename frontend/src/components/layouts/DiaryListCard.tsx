import { useNavigate } from "react-router-dom"
import styled from "styled-components"

const DiaryListCard = ({ diary }: { diary: { id: number; title: string; content: string; createdAt: string; deposit: number; imageUrl: string } }) => {
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
      <InfoRow>
        <Date>{diary.createdAt}</Date>
        <Money>{diary.deposit}</Money>
      </InfoRow>
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

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between; /* 양 끝으로 배치 */
  align-items: center;
  font-size: 12px;
  color: #999;
`;

const Date = styled.div`
`;

const Money = styled.div`
`;

const DiaryImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 10px;
`;
