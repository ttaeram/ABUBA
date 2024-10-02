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