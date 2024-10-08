import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../styles/styledComponents';
import { signup } from '../../api/signup';
import { useNavigate } from 'react-router-dom';
import { requestEmailVerificationCode, verifyEmailCode } from '../../api/auth';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [timer, setTimer] = useState(120);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [codeMessage, setCodeMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async () => {
    try {
      setEmailError('');
      setEmailMessage('');
      await requestEmailVerificationCode(email);
      setIsCodeSent(true);
      setEmailMessage('인증번호가 발송되었습니다.');

      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      if (error.message === "이미 사용 중인 이메일입니다.") {
        setEmailError(error.message);
      } else {
        setEmailError('인증번호 발송에 실패했습니다.');
      }
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    try {
      setCodeError('');
      setCodeMessage('');
      const response = await verifyEmailCode(authCode);

      if (response === '이메일 인증 성공!') {
        setIsCodeVerified(true);
        setCodeMessage('인증번호가 확인되었습니다!');
      } else {
        setCodeError('인증번호가 올바르지 않습니다.');
      }
    } catch (error: any) {
      setCodeError('인증번호 확인에 실패했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError('');
    setCodeError('');
    setPasswordError('');


    if (password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!isCodeVerified) {
      setCodeError('인증 코드를 먼저 확인해 주세요.');
      return;
    }

    try {
      await signup(email, name, password); 
      alert('회원가입이 완료되었습니다.');
      navigate('/');
      
    } catch (error: any) {
      setEmailError(error.message || '회원가입에 실패했습니다.');
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
      <FormContainer onSubmit={handleSubmit}>
        <InputContainer>
          <FormGroup>
            <Input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="button" onClick={handleSendCode}>
              인증번호 전송
            </Button>
          </FormGroup>
          {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
          {emailMessage && <SuccessMessage>{emailMessage}</SuccessMessage>}
          <FormGroup>
            <InputWrapper>
            <Input
              type="text"
              placeholder="인증번호"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              required
            />
             {isCodeSent && <Timer>{formatTime(timer)}</Timer>}
             </InputWrapper>
            <Button type="button" onClick={handleVerifyCode}>
              인증번호 확인
            </Button>
          </FormGroup>
          {codeError && <ErrorMessage>{codeError}</ErrorMessage>}
          {codeMessage && <SuccessMessage>{codeMessage}</SuccessMessage>}

          <Input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
           {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
        </InputContainer>

        <SubmitButton type="submit">
            가입하기
        </SubmitButton>
      </FormContainer>

  );
};

export default SignupForm;


const FormContainer = styled.form`
  background: white;
  border-radius: 12px;
  width: 100%;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  box-sizing: border-box;
`;

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  align-items: center; 
  gap: 10px;
  width: 100%;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  padding-right: 15px;
`;

const AuthInput = styled.input`
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  padding-right: 50px;
`;


const Timer = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #ff6b6b;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  color: green;
  font-size: 14px;
`;



const SubmitButton = styled.button`
  width: 100%;
  margin-top: 20px;
  font-size: 15px;
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

`