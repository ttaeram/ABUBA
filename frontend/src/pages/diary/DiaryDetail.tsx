import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import BackButton from "../../components/buttons/BackButton"
import styled from "styled-components"

const DiaryDetail = () => {
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()

  const toDiaryUpdate = () => {
    navigate(`/diary/${id}/update`)
  }

  return (
    <DiaryContainer>
      <Header>
        <BackButton label="이전"/>
        <Date>2024년 09월 19일</Date>
        <UpdateButton onClick={toDiaryUpdate}>수정</UpdateButton>
      </Header>

      <Content>
        <h1>일기 상세 페이지</h1>
        <p>일기 ID: {id}</p>
        {/* 여기서 API 등을 이용해 일기 내용을 불러와서 표시할 수 있습니다 */}
      </Content>
    </DiaryContainer>
  );
};

export default DiaryDetail

const DiaryContainer = styled.div`
  padding: 20px;
  font-family: sans-serif;
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