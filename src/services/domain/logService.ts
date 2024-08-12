import { ILogInfo } from "@/types/types";
import { http, ExceptionWrapper } from "../http";

export const logApi = {
  GET_testerStatusUpdateLogByUserId: (userId: string): Promise<ILogInfo[]> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.get(`/log/${userId}`);
      const data = await apiResult.data;
      return data;
    });
  },
};
