import { useState,useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import BackButton from "../../components/buttons/BackButton"
import AudioPlayer from "../../components/AudioPlayer"
import axios from "axios"
import styled from "styled-components"
import api from "../../api/index"

const DiaryUpdate = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const [diaryData, setDiaryData] = useState<any>(location.state?.diaryData || null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<Blob | null>(null)

  useEffect(() => {
    if (!diaryData) {
      const fetchDiaryData = async () => {
        try {
          const accessToken = localStorage.getItem('accessToken');
          if (!accessToken) {
            throw new Error('Access Token이 없음');
          }
          const response = await api.get(`/api/v1/diary/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setDiaryData(response.data);
        } catch (e) {
          console.error("Failed to load diary data:", e);
        }
      };
      fetchDiaryData();
    }
  }, [diaryData, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDiaryData({ ...diaryData, [name]: value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setDiaryData({ ...diaryData, imageUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    document.getElementById('imageInput')?.click();
  }

  const handleNewRecording = (audioBlob: Blob) => {
    setAudioFile(audioBlob)
  };

  const handleUpdate = async () => {
    const formData = new FormData()

    if (imageFile) {
      formData.append("image", imageFile);
    }

    // 새로 녹음된 오디오 파일이 있으면 추가
    if (audioFile) {
      formData.append("record", audioFile);
    }

    const diaryJson = JSON.stringify({
      title: diaryData.title,
      content: diaryData.content,
      height: diaryData.height,
      weight: diaryData.weight,
    })

    formData.append("diary", new Blob([diaryJson], { type: "application/json" }))

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access Token이 없음');
      }

      await api.put(`/api/v1/diary/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      navigate(`/diary/${id}`)
    } catch (e) {
      console.error("Failed to update diary: ", e)
    }
  }

  if (!diaryData) return <div>Loading...</div>;

  return (
    <DiaryContainer>
    <Header>
      <BackButton label="취소"/>
      <Title>일기 수정</Title>
      <ActionButton onClick={handleUpdate}>확인</ActionButton>
    </Header>

    <Content>
      <ImageContainer onClick={handleImageClick}>
        <DiaryImage src={diaryData?.imageUrl || 'https://via.placeholder.com/400x300'} alt={diaryData.title} />
        <ImageText>아이의 사진을 수정하려면 클릭하세요.</ImageText>
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }} // 파일 업로드 버튼 숨김
        />
      </ImageContainer>

      <StatsContainer>
        <StatItem>
          <StatLabel>신장</StatLabel>
          <StatInput
            type="number"
            name="height"
            value={diaryData.height}
            onChange={handleChange}
            placeholder="신장"
          />
        </StatItem>
        <StatItem>
          <StatLabel>체중</StatLabel>
          <StatInput
            type="number"
            name="weight"
            value={diaryData.weight}
            onChange={handleChange}
            placeholder="체중"
          />
        </StatItem>
      </StatsContainer>

      <Label>제목</Label>
      <Input
        type="text"
        name="title"
        value={diaryData.title}
        onChange={handleChange}
      />
      <Label>내용</Label>
      <Textarea
        name="content"
        value={diaryData.content}
        onChange={handleChange}
      />
    </Content>
    <Label>목소리 녹음/듣기</Label>
    <AudioPlayer src={diaryData.audioUrl} onNewRecording={handleNewRecording} />
  </DiaryContainer>
  )
}

export default DiaryUpdate

const DiaryContainer = styled.div`
  padding: 20px;
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

const ImageContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
  cursor: pointer; /* 클릭 가능하게 표시 */
`;

const DiaryImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const ImageText = styled.p`
  font-size: 12px;
  color: #acacac;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  align-items: center;
`;

const StatLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin: 10px;
`;

const StatInput = styled.input`
  width: 60px;
  padding: 5px;
  margin-top: 5px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Label = styled.label`
  font-weight: bold;
  display: block;
  margin-top: 10px;
`;

const Input = styled.input`
  width: calc(100% - 0px);
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Textarea = styled.textarea`
  width: calc(100% - 0px);
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;