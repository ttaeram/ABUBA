import api from ".";


export const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/v1/auth/login', { email, password });
      localStorage.setItem('accessToken', response.data.accessToken); // Access Token 저장
      return response.data;
    } catch (error) {
      throw new Error('로그인에 실패했습니다.');
    }
  };

export const logout = async () => {
try {
    await api.post('/api/v1/auth/logout');
    localStorage.removeItem('accessToken'); // Access Token 삭제
} catch (error) {
    throw new Error('로그아웃에 실패했습니다.');
}
};