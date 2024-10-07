import api from "./index";
import { useAuthStore } from "../stores/authStore";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/v1/auth/login', { email, password });
    
    const accessToken = response.headers["authorization"];
    // const refreshToken = response.headers["x-refresh-token"];


    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      const { email, name, isEmpty} = response.data.data; 

      const setEmailAndName = useAuthStore.getState().setEmailAndName;
      setEmailAndName(email, name);

    } else {
      throw new Error('Access token이 응답에 포함되지 않았습니다.');
    }

    return response.data;
  } catch (error) {
    console.error('로그인에 실패했습니다.', error);
    throw new Error('로그인에 실패했습니다.');
  };
};


export const logout = async () => {
try {
    await api.post('/api/v1/auth/logout');
    localStorage.removeItem('accessToken'); 
} catch (error) {
    throw new Error('로그아웃에 실패했습니다.');
}
};

// 이메일 인증번호 전송
export const requestEmailVerificationCode = async (email: string) => {
  try {
    const response = await api.post(`/api/v1/auth/send-email`, {email});
    return response.data;
  } catch (error) {
    console.error('이메일 인증번호 전송 중 오류가 발생했습니다.', error);
    throw error;
  }
};

// 인증번호 확인
export const verifyEmailCode = async (token: string) => {
  try {
    const response = await api.post('/api/v1/auth/verify-email', {token});
    return response.data;
  } catch (error) {
    console.error('인증번호 확인 중 오류가 발생했습니다.', error);
    throw error;
  }
};

//1원 인증번호 전송
export const sendMoney = async (accountNo: string, bankName: string) => {
  try {
    const response = await api.post('/api/v1/user/1won', {
      accountNo,
      bankName
    });
    return response.data;
  } catch (error) {
    console.error('1원 인증번호 전송 중 오류가 발생했습니다.', error);
    throw error;
  }
};

//1원 인증번호 검증
export const verifyAuthCode = async (authCode: string, authText: string, accountNo: string) => {
  try {
    const response = await api.post('/api/v1/user/authcode', {
      authCode,
      authText,
      accountNo
    });
    
    return response.data;
  } catch (error) {
    console.error('1원 인증번호 확인 중 오류가 발생했습니다.', error);
    throw error;
  }
};

//계좌 정보 제출
export const submitAccountInfo = async (accountInfo: {
  isParent: boolean;
  accountNo: string;
  bankName: string;
}) => {
  try {
    const response = await api.post('/api/v1/user/account', accountInfo);

    return response.data;
  } catch (error) {
      console.error('아이 계좌 연동 중 오류가 발생했습니다.', error);
      throw error;
    }
};