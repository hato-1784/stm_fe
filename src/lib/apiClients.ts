import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

// 共通のaxiosインスタンス設定
const commonAxiosConfig = {
  baseURL: "http://localhost:8000",
  withCredentials: true,
  timeout: 3000,
};

// レスポンスインターセプターを設定する関数
function applyResponseInterceptors(client: AxiosInstance) {
  client.interceptors.response.use(async (response) => {
    // 成功レスポンスの場合、data.status_codeが401か確認
    if (response.data.status === 401) {
      // access_tokenが切れている場合、refresh_tokenを取得
      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        console.log("refreshToken");
        // refresh_tokenを使用してaccess_tokenを更新
        const client = axios.create({
          ...commonAxiosConfig,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`
          }
        });
        const refreshResponse = await client.get('/token/refresh_access_token');
        if (refreshResponse.status === 200) {
          // 新しいaccess_tokenを保存
          Cookies.set('access_token', refreshResponse.data.access_token);
          // オリジナルのリクエストを新しいaccess_tokenで再試行
          response.config.headers['Authorization'] = `Bearer ${refreshResponse.data.access_token}`;
          return client(response.config);
        }
      }
    }
    return response;
  }, async (error) => {
    // その他のエラーケースはそのまま返す
    return Promise.reject(error);
  });
}

// リクエストインターセプターを設定する関数
function applyRequestInterceptors(client: AxiosInstance) {
  client.interceptors.request.use((config) => {
    // useAccessTokenが明示的にtrueの場合にaccess_tokenを使用
    if (config.headers['useAccessToken']) {
      const accessToken = Cookies.get('access_token');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }
    // カスタムヘッダーを削除
    delete config.headers.useAccessToken;
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
}

function applyInterceptors(client: AxiosInstance) {
  // リクエストインターセプター
  applyRequestInterceptors(client);
  // レスポンスインターセプター
  applyResponseInterceptors(client);
}

// access_tokenを使用するJSONクライアント
export function jsonClientWithAccessToken() {
  const client = axios.create({
    ...commonAxiosConfig,
    headers: {
      'Content-Type': 'application/json',
      'useAccessToken': 'true'
    }
  });
  applyInterceptors(client);
  return client;
}

// トークンを使用しないJSONクライアント
export function jsonClientWithoutToken() {
  const client = axios.create({
    ...commonAxiosConfig,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  applyInterceptors(client);
  return client;
}

// access_tokenを使用するFormクライアント
export function formClientWithAccessToken() {
  const client = axios.create({
    ...commonAxiosConfig,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'useAccessToken': 'true'
    }
  });
  applyInterceptors(client);
  return client;
}

// トークンを使用しないFormクライアント
export function formClientWithoutToken() {
  const client = axios.create({
    ...commonAxiosConfig,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  applyInterceptors(client);
  return client;
}
