import React, { useState } from 'react'
import RoadMap from '../../components/rodamap/RoadMap'
import styled from "styled-components"
import VaccinationRoadMap from '../../components/rodamap/VaccinationRoadMap';
import GrowthRoadMap from '../../components/rodamap/GrowthRoadMap';

const ChildRoadMap = () => {
  const [selectedTab, setSelectedTab] = useState('전체');
  return (
    <InfoContainer>
      <All>
        태람(이)는 지금 2 살
      </All>

      <TabContainer>
        <Tab onClick={() => setSelectedTab('전체')} isSelected={selectedTab === '전체'}>전체</Tab>
        <Tab onClick={() => setSelectedTab('백신')} isSelected={selectedTab === '백신'}>백신</Tab>
        <Tab onClick={() => setSelectedTab('발달정보')} isSelected={selectedTab === '발달정보'}>발달정보</Tab>
      </TabContainer>

      {selectedTab === '전체' && <RoadMap />}
      {selectedTab === '백신' && <VaccinationRoadMap />}
      {selectedTab === '발달정보' && <GrowthRoadMap />}

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
const TabContainer = styled.div`
  display: flex;
  justify-content: left;
  margin-bottom: 20px;
`;

interface TabProps {
  isSelected: boolean;
}

const Tab = styled.div<TabProps>`
  padding: 10px 20px;
  margin: 0 10px;
  cursor: pointer;
  border-bottom: ${({ isSelected }) => (isSelected ? '2px solid #000' : 'none')};
  font-weight: ${({ isSelected }) => (isSelected ? 'bold' : 'normal')};
  color: ${({ isSelected }) => (isSelected ? '#000' : '#acacac')};
`;