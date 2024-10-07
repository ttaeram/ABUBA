import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { VscEdit } from 'react-icons/vsc';
import { SlNotebook } from "react-icons/sl";
import { useNavigate } from 'react-router-dom';
import api from '../../api/index'
import { ReactComponent as FullLogo } from '../../assets/images/fulllogo.svg'

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

  const displayedImages = [...images.slice(0, 3)]; // 최대 3개의 이미지만 표시
  while (displayedImages.length < 3) {
    displayedImages.push({ diaryId: displayedImages.length, imageUrl: '' }); // 이미지가 3개가 안되면 빈 객체 추가
  }

  return (
    <Container>
      <ImageContainer>
        {displayedImages.map((image, index) => (
          image.imageUrl ? (
            <Image key={image.diaryId} src={image.imageUrl || "https://via.placeholder.com/150"} alt={`diary ${image.diaryId}`} />
          ) : (
            <BasicImage key={index} />
          )
        ))}
      </ImageContainer>
      <Text>우리 아이 일기 보기</Text>
      <IconContainer onClick={toDiaryList}>
        <SlNotebook size={24} />
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
  height: 30%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  object-fit: cover;
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

const BasicImage = styled(FullLogo)`
  width: 30%;
  height: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px
`