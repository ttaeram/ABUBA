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
