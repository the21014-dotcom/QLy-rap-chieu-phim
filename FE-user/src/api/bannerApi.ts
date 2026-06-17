import axiosClient from "./axiosClient"; // Tùy vào cách bạn cấu hình axios

export const bannerApi = {
  getActive: () => {
    return axiosClient.get("/banners/active");
  }
};