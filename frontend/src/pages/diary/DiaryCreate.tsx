import { useState } from "react"
import { useNavigate } from "react-router-dom"
import BackButton from "../../components/buttons/BackButton"
import AudioPlayer from "../../components/AudioPlayer"
import axios from "axios"
import styled from "styled-components"

interface DiaryData {
  date: string;
  title: string;
  content: string;
  height: number;
  weight: number;
  imageUrl: string;
  audioUrl: string;
}

const DiaryCreate = () => {
  const navigate = useNavigate()
  const [diaryData, setDiaryData] = useState<DiaryData>({
    date: new Date().toISOString().split('T')[0],
    title: "",
    content: "",
    height: 0,
    weight: 0,
    imageUrl: "",
    audioUrl: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDiaryData({ ...diaryData, [name]: value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setDiaryData({ ...diaryData, imageUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNewRecording = (newAudioUrl: string) => {
    setDiaryData({ ...diaryData, audioUrl: newAudioUrl })
  }

  const handleSubmit = async () => {
    try {
      await axios.post('api/v1/diary', diaryData)
      navigate('/diary')
    } catch (error) {
      console.error("Failed to create diary", error)
    }
  }

  return (
    <DiaryContainer>
    <Header>
      <BackButton label="취소"/>
      <Title>일기 작성</Title>
      <ActionButton onClick={handleSubmit}>확인</ActionButton>
    </Header>

    <Content>
    <ImageUpload>
      <ImagePlaceholder>+</ImagePlaceholder>
      <ImageText>아이의 사진을 등록해주세요.</ImageText>
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />
    </ImageUpload>

    <StatsContainer>
      <StatItem>
        <Label>키 (cm)</Label>
        <StatInput
          type="number"
          name="height"
          value={diaryData.height}
          onChange={handleChange}
        />
      </StatItem>
      <StatItem>
        <Label>몸무게 (kg)</Label>
        <StatInput
          type="number"
          name="weight"
          value={diaryData.weight}
          onChange={handleChange}
        />
      </StatItem>
    </StatsContainer>
      <Label>제목</Label>
      <Input
        type="text"
        name="title"
        value={diaryData.title}
        onChange={handleChange}
        placeholder="제목을 입력하세요"
      />

      <Label>내용</Label>
      <Textarea
        name="content"
        value={diaryData.content}
        onChange={handleChange}
        placeholder="오늘의 일기를 작성해주세요"
      />

      {diaryData.imageUrl && <PreviewImage src={diaryData.imageUrl} alt="Preview" />}

      <Label>음성 녹음</Label>
      <AudioPlayer src={diaryData.audioUrl} onNewRecording={handleNewRecording} />
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

const ImageUpload = styled.div`
  text-align: center;
`;

const ImagePlaceholder = styled.div`
  width: 100px;
  height: 100px;
  background-color: #e0e0e0;
  border-radius: 5px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

const ImageText = styled.p`
  font-size: 12px;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const StatItem = styled.div`
`;


const StatInput = styled.input`
  width: 45px;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
`

const Label = styled.label`
  font-weight: bold;
`

const Input = styled.input`
  width: calc(100% - 20px);
  padding: 10px;
`

const Textarea = styled.textarea`
  width: calc(100% - 20px);
  padding: 10px;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 10px;
  border-radius: 4px;
`;