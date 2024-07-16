import { E_TestStatus } from "./enum";

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

export interface ISwVersion {
  swVersionId: string;
  versionTitle: string;
  versionDesc: string;
  fileSrc: string;
  tag: string;
  createdAt: string;

  user: IUserInfo;
  swType: ISwType;
  testSessions: ITestSession[];
}

export interface ITestSession {
  sessionId: string
  status: E_TestStatus
  createdAt: string
  updatedAt: string
  finishedAt?: string
  user: IUserInfo
}


export interface INetworkException {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
}



