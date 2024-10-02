import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import DiaryInfo from '../components/main/DiaryInfo'
import AccountInfo from "../components/main/AccountInfo"
import RoadMap from "../components/rodamap/RoadMap"
import { useAuthStore, useChildAuthStore } from "../stores/authStore"
import { calculateAge } from "../utils/calculateAge"

const Main = () => {

  const navigate = useNavigate();
  const { email, name } = useAuthStore();
  const { childname, relation, height, weight, birthdate, gender } = useChildAuthStore();
  const handleAccountClick = () => {
    navigate('/account'); 
  };

  const handleRoadMapClick = () => {
    navigate('/roadmap'); 
  };

  const age = calculateAge(birthdate);

  return (
    <div>
      <ChildInfoContainer>
        <TextInfo>
          <Name>
            {childname}
          </Name>
          <BirthContainer>
            <Age>
              만 {age}세 ({gender})
            </Age>
            <BirthDay>
              출생 {birthdate}
            </BirthDay>
          </BirthContainer>
      
        </TextInfo>
        <DiaryInfo></DiaryInfo>
      </ChildInfoContainer>
      <AccountInfoContainer>
        <All onClick={handleAccountClick}>
          전체보기
        </All>
        <TitleText>
          내 아이 계좌 정보
        </TitleText>
        <SubText>
          아이를 위해 미리 준비해보세요!
        </SubText>
        <AccountInfo></AccountInfo>
      </AccountInfoContainer>
      <RodaMapContainer>
        <All onClick={handleRoadMapClick}>
          전체보기
        </All>
        <TitleText>
          내 아이 로드맵
        </TitleText>
        <SubText>
          어부바와 함께 하는 길라잡이
        </SubText>
        <RoadMap></RoadMap>
      </RodaMapContainer>
    </div>
  )
}

export default Main


//아이 정보
const ChildInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  background-color: #3B6EBA;
  border-radius: 8px;
  padding: 5px;
`

const TextInfo = styled.div`
  display: flex;
  width: 90%;
  margin: 20px auto;
  align-items: center;
  justify-content: space-between;
`

const Name = styled.div`
  font-size:30px;

`

const BirthContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
  
`

const BirthDay = styled.div`
  
  
`

const Age = styled.div`
  margin-bottom: 5px;

`

//계좌 상세정보
const AccountInfoContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 20px;
  flex-direction: column;
  color:#acacac;

`

const All = styled.div`
  display: flex;
  justify-content: right;
  text-align: right;
`

const TitleText = styled.div`
  display: flex;
  font-size: 22px;
  color:black;
  margin-bottom: 5px;
`

const SubText = styled.div`
  display: flex;
  font-size:14px;
  margin-bottom: 10px;
  justify-content: space-between;

`

//로드맵
const RodaMapContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 20px;
  flex-direction: column;
  color:#acacac;
`