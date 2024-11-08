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

  PATCH_jenkinsDeployment: (
    jenkinsDeploymentParams: Partial<JenkinsDeploymentClass>
  ): Promise<JenkinsDeploymentClass> => {
    return ExceptionWrapper(async () => {
      console.log(jenkinsDeploymentParams);

      const apiResult = await http.patch(
        `/jenkins-deployment/${jenkinsDeploymentParams.jenkinsDeploymentId}`,
        jenkinsDeploymentParams
      );

      const data = await apiResult.data;
      return data;
    });
  },

  DELETE_jenkinsDeployment: (jenkinsDeploymentId: string): Promise<void> => {
    return ExceptionWrapper(async () => {
      return await http.delete(`/jenkins-deployment/${jenkinsDeploymentId}`);
    });
  },
};
