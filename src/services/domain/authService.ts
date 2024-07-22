
import { http, ExceptionWrapper } from "../http"

import type { ILoginInfo, IUserInfo } from "@/types/types";




export const authApi = {
  POST_login: (loginInfo: ILoginInfo): Promise<IUserInfo> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.post("/auth", {
        email: loginInfo.email,
        pw: loginInfo.pw
      })
      const data = await apiResult.data
      localStorage.setItem("accessToken", data.access_token)

      return data;
    })
  },
  GET_loginCheck: (): Promise<IUserInfo> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.get("/auth")
      const data = await apiResult.data

      return data;
    })
  }
}
