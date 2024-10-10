import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BsPencilSquare } from "react-icons/bs";

import { useNavigate } from 'react-router-dom';
import api from '../../api/index'
import FullLogo from '../../assets/images/fulllogo.svg'

interface DiaryImage {
  diaryId: number;
  imageUrl: string;
}

const DiaryInfo = () => {
  const [images, setImages] = useState<DiaryImage[]>([])
  const navigate = useNavigate()

  const toDiaryList = () => {
  navigate("/diaryList")
  }

  const toDiaryCreate = () => {
    navigate("/diary/create")
    }

  const fetchLatest = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')

      if (!accessToken) {
        throw new Error('Access Token이 없음')
      }

      const response = await api.get('/api/v1/diary/recents', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setImages(response.data)
    } catch (error) {
      console.error("일기 불러오기 실패", error)
    }
  }

  useEffect(() => {
    fetchLatest()
  }, [])

  const displayedImages = [...images.slice(0, 3)];
  while (displayedImages.length < 3) {
    displayedImages.push({ diaryId: displayedImages.length, imageUrl: '' });
  }

  return (
    <Container>
      <AllText onClick={toDiaryList}>전체보기</AllText>
      <ImageContainer>
        {displayedImages.map((image, index) => (
          image.imageUrl ? (
            <Image key={image.diaryId} src={image.imageUrl} alt={`diary ${image.diaryId}`} />
          ) : (
            <StyledLogo key={index} src={FullLogo} alt="default logo" />
          )
        ))}
      </ImageContainer>
      <Text onClick={toDiaryCreate}>일기 쓰기</Text>
      <IconContainer onClick={toDiaryCreate}>
        <BsPencilSquare size={28}  />
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
  margin-bottom: 20px;
`;

const Image = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  object-fit: cover;
`;

const Text = styled.div`
  display: flex;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #727272;
`;


const AllText = styled.div`
  width: 100%;
  text-align: right;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #ACACAC;
`;

const IconContainer = styled.div`
  cursor: pointer;
  color: #3B6EBA;

  &:hover {
    color: #173C91;
  }
`;

const StyledLogo = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px
`;