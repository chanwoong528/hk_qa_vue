import type { E_TestStatus } from "../types/enum";
import { SwVersionClass } from "./SwVersion";
import { UserClass } from "./User";

type TestSessionType = {
  sessionId: string;
  status: E_TestStatus;
  createdAt: string;
  updatedAt: string;
  finishedAt?: string;
  reasonContent?: string;
  //   user: UserClass;
  //   swVersion: SwVersionClass;
};

export class TestSessionClass {
  sessionId: string;
  status: E_TestStatus;
  createdAt: string;
  updatedAt: string;
  finishedAt?: string;
  reasonContent?: string;

  user: UserClass;
  swVersion: SwVersionClass;

  constructor(
    testSession: TestSessionType,
    user: UserClass,
    swVersion: SwVersionClass
  ) {
    this.sessionId = testSession.sessionId;
    this.status = testSession.status;
    this.createdAt = testSession.createdAt;
    this.updatedAt = testSession.updatedAt;
    this.finishedAt = testSession.finishedAt;
    this.reasonContent = testSession.reasonContent;

    this.user = user;
    this.swVersion = swVersion;
  }
}
