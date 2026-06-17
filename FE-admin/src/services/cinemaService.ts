import axios from 'axios';
/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = 'http://localhost:8080/api/v1/cinemas';

export const cinemaService = {
  getAll: () => axios.get(API_URL),
  create: (data: any) => axios.post(API_URL, data),
  update: (id: number, data: any) => axios.patch(`${API_URL}/${id}`, data),
  delete: (id: number) => axios.delete(`${API_URL}/${id}`),
};