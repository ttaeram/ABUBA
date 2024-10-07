import { useState } from "react"
import { useNavigate } from "react-router-dom"
import BackButton from "../../components/buttons/BackButton"
import AudioPlayer from "../../components/AudioPlayer"
import DepositModal from "../../components/deposit/DepostModal"
import api from '../../api/index'
import styled from "styled-components"
import { ReactComponent as WonSvg } from "../../assets/images/won.svg"

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
      title: diaryData.title || '제목 없음',
      content: diaryData.content || '내용 없음',
      account: diaryData.account || '계좌 없음',
      deposit: diaryData.deposit || 0,
      height: diaryData.height || 0,
      weight: diaryData.weight || 0,
    };

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
        style={{ display: 'none' }}
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
        <Unit>cm</Unit>
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
        <Unit>kg</Unit>
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

        {diaryData.account && (
          <AccountContainer>
            <IconContainer>
              <Icon />
            </IconContainer>
            <ContentContainer>
              <TransferTitle>{diaryData.title}</TransferTitle>
              <MoneyAndAccount>
                <Money>+ {diaryData.deposit}</Money>
                <Account>{diaryData.account}</Account>
              </MoneyAndAccount>
            </ContentContainer>
          </AccountContainer>
        )}
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
  text-align: center;
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