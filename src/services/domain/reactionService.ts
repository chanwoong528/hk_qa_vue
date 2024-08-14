
import { http, ExceptionWrapper } from "../http";
import { E_ReactionParentType, E_ReactionType } from "@/types/enum.d";



export const reactionApi = {
  POST_reaction: (
    parentType: E_ReactionParentType,
    reactionType: E_ReactionType,
    parentId: string,
  ): Promise<any> => {

    return ExceptionWrapper(async () => {
      const apiResult = await http.post("/reaction", {
        parentType,
        reactionType,
        ...(parentType === E_ReactionParentType.comment
          ? { parentCommentId: parentId }
          : { parentTestUnitId: parentId }
        )
      });
      const data = await apiResult.data;
      return data;
    });
  },
}