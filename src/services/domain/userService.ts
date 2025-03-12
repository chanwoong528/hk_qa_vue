import type { IUserInfo, IUserUpdateInfo } from "@/types/types";
import { http, ExceptionWrapper } from "../http";
import { UserClass } from "@/entity/User";

export const userApi = {
  GET_users: (getType?: string): Promise<UserClass[]> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.get("/user", {
        params: { getType: getType },
      });
      const data = await apiResult.data;
      return data;
    });
  },
  POST_user: (
    userInfo: Partial<UserClass> & { username: string; email: string }
  ): Promise<UserClass> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.post("/user", userInfo);
      const data = await apiResult.data;
      return data;
    });
  },
  POST_sendVerificationEmail: (email: string) => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.post("/user/send-verification", {
        email: email,
      });
      const data = await apiResult.data;
      return data;
    });
  },
  POST_forgetPw: (email: string): Promise<any> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.post("/user/forgot-password", {
        email: email,
      });
      const data = await apiResult.data;
      return data;
    });
  },

  PATCH_user: (userInfo: IUserUpdateInfo): Promise<UserClass> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.patch(`/user/${userInfo.id}`, userInfo);
      const data = await apiResult.data;
      return data;
    });
  },
};
