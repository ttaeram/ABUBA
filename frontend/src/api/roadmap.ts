import api from ".";

// 성장 발달 정보
export const averagedata = async () => {
    try {
      const response = await api.get('/api/v1/roadmap/averageInfo');
      return response.data;
    } catch (error) {
      console.error('예방접종 데이터를 불러오는데 실패했습니다.', error);
      throw error;
    }
  };
  
// 정부 지원 정보
export const supportdata = async () => {
try {
    const response = await api.get('/api/v1/roadmap/supportInfo');
    return response.data;
} catch (error) {
    console.error('성장 데이터를 불러오는데 실패했습니다.', error);
    throw error;
}
};

// 의료 정보
export const healthdata = async () => {
try {
    const response = await api.get('/api/v1/roadmap/healthInfo');
    return response.data;
} catch (error) {
    console.error('성장 데이터를 불러오는데 실패했습니다.', error);
    throw error;
}
};