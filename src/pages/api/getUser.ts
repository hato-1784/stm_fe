import { jsonClientWithAccessToken } from 'src/lib/apiClients';

export const getUser = async () => {
  const apiClient = jsonClientWithAccessToken();
  try {
    const response = await apiClient.get('/user/');
    return { data: response.data, error: false };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return { data: null, error: true, message: error.message };
    }
    return { data: null, error: true, message: 'An unknown error occurred' };
  }
};
