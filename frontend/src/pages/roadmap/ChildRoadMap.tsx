import React, { useState } from 'react'
import styled from "styled-components"
import { useChildAuthStore } from '../../stores/authStore';
import { calculateAge } from '../../utils/calculateAge';
import { changeShortName } from '../../utils/changeShortName';
import AverageRoadMap from '../../components/rodamap/AverageRoadMap';
import SupportRoadMap from '../../components/rodamap/SupportRoadMap';
import HealthRoadMap from '../../components/rodamap/HealthRoadMap';

const ChildRoadMap = () => {
  const [selectedTab, setSelectedTab] = useState('성장 발달');
  const {childname, birthdate} = useChildAuthStore();
  const age = calculateAge(birthdate);
  const shortname = changeShortName(childname);
  return (
    <InfoContainer>
      <All>
        {shortname}(이)는 지금 만 {age} 살
      </All>

      <TabContainer>
        <Tab onClick={() => setSelectedTab('성장 발달')} isSelected={selectedTab === '성장 발달'}>성장 발달</Tab>
        <Tab onClick={() => setSelectedTab('정부 지원')} isSelected={selectedTab === '정부 지원'}>정부 지원</Tab>
        <Tab onClick={() => setSelectedTab('의료 정보')} isSelected={selectedTab === '의료 정보'}>의료 정보</Tab>
      </TabContainer>

      {selectedTab === '성장 발달' && <AverageRoadMap />}
      {selectedTab === '정부 지원' && <SupportRoadMap />}
      {selectedTab === '의료 정보' && <HealthRoadMap/>}

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
  font-size: 22px;
  color:#173C91;
  margin-bottom: 20px;
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