import api from "./index";

export const sentimentCalendar = async (year: number, month: number) => {
  try {
    const response = await api.get(`/api/v1/diary/calendar`, {
      params: { year, month },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching diary calendar data:", error);
    throw error;
  }
};

export const getPhysical = async () => {
  try {
    const response = await api.get('/api/v1/diary/height');
    return response.data;``
  } catch (error) {
    console.error('아이 신체 정보를 가져오는 데 실패했습니다.', error);
    throw new Error('아이 신체 정보를 가져오는 데 실패했습니다.');
  }
};
