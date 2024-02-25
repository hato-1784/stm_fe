export const config = {
  runtime: 'experimental-edge',
};

import { formClientWithoutToken } from 'src/lib/apiClients';

export async function signIn(username: string, password: string) {
  const apiClient = formClientWithoutToken();
  try {
    const response = await apiClient.post('/sign_in/', {
      username,
      password
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default signIn;