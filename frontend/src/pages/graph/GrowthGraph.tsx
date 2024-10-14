import React from 'react'
import styled from 'styled-components';
import Growth from '../../components/graph/Growth';


const GrowthGraph = () => {
  return (
    <div>
      <TextContainer>
        <TitleText>
            아이 성장 기록
        </TitleText>
        <SubText>
            내 아이의 성장 기록을 한 눈에 확인해봐요!
        </SubText>
        <Growth></Growth>
      </TextContainer>
    </div>
  
  )
}

export default GrowthGraph

const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 20px;
  flex-direction: column;
  color:#acacac;

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