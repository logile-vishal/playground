import type { AxiosInstance, AxiosRequestHeaders } from "axios";

import { createCorrelationId } from "@/utils/create-corelation-id";
import { getAppId } from "@/utils/get-device-type";
import { SERVER_ERROR_CODES } from "@/core/constants/error-codes";

const CUSTOM_HEADERS = {
  "Org-Id": "org_123",
  "User-Id": 15393, // TODO: need to get it from old system
};

export const setInterceptor = (axiosInstance: AxiosInstance) => {
  // Request interceptor to add headers (e.g., Authorization)
  axiosInstance.interceptors.request.use(
    (config) => {
      // Example: Add Authorization header if token exists

      config.headers = setRequestHeaders(config.headers as AxiosRequestHeaders);
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || ({} as AxiosRequestHeaders);
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      // Add other headers as needed
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle errors globally
  axiosInstance.interceptors.response.use(
    (response) => response?.data,
    (error) => {
      // Example: Handle 401 Unauthorized globally
      if (error.response && error.response.status === 401) {
        // Optionally redirect to login or show a message
        // window.location.href = '/login';
      }

      if (
        error.response &&
        error.response.data &&
        error.response.data.errorCode
      ) {
        error["message"] =
          SERVER_ERROR_CODES[error.response.data.errorCode].reason || error;
      }

      return Promise.reject(error);
    }
  );
};

function setRequestHeaders(headers?: AxiosRequestHeaders) {
  const orgId = localStorage.getItem("orgId") || CUSTOM_HEADERS["Org-Id"];
  const userId = localStorage.getItem("userId") || CUSTOM_HEADERS["User-Id"];

  Object.assign(headers || {}, {
    "Org-Id": orgId,
    "User-Id": userId,
    "Correlation-Id": createCorrelationId(),
    "App-Id": getAppId(),
  });

  return headers;
}
