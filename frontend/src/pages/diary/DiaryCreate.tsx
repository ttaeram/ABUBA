import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import BackButton from "../../components/buttons/BackButton"
import AudioPlayer from "../../components/AudioPlayer"
import DepositModal from "../../components/deposit/DepostModal"
import api from '../../api/index'
import styled from "styled-components"
import { ReactComponent as WonSvg } from "../../assets/images/won.svg"
import { useChildAuthStore } from "../../stores/authStore"
import { resizeImage } from "../../utils/resizeImage"

const DiaryCreate = () => {
  const navigate = useNavigate()
  const { height: initialHeight, weight: initialWeight, childname, relation, birthdate, gender, setChildInfo } = useChildAuthStore()

  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [height, setHeight] = useState<number>(initialHeight)
  const [weight, setWeight] = useState<number>(initialWeight)
  const [childAccount, setChildAccount] = useState<string>("")
  const [parentAccount, setParentAccount] = useState<string>("")
  const [deposit, setDeposit] = useState<number>(0)
  const [memo, setMemo] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const maxWidth = 1024;  // 최대 가로 크기
      const maxHeight = 1024; // 최대 세로 크기
      
      resizeImage(file, maxWidth, maxHeight, (resizedBlob) => {
        const resizedFile = new File([resizedBlob], file.name, { type: file.type });

        setImageFile(resizedFile)

        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
        }
        const newUrl = URL.createObjectURL(file)
        setPreviewUrl(newUrl)
      })
      console.log(222);
     
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])
  
  const handleNewRecording = (audioBlob: Blob) => {
    setAudioFile(new File([audioBlob], 'recording.wav', { type: 'audio/wav' }))
  }

  const handleImageClick = () => {
    document.getElementById('imageInput')?.click();
  }

  const handleSubmit = async () => {
    const formData = new FormData()

    if (imageFile) {
      formData.append('image', imageFile)
    }
    if (audioFile) {
      formData.append('record', audioFile)
    }

    const info = {
      title: title || '제목 없음',
      content: content || '내용 없음',
      account: childAccount || '계좌 없음',
      deposit: deposit || 0,
      memo: memo || '메모 없음',
      height: height || 0,
      weight: weight || 0,
    };

    formData.append('info', new Blob([JSON.stringify(info)], { type: 'application/json' }))

    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        throw new Error('Access Token이 없음')
      }

      await api.post('/api/v1/diary', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('Success')

      setChildInfo(childname, relation, height, weight, birthdate, gender)
      navigate('/diaryList')
    } catch (error) {
      console.error("Failed to create diary", error)
    }
  }

  const handleConfirm = (selectedChildAccount: string, selectedParentAccount: string, memo: string, deposit: number) => {
    setChildAccount(selectedChildAccount)
    setParentAccount(selectedParentAccount)
    setMemo(memo)
    setDeposit(deposit)
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
      {previewUrl ? (
        <PreviewImage src={previewUrl} alt="Uploaded" />
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
        style={{ display: 'none' }}
      />
    </ImageContainer>

    <StatsContainer>
      <StatItem>
        <StatLabel>신장</StatLabel>
        <StatInput
          type="number"
          name="height"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          placeholder="신장"
        />
        <Unit>cm</Unit>
      </StatItem>

      <StatItem>
        <StatLabel>체중</StatLabel>
        <StatInput
          type="number"
          name="weight"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          placeholder="체중"
        />
        <Unit>kg</Unit>
      </StatItem>
    </StatsContainer>

      <Label>제목</Label>
      <Input
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
      />

      <Label>내용</Label>
      <Textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="오늘의 감정을 기록해 보세요."
      />

      <Label>음성 녹음</Label>
      <AudioContainer>
        <AudioPlayer onNewRecording={handleNewRecording} />
      </AudioContainer>

      <DepositContainer>
        <Label>계좌 송금</Label>
        <Button onClick={() => setIsModalOpen(true)}>계좌 선택</Button>
        <DepositModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={(selectedChildAccount, selectedParentAccount, memo, deposit) => handleConfirm(selectedChildAccount, selectedParentAccount, memo, deposit)}
        />
      </DepositContainer>
      {childAccount && (
        <>
          <AccountContainer>
            <Account>{childAccount}</Account>
            <Money>+{Number(deposit).toLocaleString()} 원</Money>
          </AccountContainer>
          <AccountContainer>
            <MemoLabel>내 통장 메모:</MemoLabel>
            <TransferTitle>{memo}</TransferTitle>
          </AccountContainer>
        </>
      )}
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
  font-size: 20px;
  font-weight: bold;
`;

const ActionButton = styled.div`
  background: none;
  border: none;
  color: #3B6EBA;
  font-size: 20px;
  font-weight: bold;
`;

const Content = styled.div`
  margin-top: 20px;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
  width: 100%;
  text-align: center;
`;

const ImagePlaceholder = styled.div`
  width: 200px;
  height: 200px;
  background-color: white;
  border: solid #3B6EBA;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  color: #3B6EBA;
  margin-bottom: 10px;
`;

const PreviewImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
`;

const ImageText = styled.p`
  font-size: 16px;
  margin-top: 10px;
  color: #acacac;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-betwee;
  margin-bottom: 20px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
`;

const StatLabel = styled.label`
  font-size: 20px;
  font-weight: bold;
`;

const StatInput = styled.input`
  width: 60px;
  padding: 5px;
  text-align: right;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-left: 40px;
  font-size: 16px;
`;

const Unit = styled.span`
  margin-left: 10px;
  font-size: 18px;
  color: #555;
`;

const Label = styled.label`
  font-weight: bold;
  display: block;
  margin-top: 10px;
  font-size: 18px;
`;

const Input = styled.input`
  width: calc(100% - 0px);
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Textarea = styled.textarea`
  width: calc(100% - 0px);
  height: 120px;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: white;
  color: #3B6EBA;
  border-color: #3B6EBA;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 16px;

  &:hover {
    background-color: #3B6EBA;
    border-color: white;
    color: white;
  }
`;

const DepositContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const AccountContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const AudioContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
`

const TransferTitle = styled.span`
  font-weight: bold;
  color: #000;
`;

const Money = styled.span`
  color: #3B6EBA;
  margin-bottom: 5px;
`;

const Account = styled.span`
  font-weight: bold;
  color: #000;
`;

const MemoLabel = styled.p`
  margin-right: 10px;
`;