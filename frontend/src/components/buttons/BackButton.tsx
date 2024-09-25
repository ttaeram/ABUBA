import { useNavigate } from "react-router-dom"
import styled from "styled-components"

const BackButton = ({ label = "뒤로가기", color = "blue" }: { label?: string, color?: string }) => {
  const navigate = useNavigate()

  const toBack = () => {
    navigate(-1)
  }

  return (
    <Button onClick={toBack} color={color}>
      {label}
    </Button>
  )
}

export default BackButton

const Button = styled.button<{ color?: string }>`
  background: none;
  border: none;
  color: ${(props) => props.color || "blue"}; /* 기본 색상은 blue */
  font-size: 16px;
`;