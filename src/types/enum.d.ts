export enum E_Role {
  tester = "tester",
  admin = "admin",
  master = "master",
}

export enum E_BoardType {
  req = "req",
  update = "update",
}

export enum E_UserStatus {
  ok = "ok",
  pending = "pending",
  blocked = "blocked",
}

export enum E_TestStatus {
  pending = "pending",
  passed = "passed",
  failed = "failed",
}

export enum E_SwVersionModalType {
  updateStatus = "updateStatus",
  addTester = "addTester",
  detailView = "detailView",
  testerLog = "testerLog",
}

export enum E_UserListType {
  checkbox = "checkbox",
}
export enum E_SwTypeListType {
  section = "section",
  // page = "page",
}

export enum E_ModalType {
  full = "full",
  status = "status",
}

export enum E_EditorType {
  comment = "comment",
}
export enum E_ReactionType {
  check = "check",
  stop = "stop",

  like = "like",
  dislike = "dislike",
  love = "love",
  sad = "sad",
  wow = "wow",
}
export enum E_ReactionParentType {
  comment = "comment",
  testUnit = "testUnit",
}
