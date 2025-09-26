import axios, { type AxiosRequestConfig, type AxiosInstance } from 'axios';

import { setInterceptor } from '@/core/services/api-interceptor';

const axiosInstance: AxiosInstance = axios.create({
  // baseURL: 'https://your-api-url.com', // Optionally set a base URL
  // ...other default configs
});

setInterceptor(axiosInstance);

export function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return axiosInstance.get<T>(url, config) as Promise<T>;
}


export function post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
  return axiosInstance.post<T>(url, data, config) as Promise<T>;
}


export function put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
  return axiosInstance.put<T>(url, data, config) as Promise<T>;
}


export function patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
  return axiosInstance.patch<T>(url, data, config) as Promise<T>;
}


export function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return axiosInstance.delete<T>(url, config) as Promise<T>;
}