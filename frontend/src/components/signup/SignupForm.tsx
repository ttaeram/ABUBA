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
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async () => {
    try {
      await requestEmailVerificationCode(email);

      setIsCodeSent(true);
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
      setError(error.message);
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    try {
      const response = await verifyEmailCode(authCode);
      if (response === '이메일 인증 성공!') {
        setIsCodeVerified(true);
        alert('인증번호가 확인되었습니다!');
      } else {
        alert('인증번호가 올바르지 않습니다.');
      }
    } catch (error: any) {
      setError('인증번호 확인에 실패했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // if (!isCodeVerified) {
    //   setError('인증 코드를 먼저 확인해 주세요.');
    //   return;
    // }

    try {
      await signup(email, name, password); 
      alert('회원가입이 완료되었습니다.');
      navigate('/');
      
    } catch (error: any) {

      setError(error.message);
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

          {isCodeSent && <Timer>{formatTime(timer)}</Timer>}

          <FormGroup>
            <Input
              type="text"
              placeholder="인증번호"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value)}
              required
            />
            <Button type="button" onClick={handleVerifyCode}>
              인증번호 확인
            </Button>
          </FormGroup>

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

        </InputContainer>

        {error && <ErrorMessage>{error}</ErrorMessage>}
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
  gap: 10px;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
`;

const Timer = styled.span`
  font-size: 14px;
  color: #ff6b6b;
  text-align: right;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 15px;
`;


const SubmitButton = styled.button`
  width: 100%;
  align-items: center;
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