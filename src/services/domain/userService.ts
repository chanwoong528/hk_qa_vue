import { INetworkException, IUserInfo } from "@/types/types";
import { http, ExceptionWrapper } from "../http";



export const userApi = {

  GET_users: (): Promise<IUserInfo[] | INetworkException> => {
    return ExceptionWrapper(async () => {
      const accToken = localStorage.getItem("accessToken")
      const apiResult = await http.get("/user",
        { headers: { Authorization: `Bearer ${accToken}` } }
      )
      const data = await apiResult.data;
      return data
    })
  },


}