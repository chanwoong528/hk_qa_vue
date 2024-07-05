
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

      localStorage.setItem("accessToken", data.access_token)
      return data;
    })
  },
  GET_loginCheck: (): Promise<IUserInfo | INetworkException> => {
    return ExceptionWrapper(async () => {
      const accToken = localStorage.getItem("accessToken")
      const apiResult = await http.get("/auth", { headers: { Authorization: `Bearer ${accToken}` } })
      const data = await apiResult.data
      return data;
    })
  }
}
