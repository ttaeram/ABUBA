import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import BackButton from "../../components/buttons/BackButton"
import AudioPlayer from "../../components/AudioPlayer"
import DepositModal from "../../components/deposit/DepostModal"
import api from '../../api/index'
import styled from "styled-components"
import { ReactComponent as WonSvg } from "../../assets/images/won.svg"
import { useChildAuthStore } from "../../stores/authStore"

interface DiaryData {
  title: string;
  content: string;
  height: number;
  weight: number;
  imageFile?: File | null;
  audioFile?: File | null;
  account: string;
  deposit: number;
  memo: string;
}

const DiaryCreate = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [height, setHeight] = useState<number>(0)
  const [weight, setWeight] = useState<number>(0)
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
      setImageFile(file)

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      const newUrl = URL.createObjectURL(file)
      setPreviewUrl(newUrl)
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
          onConfirm={(selectedChildAccount, selectedParentAccount, memo, deposit) => handleConfirm(selectedChildAccount, selectedParentAccount, memo, deposit)}
        />
      </DepositContainer>
      {childAccount && (
        <AccountContainer>
          <IconContainer>
            <Icon />
          </IconContainer>
          <ContentContainer>
            <TransferTitle>{memo}</TransferTitle>
            <MoneyAndAccount>
              <Money>+ {deposit}</Money>
              <Account>{childAccount}</Account>
            </MoneyAndAccount>
          </ContentContainer>
        </AccountContainer>
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
  background-color: #e0e0e0;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  color: #acacac;
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
  font-size: 12px;
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
  font-size: 16px;
  font-weight: bold;
`;

const StatInput = styled.input`
  width: 60px;
  padding: 5px;
  text-align: right;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-left: 40px
`;

const Unit = styled.span`
  margin-left: 10px;
  font-size: 14px;
  color: #555;
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
  height: 120px;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: white;
  color: #3B6EBA;
  border-color: #3B6EBA;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #3B6EBA;
    border-color: white
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
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const IconContainer = styled.div`
  margin-right: 10px;
`;

const Icon = styled(WonSvg)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #007bff;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TransferTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 25px;
`;

const MoneyAndAccount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Money = styled.span`
  color: #888;
  margin-bottom: 5px;
`;

const Account = styled.span`
  font-weight: bold;
  color: #000;
`;