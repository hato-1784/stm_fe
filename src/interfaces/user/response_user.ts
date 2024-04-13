export interface User {
  username: string;
  email: string;
  version: number;
  client_request_token?: string | null;
}
