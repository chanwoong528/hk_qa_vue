import { ILogInfo } from "@/types/types";
import { http, ExceptionWrapper } from "../http";

export const logApi = {
  GET_testerStatusUpdateLogByUserId: (userId: string, versionId: string): Promise<ILogInfo[]> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.get(`/log/${versionId}`, { params: { userId: userId } });
      const data = await apiResult.data;
      return data;
    });
  },
};
