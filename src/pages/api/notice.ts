import { jsonClientWithAccessToken, formClientWithAccessToken } from 'src/lib/apiClients';

export const noticeList = async () => {
  const apiClient = jsonClientWithAccessToken();
  try {
    const response = await apiClient.get('/notice/');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
