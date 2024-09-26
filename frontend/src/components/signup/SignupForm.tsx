import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../styles/styledComponents';
import { sendAuthCode,signup } from '../../api/signup';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async () => {
    try {
      await sendAuthCode(email);
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

  const handleVerifyCode = () => {
    if (authCode === '123456') {
      setIsCodeVerified(true);
      alert('인증번호가 확인되었습니다!');
    } else {
      alert('인증번호가 올바르지 않습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!isCodeVerified) {
      setError('인증 코드를 먼저 확인해 주세요.');
      return;
    }

    try {
      await signup(email, name, password); 
      alert('회원가입 성공!');
      navigate('/main');
      
    } catch (error: any) {
      setError(error.message);
    }
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

          {isCodeSent && <Timer>{timer}초</Timer>}

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
  width: 400px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
`;

const Timer = styled.span`
  font-size: 14px;
  color: #ff6b6b;
  margin-bottom: 10px;
  text-align: right;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-bottom: 15px;
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