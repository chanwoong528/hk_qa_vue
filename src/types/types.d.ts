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

export interface IUserUpdateInfo extends Partial<Omit<IUserInfo, 'access_token' | 'refresh_token'>> {
  id: string;
}


export interface ISwType {
  swTypeId: string;
  typeTitle: string;
  typeDesc: string;
  showStatus: string;
  createdAt: string;
  updatedAt: string;
  user: IUserInfo
}



export interface INetworkException {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
}



