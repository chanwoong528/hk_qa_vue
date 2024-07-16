import type { INetworkException } from "@/types/types";

import { http, ExceptionWrapper } from "../http";


export const testSessionApi = {
  PATCH_testSession: (sessionId: string, status: string): Promise<INetworkException | void> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.patch(`/test-session/${sessionId}`, { status })
      const data = await apiResult.data
      return data
    })
  }
}