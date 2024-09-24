import React from 'react'
import RoadMap from '../../components/rodamap/RoadMap'
import styled from "styled-components"

const ChildRoadMap = () => {
  return (
    <InfoContainer>
      <All>
        태람(이)는 지금
      </All>
      <RoadMap/>

    </InfoContainer>
  )
}

export default ChildRoadMap

const InfoContainer = styled.div`
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
