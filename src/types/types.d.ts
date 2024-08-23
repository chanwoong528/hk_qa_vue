import { E_ReactionParentType, E_ReactionType, E_TestStatus } from "./enum";

export interface ILoginInfo {
  email: string;
  pw: string;
}

export interface ILogInfo {
  id: string;
  logType: string;
  content: any;
  createdAt: string;
}

export interface IUserInfo {
  id: string;
  username: string;
  role: E_Role;
  email: string;
  userStatus: E_UserStatus;
  isPwDefault?: boolean;
  createdAt?: string;
  access_token?: string;
  refresh_token?: string;
}

export interface IUserUpdateInfo
  extends Partial<Omit<IUserInfo, "access_token" | "refresh_token">> {
  id: string;
  pw?: string;
}

export interface ISwType {
  swTypeId: string;
  typeTitle: string;
  typeDesc: string;
  showStatus: string;
  createdAt: string;
  updatedAt: string;
  user: IUserInfo;
}

export interface ISwVersion {
  swVersionId: string;
  versionTitle: string;
  versionDesc: string;
  fileSrc: string;
  tag: string;
  createdAt: string;
  dueDate?: string;

  user: IUserInfo;
  swType: ISwType;
  testSessions: ITestSession[];
  testUnits: ITestUnit[];
}

export interface ITestUnit {
  testUnitId: string;
  unitDesc: string;
  createdAt: string;
  updatedAt: string;

  user: IUserInfo;
  swVersion: ISwVersion;
  reactions: IReaction[];
  counts?: {
    [key in E_ReactionType]: number;
  };
}

export interface IReaction {
  id: string;
  parentType: E_ReactionParentType;
  reactionType: E_ReactionType;

  createdAt: string;
  updatedAt: string;

  user: IUserInfo;

  parentComment?: IComment;
  parentTestUnit?: ITestUnit;
}

export interface ITestSession {
  sessionId: string;
  status: E_TestStatus;
  createdAt: string;
  updatedAt: string;
  finishedAt?: string;
  reasonContent?: string;
  user: IUserInfo;
  swVersion: ISwVersion;
}

export interface INetworkException {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
}

export interface INetworkSuccess {
  code: number;
  message: string;
}

export interface IComment {
  commentId: string;
  content: string;
  createdAt: string;
  updatedAt: string;

  user: IUserInfo;
  swVersion: ISwVersion;
  childComments: IComment[];
  reactions: IReaction[];
  counts?: {
    [key in E_ReactionType]: number;
  };
}
