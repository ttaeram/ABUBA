import api from './index'

export const postBabyInfo = async (data: {
    name: string;
    relation: string;
    height: number;
    weight: number;
    birthday: string;
    gender: string;
  }) => {
    const response = await api.post('/api/v1/user/babyInfo', data);
    return response.data;
  };

export const getBabyInfo = async () => {
  try {
    const response = await api.get('/api/v1/user/baby');
    return response.data;
  } catch (error) {
    console.error('아이 정보를 가져오는 데 실패했습니다.', error);
    throw new Error('아이 정보를 가져오는 데 실패했습니다.');
  }
};

