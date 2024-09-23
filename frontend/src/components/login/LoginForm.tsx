import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('모든 필드를 입력해주세요.');
      return;
    }  

    // console.log('로그인 시도:', { username, password });
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputContainer>
        <Input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </InputContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button type="submit">로그인</Button>
      <SubContainer>
        <FindPwd>비밀번호를 잊으셨나요?</FindPwd>
        <Signup>회원가입</Signup>
      </SubContainer>
    </FormContainer>
  );
};


export default LoginForm;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding: 20px;
  border-radius: 8px;
`;

const SubContainer = styled.div`
  display: flex;
  justify-content: space-between;
  color: #3d3d3d;
  font-size: 12px;

`

const FindPwd = styled.div`
`

const Signup = styled.div`
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Input = styled.input`
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 15px;
  background-color: #3B6EBA;
  margin-bottom: 10px;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #173C91;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 15px;
`;

