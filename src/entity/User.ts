import { E_Role, E_UserStatus } from "../types/enum";

export type UserType = {
  id: string;
  username: string;
  role: E_Role;
  email: string;
  isPwDefault: boolean;

  userStatus: E_UserStatus;
  createdAt: string;
  updatedAt: string;
};

export class UserClass {
  id: string;
  username: string;
  role: E_Role;
  email: string;
  isPwDefault: boolean;

  userStatus: E_UserStatus;
  createdAt: string;
  updatedAt: string;

  constructor(user: UserType) {
    this.id = user.id;
    this.username = user.username;
    this.role = user.role;
    this.email = user.email;
    this.isPwDefault = user.isPwDefault;
    this.userStatus = user.userStatus;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
