import type { INetworkException, IUserInfo, IUserUpdateInfo } from "@/types/types";
import { http, ExceptionWrapper } from "../http";




export const userApi = {

  GET_users: (getType?: string): Promise<IUserInfo[]> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.get("/user", { params: { getType: getType } })
      const data = await apiResult.data;
      return data
    })
  },
  POST_user: (userInfo: (Partial<IUserInfo> & { username: string; email: string })): Promise<IUserInfo> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.post("/user", userInfo)
      const data = await apiResult.data;
      return data;
    })
  },

  PATCH_user: (userInfo: IUserUpdateInfo): Promise<IUserInfo> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.patch(`/user/${userInfo.id}`, userInfo)
      const data = await apiResult.data;
      return data;
    })

  }


}