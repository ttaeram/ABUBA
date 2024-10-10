import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FullLogoSvgStyled, FormContainer, FormTitle } from '../styles/styledComponents';
import ChildInfoForm from '../components/onboardinginfo/ChildInfoForm';
import ChildAccount from '../components/onboardinginfo/ChildAccountForm'; 
import ParentAccount from '../components/onboardinginfo/ParentAccountForm';

const OnboardingInfoPage = () => {
  const [step, setStep] = useState(1);
  const [fade, setFade] = useState(false);  // 페이드 애니메이션 상태 추가
  const navigate = useNavigate();

  const handleNextStep = (): void => {
    setFade(true);
    setTimeout(() => {
      setStep((prevStep) => prevStep + 1);
      setFade(false);
    }, 300);  // 300ms 후에 컴포넌트 전환
  };

  const handlePreviousStep = (): void => {
    setFade(true);
    setTimeout(() => {
      setStep((prevStep) => prevStep - 1);
      setFade(false);
    }, 300);  // 300ms 후에 컴포넌트 전환
  };

  const handleComplete = (): void => {
    navigate('/');
  };

  const getTitle = () => {
    switch (step) {
      case 1:
        return '아이 정보 입력';
      case 2:
        return '아이 계좌 입력';
      case 3:
        return '부모 계좌 입력';
      default:
        return '';
    }
  };

  return (
    <FormContainer>
      <FullLogoSvgStyled/>
      <FormTitle>{getTitle()}</FormTitle>

      <CenteredFadeWrapper fade={fade}>
        {step === 1 && <ChildInfoForm onNext={handleNextStep} />}
        {step === 2 && <ChildAccount onNext={handleNextStep} onPrevious={handlePreviousStep} />}
        {step === 3 && <ParentAccount onComplete={handleComplete} onPrevious={handlePreviousStep} />}
      </CenteredFadeWrapper>
    </FormContainer>
  );
};

export default OnboardingInfoPage;

// 페이드 애니메이션 정의
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

// CenteredFadeWrapper에 가운데 정렬 적용
const CenteredFadeWrapper = styled.div<{ fade: boolean }>`
  animation: ${({ fade }) => (fade ? fadeOut : fadeIn)} 300ms ease-in-out;
  width: 100%;
  display: flex;
  justify-content: center;  // 수평 가운데 정렬
  align-items: center;      // 수직 가운데 정렬
  flex-direction: column;
`;
