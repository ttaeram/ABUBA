import { useNavigate } from "react-router-dom"
import styled from "styled-components"

const BackButton = ({ label = "뒤로가기", color = "#3B6EBA" }: { label?: string, color?: string }) => {
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

const Button = styled.div<{ color?: string }>`
  background: none;
  border: none;
  color: ${(props) => (props.color ? props.color : "#3B6EBA")};
  font-size: 18px;
  font-weight: bold;
`;