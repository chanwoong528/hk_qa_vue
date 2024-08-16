import axios from "axios";

export const DEV_BASE_RESTAPI =
  process.env.NODE_ENV === "dev"
    ? "http://localhost:3000"
    : "http://ec2-3-36-178-244.ap-northeast-2.compute.amazonaws.com:5000";

export const http = axios.create({
  baseURL: DEV_BASE_RESTAPI,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  if (localStorage.getItem("accessToken")) {
    let accessToken = localStorage.getItem("accessToken");

    config.headers["authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// http.interceptors.response.use(
//   async (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 498) {
//       const refToken = localStorage.getItem("refreshToken");

//       const res = await axios.post(
//         `${DEV_BASE_RESTAPI}/user/generate-access-token`,
//         {
//           refreshToken: refToken,
//         }
//       );
//       if (res.data.code === 201) {
//         localStorage.setItem("accessToken", res.data.data["access_token"]);
//         originalRequest.headers[
//           "authorization"
//         ] = `Bearer ${res.data.data["access_token"]}`;
//         http.defaults.headers.common[
//           "authorization"
//         ] = `Bearer ${res.data.data["access_token"]}`;
//         return axios(originalRequest);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export const ExceptionWrapper = async <T>(callback: Function): Promise<T> => {
  try {
    return await callback();
  } catch (error) {
    if (axios.isAxiosError(error)) throw error.response?.data;

    throw new Error("different error than axios" + error);
  }
};
