import { SwTypeClass } from "./SwType";

type SwVersionType = {
  swVersionId: string;
  versionTitle: string;
  versionDesc: string;
  fileSrc?: string;
  tag: string;
  createdAt: string;
  dueDate?: string;
};

type TestUnitType = {
  testUnitId: string;
  unitDesc: string;
  createdAt: string;
  updatedAt: string;
};

export class TestUnitClass {
  testUnitId: string;
  unitDesc: string;
  createdAt: string;
  updatedAt: string;

  constructor(testUnit: TestUnitType) {
    this.testUnitId = testUnit.testUnitId;
    this.unitDesc = testUnit.unitDesc;
    this.createdAt = testUnit.createdAt;
    this.updatedAt = testUnit.updatedAt;
  }
}

export class SwVersionClass {
  swVersionId: string;
  versionTitle: string;
  versionDesc: string;
  fileSrc?: string | null;
  tag: string;
  createdAt: string;
  dueDate?: string | null;

  swType: SwTypeClass;

  testUnits: TestUnitClass[] | [];
  // this is needed for the status of version (test passed or progressing)
  // if every tester updated status to pass, then it autmatically goes to done category.

  constructor(
    swVersion: SwVersionType,
    swType: SwTypeClass,
    testUnits: TestUnitClass[]
  ) {
    this.swVersionId = swVersion.swVersionId;
    this.versionTitle = swVersion.versionTitle;
    this.versionDesc = swVersion.versionDesc;
    this.tag = swVersion.tag;
    this.createdAt = swVersion.createdAt;

    this.fileSrc = swVersion.fileSrc;
    this.dueDate = swVersion.dueDate;

    this.swType = swType;
    this.testUnits = testUnits;
  }
  //   user: IUserInfo;
  //   swType: ISwType;
  //   testSessions: ITestSession[];
  //   testUnits: ITestUnit[];
}
