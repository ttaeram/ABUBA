import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import BackButton from "../../components/buttons/BackButton"
import AudioPlayer from "../../components/AudioPlayer"
import axios from "axios"
import styled from "styled-components"

const mockDiaryData = {
  date: "2024년 7월 31일",
  title: "뒤집기 한 날",
  content: "오늘은 태하가 뒤집기를 했다. 너무나도 사랑스러운 아이다!!",
  height: 163,
  weight: 110,
  imageUrl: "https://via.placeholder.com/400x300", // Placeholder image
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Sample audio URL
}

const DiaryUpdate = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [diaryData, setDiaryData] = useState<any>(mockDiaryData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDiaryData({ ...diaryData, [name]: value })
  }

  const handleNewRecording = (newAudioUrl: string) => {
    setDiaryData({ ...diaryData, audioUrl: newAudioUrl });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/v1/diary/${id}`, diaryData)
      navigate(`/diary/${id}`)
    } catch (e) {
      console.error("Failed to update diary: ", e)
    }
  }

  return (
    <DiaryContainer>
    <Header>
      <BackButton label="취소"/>
      <Title>일기 수정</Title>
      <ActionButton onClick={handleUpdate}>확인</ActionButton>
    </Header>

    <Content>
      <DiaryImage src={diaryData?.imageUrl || 'https://via.placeholder.com/400x300'} alt={diaryData.title} />
      <StatsContainer>
        <p>신장 </p><StatInput
          type="number"
          name="height"
          value={diaryData.height}
          onChange={handleChange}
          placeholder="신장"
        />
        <p>체중 </p><StatInput
          type="number"
          name="weight"
          value={diaryData.weight}
          onChange={handleChange}
          placeholder="체중"
        />
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

const DiaryImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
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
`