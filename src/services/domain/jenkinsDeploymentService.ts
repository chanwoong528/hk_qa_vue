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
  GET_jenkinsDeploymentBySwType: (swTypeId: string): Promise<JenkinsDeploymentClass[]> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.get(`/jenkins-deployment/${swTypeId}`);
      const data = await apiResult.data;
      return data;
    });
  },
};

export const buildLogApi = {
  POST_buildLog: (buildLogParams: Partial<any>): Promise<any> => {
    return ExceptionWrapper(async () => {
      const apiResult = await http.post("/deploy-log", buildLogParams);
      const data = await apiResult.data;
      return data;
    });
  },
};
