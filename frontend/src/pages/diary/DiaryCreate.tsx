import { useState } from "react"
import { useNavigate } from "react-router-dom"
import BackButton from "../../components/buttons/BackButton"
import AudioPlayer from "../../components/AudioPlayer"
import SelectModal from "../../components/deposit/SelectModal"
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

  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleImageClick = () => {
    // 이미지 클릭 시 파일 업로드 트리거
    document.getElementById('imageInput')?.click();
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
    <ImageContainer onClick={handleImageClick}>
      {diaryData.imageUrl ? (
        <PreviewImage src={diaryData.imageUrl} alt="Uploaded" />
      ) : (
        <ImagePlaceholder>+</ImagePlaceholder>
      )}
      <ImageText>아이의 사진을 등록해주세요.</ImageText>
      <Input
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

      <Label>저축</Label>
      <Button onClick={() => setIsModalOpen(true)}>계좌 선택</Button>
    </Content>

    <SelectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={() => alert("저축 완료")} />
  </DiaryContainer>
  )
}

export default DiaryCreate

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

// 사진 업로드 섹션
const ImageContainer = styled.div`
  display: flex;
  flex-direction: column; /* 세로로 배치 */
  align-items: center; /* 가로 중앙 정렬 */
  margin-bottom: 20px;
  cursor: pointer;
  width: 100%;
  text-align: center; /* 텍스트 중앙 정렬 */
`;

const ImagePlaceholder = styled.div`
  width: 200px;
  height: 200px;
  background-color: #e0e0e0;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  color: #acacac;
  margin-bottom: 10px; /* 텍스트와 이미지 간격 추가 */
`;

const PreviewImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
`;

const ImageText = styled.p`
  font-size: 12px;
  margin-top: 10px;
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

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;