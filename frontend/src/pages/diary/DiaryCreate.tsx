import BackButton from "../../components/buttons/BackButton"
import styled from "styled-components"

const DiaryCreate = () => {
  return (
    <DiaryContainer>
    <Header>
      <BackButton label="취소"/>
      <Title>일기 작성</Title>
      <ActionButton>확인</ActionButton>
    </Header>

    <Content>
      <h1>일기 작성 페이지</h1>
      {/* 여기서 API 등을 이용해 일기 내용을 불러와서 표시할 수 있습니다 */}
    </Content>
  </DiaryContainer>
  )
}

export default DiaryCreate

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

const Title = styled.h2`
  font-size: 16px;
  font-weight: bold;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: blue;
  font-size: 16px;
`;

const Content = styled.div`
  margin-top: 20px;
`;