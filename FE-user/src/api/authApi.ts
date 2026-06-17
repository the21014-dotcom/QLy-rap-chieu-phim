/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "./axiosClient";

export const authApi = {
  login: (data: any) => axiosClient.post("/auth/login", data),
  register: (data: any) => axiosClient.post("/auth/register", data),
  verifyOtp: (data: { email: string; otp: string }) => 
    axiosClient.post("/auth/verify-otp", data),
  resendOtp: (email: string) => 
    axiosClient.post("/auth/resend-otp", { email }),
  forgotPassword: (email: string) => axiosClient.post("/auth/forgot-password", { email }),
};