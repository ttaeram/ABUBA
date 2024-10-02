import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { averagendata } from '../../api/roadmap';

interface Vaccination {
  information: string;
}

const VaccinationRoadMap = () => {
  const [vaccinationData, setVaccinationData] = useState<Vaccination[]>([]);

  useEffect(() => {
    const getVaccinationData = async () => {
      try {
        const data = await averagendata();
        console.log(data);
        setVaccinationData(data);
      } catch (error) {
        console.error('Failed to fetch vaccination data', error);
      }
    };
 
    getVaccinationData(); 
  }, []);

  return (
    <TimelineContainer>
      <Line /> 
      {vaccinationData.map((vaccinationItem, index) => {

        return (
          <TimelineItem
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <Dot /> 
            <VaccinationInfo>
              <div>{vaccinationItem.information || ''}</div>
            </VaccinationInfo>

          </TimelineItem>
        );
      })}
    </TimelineContainer>
  );
};

export default VaccinationRoadMap;

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
