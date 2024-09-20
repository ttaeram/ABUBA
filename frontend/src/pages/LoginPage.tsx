import React from 'react';
import LoginForm from '../components/login/LoginForm';
import styled from 'styled-components';
import { FullLogoSvgStyled, FormContainer, FormTitle } from '../styles/styledComponents'

const LoginPage = () => {
  return (
    <FormContainer>
        <FullLogoSvgStyled/>
        <FormTitle>로그인</FormTitle>
        <LoginForm />
    </FormContainer>
  );
};

export default LoginPage;
