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
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

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
          setError("일기를 불러오는 데 실패했습니다.")
        } finally {
          setLoading(false)
        }
      };
      fetchDiaryData();
    } else {
      setLoading(false)
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

    if (audioFile) {
      formData.append("record", audioFile);
    }

    const info = {
      diaryId: diaryData.id,
      title: diaryData.title || '제목 없음',
      content: diaryData.content || '내용 없음',
      height: diaryData.height || 0,
      weight: diaryData.weight || 0,
    };

    formData.append('info', new Blob([JSON.stringify(info)], { type: 'application/json' }))

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access Token이 없음');
      }

      await api.put(`/api/v1/diary`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
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
        {diaryData.imageUrl !== "https://hexagon-abuba.s3.amazonaws.com/null" ? (
          <DiaryImage src={diaryData?.imageUrl} alt="Uploaded" />
        ) : (
          <>
            <ImagePlaceholder>+</ImagePlaceholder>
          </>
        )}
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
      />
      <Label>내용</Label>
      <Textarea
        name="content"
        value={diaryData.content}
        onChange={handleChange}
      />

      <Label>목소리 듣기/녹음</Label>
      <AudioContainer>
        <AudioPlayer src={diaryData.audioUrl} onNewRecording={handleNewRecording} />
      </AudioContainer>
    </Content>
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
  font-size: 20px;
  font-weight: bold;
`;

const ActionButton = styled.div`
  background: none;
  border: none;
  color: #3B6EBA;
  font-size: 18px;
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
`;

const DiaryImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
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

const ImageText = styled.p`
  font-size: 16px;
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
  margin-left: 20px;
  font-size: 14px;
`;

const Unit = styled.span`
  margin-left: 10px;
  font-size: 16px;
  color: #555;
`;

const Label = styled.label`
  font-weight: bold;
  display: block;
  margin-top: 10px;
  font-size: 16x;
`;

const Input = styled.input`
  width: calc(100% - 0px);
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

const Textarea = styled.textarea`
  width: calc(100% - 0px);
  height: 120px;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

const AudioContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
`