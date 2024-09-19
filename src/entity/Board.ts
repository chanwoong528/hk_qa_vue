import { IUserInfo } from "@/types/types";
import { formatDateTime } from "@/utils/common/formatter";

export default class BoardClass {
  public title = "";
  public content = "";
  public boardType = "요청";
  public createdAt = "";
  public boardId = "";
  public user: IUserInfo = {
    id: "",
    username: "",
    role: undefined,
    email: "",
    userStatus: undefined,
  };

  constructor(partial?: Partial<BoardClass>) {
    if (!!partial) Object.assign(this, partial);
  }

  convertBoardTypeKor() {
    switch (this.boardType) {
      case "req":
        return "요청";
      case "update":
        return "업데이트";

      default:
        return "요청";
    }
  }

  formatDate() {
    if (!this.createdAt) return "";

    return formatDateTime(this.createdAt);
  }
}
