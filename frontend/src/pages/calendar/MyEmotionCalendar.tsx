import React from 'react'
import EmotionCalendar from '../../components/calendar/EmotionCalendar'
import styled from 'styled-components';

const MyEmotionCalendar = () => {
  return (
    <div>
      <TextContainer>
        <TitleText>
          육아 감정 일기
        </TitleText>
        <SubText>
          일기 작성 당시의 감정을 AI가 분석해줘요!
        </SubText>
      </TextContainer>
      <EmotionCalendar/>
    </div>
  
  )
}

export default MyEmotionCalendar

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