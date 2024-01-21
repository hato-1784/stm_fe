import { jsonClientWithoutToken } from 'src/lib/apiClients';
import { generateToken } from "src/utils/generateToken";

export async function signUp(username: string, email: string, password: string) {
  const apiClient = jsonClientWithoutToken();
  try {
    const client_request_token = generateToken(username);
    const response = await apiClient.post('/sign_up/', {
      username,
      email,
      password,
      client_request_token
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}