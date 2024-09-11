import { useNavigate } from "react-router-dom"

const BackButton = () => {
  const navigate = useNavigate()

  const toBack = () => {
    navigate(-1)
  }

  return (
    <button onClick={toBack}>뒤로가기</button>
  )
}

export default BackButton