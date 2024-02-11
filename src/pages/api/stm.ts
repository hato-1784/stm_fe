export const config = {
  runtime: 'experimental-edge',
};

import { jsonClientWithAccessToken } from 'src/lib/apiClients';
import { Stm, StmCreate, StmCreateWithToken, StmUpdate, StmUpdateWithToken } from 'src/interfaces/stm';
import { generateToken } from "src/utils/generateToken";

export const stmList = async () => {
  const apiClient = jsonClientWithAccessToken();
  try {
    const response = await apiClient.get('/stm/');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const stmDetail = async (id: string): Promise<Stm> => {
  const apiClient = jsonClientWithAccessToken();
  try {
    const response = await apiClient.get(`/stm/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const stmCreate = async (username: string, data: StmCreate): Promise<Stm> => {
  const apiClient = jsonClientWithAccessToken();
  const dataWithTOken: StmCreateWithToken = {
    ...data,
    client_request_token: generateToken(username),
  }
  try {
    const response = await apiClient.post('/stm/', dataWithTOken);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const stmUpdate = async (stm_id: string, username: string, data: StmUpdate): Promise<Stm> => {
  const apiClient = jsonClientWithAccessToken();
  const dataWithTOken: StmUpdateWithToken = {
    ...data,
    client_request_token: generateToken(username),
  }
  try {
    const response = await apiClient.put(`/stm/${stm_id}`, dataWithTOken);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}