import { UserClass } from "@/entity/User";
import { ExceptionWrapper, http } from "../http";

export const maintainerApi = {
  GET_maintainerListBySwTypeId: async (swTypeId: string): Promise<{ user: UserClass[] }> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.get(`/sw-maintainer/${swTypeId}`);
      const data = await apiResult.data;
      return data;
    });
  },

  PUT_deleteOrAddMaintainer: async (
    swTypeId: string,
    tobeDeletedArr: string[],
    tobeAddedArr: string[]
  ) => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.put(`/sw-maintainer/${swTypeId}`, {
        ...(tobeDeletedArr.length > 0 && { tobeDeletedArr }),
        ...(tobeAddedArr.length > 0 && { tobeAddedArr }),
      });
      const data = await apiResult.data;
      return data;
    });
  },
};
