import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const growthData = [
  { age: '0-1', growth: '신생아 건강 검사' },
  { age: '1-2', growth: '운동 능력 발달' },
  { age: '2-3', growth: '사회성 발달' },
  { age: '4-5', growth: null },
  { age: '6-7', growth: '언어 발달' },
  { age: '8-9', growth: '정신적 성숙' },
  { age: '10+', growth: null }, 
];

const GrowthRoadMap = () => {
  return (
    <TimelineContainer>
      <Line /> 
      {growthData.map((growthItem, index) => {

        return (
          <TimelineItem
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <VaccinationInfo>
 
            </VaccinationInfo>
            <Dot /> 
            <GrowthInfo>
              <div>{growthItem.growth || ''}</div>
            </GrowthInfo>
          </TimelineItem>
        );
      })}
    </TimelineContainer>
  );
};

export default GrowthRoadMap;

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 40px 0;
`;

const Line = styled.div`
  position: absolute;
  width: 4px; 
  background: #a1a1a1; 
  height: 100%; 
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 0;
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%; 
  position: relative;
  margin: 20px 0;
  padding: 10px;
`;

const Dot = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: #3B6EBA;
  border-radius: 50%;
  z-index: 1;
`;

const VaccinationInfo = styled.div`
  display: flex;
  justify-content: right;
  padding: 10px;
  z-index: 1;
  width: 45%;
  color: #c9ab05;
`;

const GrowthInfo = styled.div`
  display: flex;
  justify-content: left;
  padding: 10px;
  z-index: 1;
  width: 45%;
  color: #940404;
`;
