import { jsonClientWithAccessToken } from 'src/lib/apiClients';

export const stmList = async () => {
  const apiClient = jsonClientWithAccessToken();
  try {
    const response = await apiClient.get('/stm/');
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}