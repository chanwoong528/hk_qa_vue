
import { http, ExceptionWrapper } from "../http";

export const testSessionApi = {
  PATCH_testSession: (sessionId: string, status: string): Promise<void> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.patch(`/test-session/${sessionId}`, { status })
      const data = await apiResult.data
      return data
    })
  },
  POST_testSession: (userId: string, swVersionId: string): Promise<void> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.post(`/test-session`, { userId, swVersionId: swVersionId })
      const data = await apiResult.data
      return data
    })
  },
  POST_AllTestSession: async (targetArr: { userId: string, swVersionId: string }[]) => {
    const promises = targetArr
      .map(target => testSessionApi.POST_testSession(target.userId, target.swVersionId))

    const result = await Promise.all(promises)
    return result;
  },
  PUT_deleteOrAddTestSession: async (versionId: string, tobeDeletedArr: string[], tobeAddedArr: string[]) => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.put(`/test-session/${versionId}`, {
        ...(tobeDeletedArr.length > 0 && { tobeDeletedArr }),
        ...(tobeAddedArr.length > 0 && { tobeAddedArr }),
      })
      const data = await apiResult.data
      return data
    })

  }
}
