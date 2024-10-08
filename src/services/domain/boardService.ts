import { ExceptionWrapper, http } from "../http";

export const boardApi = {
  POST_newBoard: (boardInfo: any & { swTypeId: string }): Promise<any> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.post("/board", {
        title: boardInfo.title,
        content: boardInfo.content,
        boardType: boardInfo.boardType,
        swTypeId: boardInfo.swTypeId,
      });
      const data = await apiResult.data;
      return data;
    });
  },
  GET_boardList: (swTypeId: string, boardType: "req" | "update", page: number = 1): Promise<any> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.get(`/board/${swTypeId}`, {
        params: {
          boardType,
          page,
        },
      });
      const data = await apiResult.data;
      return data;
    });
  },
  GET_boardDetail: (boardId: string): Promise<any> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.get(`/board/detail/${boardId}`);
      const data = await apiResult.data;
      return data;
    });
  },
  PATCH_board: (boardInfo: any & { boardId: string; userId: string }): Promise<any> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.patch(`/board/${boardInfo.boardId}`, {
        title: boardInfo.title,
        content: boardInfo.content,
        userId: boardInfo.userId,
      });
      const data = await apiResult.data;
      return data;
    });
  },
};
