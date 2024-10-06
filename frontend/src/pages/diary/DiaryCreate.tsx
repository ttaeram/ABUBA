import { useState } from "react"
import { useNavigate } from "react-router-dom"
import BackButton from "../../components/buttons/BackButton"
import AudioPlayer from "../../components/AudioPlayer"
import DepositModal from "../../components/deposit/DepostModal"
import api from '../../api/index'
import styled from "styled-components"

interface DiaryData {
  title: string;
  content: string;
  height: number;
  weight: number;
  imageFile?: File | null;
  audioFile?: File | null;
  account: string;
  deposit: number;
}

const DiaryCreate = () => {
  const navigate = useNavigate()
  const [diaryData, setDiaryData] = useState<DiaryData>({
    title: "",
    content: "",
    height: 0,
    weight: 0,
    account: "",
    deposit: 0,
    imageFile: null,
    audioFile: null,
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDiaryData({ ...diaryData, [name]: value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setDiaryData({ ...diaryData, imageFile: file })
    }
  }
  
  const handleNewRecording = (audioBlob: Blob) => {
    const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' })
    setDiaryData({ ...diaryData, audioFile })
  }

  const handleImageClick = () => {
    document.getElementById('imageInput')?.click();
  }

  const handleSubmit = async () => {
    const formData = new FormData()

    if (diaryData.imageFile) {
      formData.append('image', diaryData.imageFile)
    }
    if (diaryData.audioFile) {
      formData.append('record', diaryData.audioFile)
    }

    const info = {
      title: diaryData.title || '제목 없음',  // 기본값 추가
      content: diaryData.content || '내용 없음',  // 기본값 추가
      account: diaryData.account || '계좌 없음',  // 기본값 추가
      deposit: diaryData.deposit || 0,
      height: diaryData.height || 0,  // 기본값 추가
      weight: diaryData.weight || 0,  // 기본값 추가
    };

    // 'info'를 문자열로 변환하여 FormData에 추가
    formData.append('info', new Blob([JSON.stringify(info)], { type: 'application/json' }))

    try {
      const accessToken = localStorage.getItem('accessToken')

      if (!accessToken) {
        throw new Error('Access Token이 없음')
      }
      
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      await api.post('/api/v1/diary', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('Success')
      navigate('/diaryList')
    } catch (error) {
      console.error("Failed to create diary", error)
    }
  }

  const handleConfirm = (selectedAccount: string, memo: string, deposit: number) => {
    setDiaryData({
      ...diaryData,
      account: selectedAccount,
      deposit: deposit,
    })
    setIsModalOpen(false)
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
      {diaryData.imageFile ? (
        <PreviewImage src={URL.createObjectURL(diaryData.imageFile)} alt="Uploaded" />
      ) : (
        <>
          <ImagePlaceholder>+</ImagePlaceholder>
          <ImageText>아이의 사진을 등록해주세요.</ImageText>
        </>
      )}
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

      <Label>음성 녹음</Label>
      <AudioPlayer onNewRecording={handleNewRecording} />

      <DepositContainer>
        <Label>계좌 송금</Label>
        <Button onClick={() => setIsModalOpen(true)}>계좌 선택</Button>
        <DepositModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={(selectedAccount, memo, deposit) => handleConfirm(selectedAccount, memo, deposit)}
        />
      </DepositContainer>
    </Content>
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
  background-color: #3B6EBA;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #173C91;
  }
`;

const DepositContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`