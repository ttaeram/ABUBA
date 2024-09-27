import api from ".";


export const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/v1/auth/login', { email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      return response.data;
    } catch (error) {
      throw new Error('로그인에 실패했습니다.');
    }
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
export const requestEmailVerificationCode = async (
  email: string,
  type: 'password_change' | 'signup') => {
  try {
    const response = await api.get(`/v1/auth/email/code/${email}`, {
      params: {
        type: type,
      },
    });
    return response.data;
  } catch (error) {
    console.error('이메일 인증번호 전송 중 오류가 발생했습니다.', error);
    throw error;
  }
};

// 인증번호 확인
export const verifyEmailCode = async (email: string, authCode: string, type: string) => {
  try {
    const response = await api.post('/v1/auth/email/code', { email, authCode, type });
    return response.data;
  } catch (error) {
    console.error('인증번호 확인 중 오류가 발생했습니다.', error);
    throw error;
  }
};