import api from "./index";

export const signup = async (email:string, name:string, password:string) => {
    try {
      const response = await api.post('/api/v1/auth/signup', {
        email,
        name,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error('회원가입에 실패했습니다.');
    }
  };