import type { IComment } from "@/types/types";
import { http, ExceptionWrapper } from "../http";

export const commentApi = {
  GET_commentsBySwVersionId: (swVersionId: string, page?: number): Promise<IComment[]> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.get(`/comment/${swVersionId}`, { params: { page } });
      const data = await apiResult.data;
      return data;
    });
  },
  GET_commentsByBoardId: (boardId: string, page?: number): Promise<IComment[]> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.get(`/comment/board/${boardId}`, { params: { page } });
      const data = await apiResult.data;
      return data;
    });
  },
  POST_comment: (
    comment: Partial<IComment> & {
      content: string;
      userId: string;
      swVersionId?: string;
      boardId?: string;
      parentId?: string;
    },
  ): Promise<IComment> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.post("/comment", comment);
      const data = await apiResult.data;
      return data;
    });
  },

  PATCH_comment: (comment: Partial<IComment>): Promise<IComment> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.patch(`/comment/edit/${comment.commentId}`, { content: comment.content });
      const data = await apiResult.data;
      return data;
    });
  },

  DELETE_comment: (commentId: string): Promise<void> => {
    return ExceptionWrapper(async () => {
      await http.delete(`/comment/${commentId}`);
    });
  },
};
