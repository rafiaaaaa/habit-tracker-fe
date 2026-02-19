import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL!;
export const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
  withCredentials: true,
});

export type ApiErrorResponse = {
  success: string;
  message: string;
};
