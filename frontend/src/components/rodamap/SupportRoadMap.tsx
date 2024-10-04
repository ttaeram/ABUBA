import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { supportdata } from '../../api/roadmap';
import { TimelineContainer, Line, TimelineItem, Dot, Info } from '../../styles/styledComponents';


interface Support {
  information: string;
}

const SupportRoadMap = () => {
  const [supportData, setSupportData] = useState<Support[]>([]);

  useEffect(() => {
    const getSupportData = async () => {
      try {
        const data = await supportdata();
        setSupportData(data);
      } catch (error) {
        console.error('데이터 요청 실패', error);
      }
    };
 
    getSupportData(); 
  }, []);

  return (
    <TimelineContainer>
      <Line /> 
      {supportData.map((supportItem, index) => {
        const isLeft = index % 2 === 0;
        return (
          <TimelineItem
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            isLeft={isLeft}
          >
            <Dot/>
            <Info isLeft={isLeft}>
              <div>{supportItem.information || ''}</div>
            </Info>
          </TimelineItem>
        );
      })}
    </TimelineContainer>
  );
};

export default SupportRoadMap;

