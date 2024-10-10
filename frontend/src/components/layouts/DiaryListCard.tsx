import dayjs from "dayjs";
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import FullLogo from "../../assets/images/fulllogo.svg"

const DiaryListCard = ({ diary }: { diary: { id: number; title: string; content: string; createdAt: string; deposit: number; imageUrl: string } }) => {
  const navigate = useNavigate()
  const formattedDate = dayjs(diary.createdAt).format('YYYY년 MM월 DD일')

  const toDiaryDetail = () => {
    navigate(`/diary/${diary.id}`)
  }

  const truncatedContent = diary.content.length > 20
    ? diary.content.substring(0, 20) + "..."
    : diary.content

  const isDefaultImage = !diary.imageUrl || diary.imageUrl === "https://hexagon-abuba.s3.amazonaws.com/null"

  return (
    <Card>
      <div onClick={toDiaryDetail}>
        {isDefaultImage ? (
          <StyledLogo src={FullLogo} alt="default logo" />
        ) : (
          <DiaryImage src={diary.imageUrl} alt={diary.title} />
        )}

        <Title>{diary.title}</Title>
      </div>
      <Content>{truncatedContent}</Content>
      <InfoRow>
        <Date>{formattedDate}</Date>
        <Money>+{diary.deposit} 원</Money>
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
  font-size: 24px;
  color: #333;
  margin-bottom: 5px;
`;

const Content = styled.p`
  font-size: 20px;
  color: #555;
  margin: 10px 0;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  color: #999;
`;

const Date = styled.div`
`;

const Money = styled.div`
  color: #3B6EBA
`;

const DiaryImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  margin-bottom: 10px;
  object-fit: cover;
`;

const StyledLogo = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  padding: 100px
`;
