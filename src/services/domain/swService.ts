
import type { INetworkException, ISwType } from "@/types/types"
import { http, ExceptionWrapper } from "../http"

export const swApi = {
  GET_sw: (): Promise<ISwType[] | INetworkException> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.get("/sw-type")

      const data = await apiResult.data
      return data
    })
  },
}