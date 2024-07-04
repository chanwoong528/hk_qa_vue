export interface ILoginInfo {
  email: string;
  pw: string;
}

export interface IUserInfo {
  id: string;
  username: string;
  role: E_Role
  email: string;
  access_token?: string;
  refresh_token?: string;
}

export interface INetworkException {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
}