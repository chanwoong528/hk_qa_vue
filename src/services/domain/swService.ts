
import type { INetworkException, ISwType, ISwVersion } from "@/types/types"
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


export const swVersionApi = {
  GET_swVersionsBySwTypeId: (swTypeId: string): Promise<ISwVersion[] | INetworkException> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.get(`/sw-version/${swTypeId}`)
      console.log(apiResult)
      const data = await apiResult.data;
      return data;
    })
  }
}
