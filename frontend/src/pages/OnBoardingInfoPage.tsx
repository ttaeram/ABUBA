import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FullLogoSvgStyled, FormContainer, FormTitle } from '../styles/styledComponents';
import ChildInfoForm from '../components/onboardinginfo/ChildInfoForm';
import ChildAccount from '../components/onboardinginfo/ChildAccountForm'; 
import ParentAccount from '../components/onboardinginfo/ParentAccountForm';

type Props = {};

const OnboardingInfoPage = (props: Props) => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNextStep = (): void => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = (): void => {
    setStep((prevStep) => prevStep - 1);
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
      <FormTitle>{getTitle()}</FormTitle>
      {step === 1 && <ChildInfoForm onNext={handleNextStep} />}
      {step === 2 && <ChildAccount onNext={handleNextStep} onPrevious={handlePreviousStep} />}
      {step === 3 && <ParentAccount onComplete={handleComplete} onPrevious={handlePreviousStep} />}
    </FormContainer>
  );
};

export default OnboardingInfoPage;
