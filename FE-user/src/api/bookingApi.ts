import axiosClient from "./axiosClient";

/* eslint-disable @typescript-eslint/no-explicit-any */
const bookingApi = {
  getShowtimeDetails: (id: number): Promise<any> => axiosClient.get(`/showtimes/${id}`),
  create: (data: any): Promise<any> => axiosClient.post('/bookings', data),
  getUserHistory: () => {
    return axiosClient.get('/bookings/user/history');
  },

};
export default bookingApi;