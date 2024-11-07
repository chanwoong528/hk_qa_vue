import { JenkinsDeploymentClass } from "@/entity/JenkinsDeployment";
import { http, ExceptionWrapper } from "../http";

export const jenkinsDeploymentApi = {
  POST_jenkinsDeployment: (
    jenkinsDeploymentParams: Partial<JenkinsDeploymentClass>
  ): Promise<JenkinsDeploymentClass> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.post("/jenkins-deployment", jenkinsDeploymentParams);
      const data = await apiResult.data;
      return data;
    });
  },
};
