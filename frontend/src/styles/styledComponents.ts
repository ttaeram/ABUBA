// 공통 Styled Components

import styled from 'styled-components';
import { ReactComponent as LogoSvg } from '../assets/images/onlylogo.svg';
import { ReactComponent as FullLogoSvg } from '../assets/images/fulllogo.svg';
import { ReactComponent as WhiteFullSvg} from '../assets/images/whitefulllogo.svg'
import { motion } from 'framer-motion';

export const LogoSvgStyled = styled(LogoSvg)`
  width: 100px; 
  height: auto;  
`;

export const FullLogoSvgStyled = styled(FullLogoSvg)`
  width: 120px;
  height: auto;  
`;

export const WhiteFullLogoSvgStyled = styled(WhiteFullSvg)`
  width: 120px;
  height: auto;  
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  background-color: #FFFFFF;
`;

export const FormTitle = styled.h2`
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;


export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  padding: 15px;
  background-color: #3B6EBA;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background-color: #173C91;
  }
`;


//로드맵
export const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 40px 0;
`;

export const Line = styled.div`
  position: absolute;
  width: 4px;
  background: #173C91;
  height: 100%;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 0;
`;

interface TimelineItemProps {
  isLeft: boolean;
}

export const TimelineItem = styled(motion.div)<TimelineItemProps>`
  display: flex;
  justify-content: ${({ isLeft }) => (isLeft ? 'flex-end' : 'flex-start')};
  align-items: center;
  width: 100%;
  position: relative;
  margin: 20px 0;
  padding: 10px;
  text-align: ${({ isLeft }) => (isLeft ? 'right' : 'left')};
`;

export const Dot = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: #3B6EBA;
  border-radius: 50%;
  z-index: 1;
`;


interface InfoProps {
  isLeft: boolean;
}

export const Info = styled.div<InfoProps>`
  display: flex;
  justify-content: ${({ isLeft }) => (isLeft ? 'flex-end' : 'flex-start')};
  padding: 10px;
  z-index: 1;
  width: 45%;
  color: #000000;
  text-align: ${({ isLeft }) => (isLeft ? 'right' : 'left')};
  position: relative;
  left: ${({ isLeft }) => (isLeft ? '-55%' : '55%')}; 
`;
