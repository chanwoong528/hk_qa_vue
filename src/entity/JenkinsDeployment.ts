export class JenkinsDeploymentClass {
  public jenkinsDeploymentId: string = "";
  public title: string = "";
  public jenkinsUrl: string = "";
  public description: string = "";

  public deployLogs: DeployLogClass[] = [];
  constructor(partial?: Partial<JenkinsDeploymentClass>) {
    if (!!partial) Object.assign(this, partial);
  }

  isReadyForAnotherDeploy(): boolean {
    if (this.deployLogs.some(deployLog => deployLog.status === "pending")) return false;

    return true;
  }
}

export class DeployLogClass {
  public jenkinsDeploymentId: string = "";
  public buildNumber: number = 0;
  public createdAt: string = "";
  public deployLogId: string = "";
  public status: string = "";
  public updatedAt: string = "";

  constructor(partial?: Partial<DeployLogClass>) {
    if (!!partial) Object.assign(this, partial);
  }
}
