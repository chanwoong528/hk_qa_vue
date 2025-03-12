import { UserClass } from "./User";

type SwType = {
  swTypeId: string;
  typeTitle: string;
  typeDesc: string;
  showStatus: string;
  createdAt: string;
  updatedAt: string;
};

export class SwTypeClass {
  swTypeId: string;
  typeTitle: string;
  typeDesc: string;
  showStatus: string;
  createdAt: string;
  updatedAt: string;

  user: UserClass;
  //   swVersions: ISwVersion[];
  //   jenkinsDeployments: JenkinsDeploymentClass[];

  constructor(swType: SwType, user: UserClass) {
    this.swTypeId = swType.swTypeId;
    this.typeTitle = swType.typeTitle;
    this.typeDesc = swType.typeDesc;
    this.showStatus = swType.showStatus;
    this.createdAt = swType.createdAt;
    this.updatedAt = swType.updatedAt;
    this.user = user;
  }
}
