
import type { ISwType, ISwVersion } from "@/types/types"
import { http, ExceptionWrapper } from "../http"

export const swApi = {
  GET_sw: (): Promise<ISwType[]> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.get("/sw-type")

      const data = await apiResult.data
      return data
    })
  },
}


export const swVersionApi = {
  GET_swVersionsBySwTypeId: (swTypeId: string): Promise<ISwVersion[]> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.get(`/sw-version/${swTypeId}`)
      const data = await apiResult.data;
      return data;
    })
  }
}
