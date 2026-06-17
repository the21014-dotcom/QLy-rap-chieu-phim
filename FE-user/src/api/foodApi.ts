import axiosClient from "./axiosClient";

/* eslint-disable @typescript-eslint/no-explicit-any */
const foodApi = {
  getAllfoods: (): Promise<any> => axiosClient.get('/foods'),
};
export default foodApi;