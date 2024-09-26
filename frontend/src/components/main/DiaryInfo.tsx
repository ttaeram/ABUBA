import React from 'react';
import styled from 'styled-components';
import { VscEdit } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';

const DiaryInfo = () => {

const navigate = useNavigate()

const toDiaryList = () => {
navigate("/diaryList")
}

  return (
    <Container>
      <ImageContainer>
        <Image src="https://via.placeholder.com/150" alt="img1" />
        <Image src="https://via.placeholder.com/150" alt="img2" />
        <Image src="https://via.placeholder.com/150" alt="img3" />
      </ImageContainer>
      <Text>우리 아이 일기추가하기</Text>
      <IconContainer onClick={toDiaryList}>
        <VscEdit size={24} />
      </IconContainer>
    </Container>
  );
};

export default DiaryInfo;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 90%;
  margin: 20px auto;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
`;

const Image = styled.img`
  width: 30%;
  border-radius: 8px;
`;

const Text = styled.p`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #727272;
`;

const IconContainer = styled.div`
  cursor: pointer;
  color: #3B6EBA;

  &:hover {
    color: #173C91;
  }
`;

