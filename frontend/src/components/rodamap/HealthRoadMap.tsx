import React, { useEffect, useState } from 'react';
import { healthdata } from '../../api/roadmap';
import { TimelineContainer, Line, TimelineItem, Dot, Info } from '../../styles/styledComponents';


interface Health {
  information: string;
}

const HealthRoadMap = () => {
  const [healthData, setHealthData] = useState<Health[]>([]);

  useEffect(() => {
    const getHealthData = async () => {
      try {
        const data = await healthdata();
        setHealthData(data);
      } catch (error) {
        console.error('데이터 요청 실패', error);
      }
    };
 
    getHealthData(); 
  }, []);

  return (
    <TimelineContainer>
      <Line /> 
      {healthData.map((healthItem, index) => {
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
              <div>{healthItem.information || ''}</div>
            </Info>
          </TimelineItem>
        );
      })}
    </TimelineContainer>
  );
};

export default HealthRoadMap;
