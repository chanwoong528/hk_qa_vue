
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
  POST_sw: ({ typeTitle, typeDesc }: { typeTitle: string, typeDesc: string }): Promise<ISwType> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.post("/sw-type", { typeTitle, typeDesc })
      const data = await apiResult.data
      return data
    })
  }
}


export const swVersionApi = {
  GET_swVersionsBySwTypeId: (swTypeId: string): Promise<ISwVersion[]> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.get(`/sw-version/${swTypeId}`)
      const data = await apiResult.data;
      return data;
    })
  },
  POST_swVersion: (swVersion: Partial<Omit<ISwVersion, 'fileSrc'>> & {
    swTypeId: string,
    versionTitle: string,
    versionDesc: string,
    tag: string,
    file?: File
  }): Promise<ISwVersion> => {
    return ExceptionWrapper(async () => {
      const formData = new FormData()
      formData.append('swTypeId', swVersion.swTypeId)
      formData.append('versionTitle', swVersion.versionTitle)
      formData.append('versionDesc', swVersion.versionDesc)
      formData.append('tag', swVersion.tag)
      if (!!swVersion.file) {
        formData.append('file', swVersion.file)
      }
      const apiResult = await http.post("/sw-version", formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      const data = await apiResult.data
      return data
    })
  },

  PATCH_swVersion: (swVersion: Partial<Omit<ISwVersion, 'fileSrc'>> & {
    swVersionId: string,
    versionTitle: string,
    versionDesc: string,
    tag: string,
    file?: File
  }): Promise<void> => {
    return ExceptionWrapper(async () => {
      const formData = new FormData()
      formData.append('swVersionId', swVersion.swVersionId)
      formData.append('versionTitle', swVersion.versionTitle)
      formData.append('versionDesc', swVersion.versionDesc)
      formData.append('tag', swVersion.tag)
      if (!!swVersion.file) {
        formData.append('file', swVersion.file)
      }

      const apiResult = await http.post(`/sw-version/edit/${swVersion.swVersionId}`, formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      const data = await apiResult.data
      return data
    })

  }

}
