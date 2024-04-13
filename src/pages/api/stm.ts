export const config = {
  runtime: 'experimental-edge',
};

import { jsonClientWithAccessToken, formClientWithAccessToken } from 'src/lib/apiClients';
import { Stm, StmCreate, StmCreateWithToken, StmUpdate, StmUpdateWithToken, StmDelete, StmDeleteWithToken } from 'src/interfaces/stm/response_stm';
import { generateToken } from "src/utils/generateToken";
import FormData from 'form-data';

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
  const items = data.map(item => ({
    id: item.id,
    client_request_token: generateToken(username),
    version: item.version,
  }));

  try {
    const response = await apiClient.delete('/stm/', {
      data: { items }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const stmUpload = async (file: File, username: string): Promise<any> => {
  const apiClient = formClientWithAccessToken();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('client_request_token', generateToken(username));
  try {
    const response = await apiClient.post('/stm/upload', formData);
    return response.data;
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
  stmUpload,
}
