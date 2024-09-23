import React, { Component } from 'react'

import styled from 'styled-components';
import { FullLogoSvgStyled, FormContainer, FormTitle } from '../styles/styledComponents'
import SignupForm from '../components/signup/SignupForm';

const SignupPage = () => {
return (
    <FormContainer>
        <FullLogoSvgStyled/>
        <FormTitle>회원가입</FormTitle>
        <SignupForm />
    </FormContainer>
    );

};

export default SignupPage