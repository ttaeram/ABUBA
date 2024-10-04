import React, { useEffect, useState } from 'react';
import { TimelineContainer, Line, TimelineItem, Dot, Info } from '../../styles/styledComponents';
import { averagedata } from '../../api/roadmap';

interface Average {
  information: string;
}

const AverageRoadMap = () => {
  const [averageData, setAverageData] = useState<Average[]>([]);

  useEffect(() => {
    const getAverageData = async () => {
      try {
        const data = await averagedata();
        setAverageData(data);
      } catch (error) {
        console.error('데이터 요청 실패', error);
      }
    };
 
    getAverageData(); 
  }, []);

  return (
    <TimelineContainer>
      <Line /> 
      {averageData.map((averageItem, index) => {
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
              <div>{averageItem.information || ''}</div>
            </Info>
          </TimelineItem>
        );
      })}
    </TimelineContainer>
  );
};

export default AverageRoadMap;

