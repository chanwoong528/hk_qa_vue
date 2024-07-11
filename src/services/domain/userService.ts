import type { INetworkException, IUserInfo, IUserUpdateInfo } from "@/types/types";
import { http, ExceptionWrapper } from "../http";



export const userApi = {

  GET_users: (): Promise<IUserInfo[] | INetworkException> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.get("/user")
      const data = await apiResult.data;
      return data
    })
  },
  PATCH_user: (userInfo: IUserUpdateInfo): Promise<IUserInfo | INetworkException> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.patch(`/user/${userInfo.id}`, userInfo)
      const data = await apiResult.data;
      return data;
    })

  }


}