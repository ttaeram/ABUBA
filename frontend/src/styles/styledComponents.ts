// 공통 Styled Components

import styled from 'styled-components';
import { ReactComponent as LogoSvg } from '../assets/images/onlylogo.svg';
import { ReactComponent as FullLogoSvg } from '../assets/images/fulllogo.svg';

export const LogoSvgStyled = styled(LogoSvg)`
  width: 100px; 
  height: auto;  
`;

export const FullLogoSvgStyled = styled(FullLogoSvg)`
  width: 120px; 
  height: auto;  
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; 
`;

export const FormTitle = styled.h2`
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;


export const Button = styled.button`
  display: flex;
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