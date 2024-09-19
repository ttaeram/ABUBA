import { useNavigate } from "react-router-dom"
import styled from "styled-components"

const BackButton = ({ label = "뒤로가기" }: { label?: string }) => {
  const navigate = useNavigate()

  const toBack = () => {
    navigate(-1)
  }

  return (
    <Button onClick={toBack}>{label}</Button>
  )
}

export default BackButton

const Button = styled.button`
  background: none;
  border: none;
  color: blue;
  font-size: 16px;

`;