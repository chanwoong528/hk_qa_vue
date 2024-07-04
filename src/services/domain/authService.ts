
import { http, ExceptionWrapper } from "../http"

import type { ILoginInfo, IUserInfo, INetworkException } from "@/types/types";




export const authApi = {
  POST_login: (loginInfo: ILoginInfo): Promise<IUserInfo | INetworkException> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.post("/auth", {
        email: loginInfo.email,
        pw: loginInfo.pw
      })
      const data = await apiResult.data
      return data;
    })
  }
}
