export const config = {
  runtime: 'experimental-edge',
};

import { jsonClientWithAccessToken } from 'src/lib/apiClients';
import { Stm, StmCreate, StmCreateWithToken, StmUpdate, StmUpdateWithToken, StmDelete, StmDeleteWithToken } from 'src/interfaces/stm';
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

export const stmDeleteMultiple = async (data: Stm[], username: string): Promise<Stm[]> => {
  const apiClient = jsonClientWithAccessToken();
  const deletePromises = data.map(item =>
    apiClient.delete(`/stm/${item.id}`, {
      data: {
        client_request_token: generateToken(username),
        version: item.version, // versionもエンドポイントに渡す
      }
    })
  );
  try {
    const responses = await Promise.all(deletePromises);
    return responses.map(response => response.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default {
  stmList,
  stmDetail,
  stmCreate,
  stmUpdate,
  stmDeleteMultiple,
}
