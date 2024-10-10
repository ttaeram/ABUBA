import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {login} from '../../api/auth'
import { getBabyInfo } from '../../api/user';
import { useChildAuthStore } from '../../stores/authStore';
import { connect } from '../../api/sse'; // SSE 연결 함수 가져오기

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]); // 알림 상태 추가
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('모든 정보를 입력해주세요.');
      return;
    }
    
    try {
      const userData = await login(email, password);
      const {isEmpty} = userData.data;
      if (isEmpty == false) {
        navigate('/onboard');  //true면 온보딩 페이지로 이동
      } else {

        const babyInfoData = await getBabyInfo();
        const { name, relation, height, weight, birthday, gender } = babyInfoData.data;

        const setBabyInfo = useChildAuthStore.getState().setChildInfo;
        setBabyInfo(name, relation, height, weight, birthday, gender);
        
        //TODO구독설정
        connect(setNotifications); // setNotifications를 인자로 전달
        navigate('/main');  //false면 메인 페이지로 이동
        
      }


    } catch (err) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
    }

  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  // const handleFindPwdClick = () => {
  //   navigate('/find-password');
  // };


  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputContainer>
        <Input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        {/* <FindPwd>비밀번호를 잊으셨나요?</FindPwd> */}
        <Signup onClick={handleSignupClick}>아직 회원이 아니신가요?</Signup>
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
  justify-content: center;
  color: #3d3d3d;
  font-size: 12px;

`

const FindPwd = styled.div`
`

const Signup = styled.div`
  margin-top: 10px;
  font-size: 14px;
  cursor: pointer;
  color: black;
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
  font-weight: 700;
  margin-bottom: 10px;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #3B6EBA;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  font-size: 14px;
  justify-content: center;
  align-items: center;
  color: #fd0000;
  margin-bottom: 15px;
`;

