import { useNavigate } from "react-router-dom"

const Main = () => {
  const navigate = useNavigate()

  const toDiaryList = () => {
    navigate("/diaryList")
  }

  return (
    <div>
      <h1>Main</h1>
      <p onClick={toDiaryList}>일기 전체 보기</p>
    </div>
  )
}

export default Main
