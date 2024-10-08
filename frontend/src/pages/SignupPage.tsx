import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';
import { FullLogoSvgStyled, FormContainer, FormTitle } from '../styles/styledComponents'
import SignupForm from '../components/signup/SignupForm';

const SignupPage = () => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    };

return (
    <FormContainer>
        <FullLogoSvgStyled onClick={handleLogoClick} />
        <FormTitle>회원가입</FormTitle>
        <SignupForm />
    </FormContainer>
    );

};

export default SignupPage