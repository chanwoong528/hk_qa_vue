export class JenkinsDeploymentClass {
  public jenkinsDeploymentId: string = "";
  public title: string = "";
  public jenkinsUrl: string = "";
  public description: string = "";

  constructor(partial?: Partial<JenkinsDeploymentClass>) {
    if (!!partial) Object.assign(this, partial);
  }
}
