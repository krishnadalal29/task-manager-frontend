import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

const AUTH_TOKEN_STORAGE_KEY = "task-manager-auth-token";

const savedToken =
  typeof window !== "undefined"
    ? window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
    : "";

if (savedToken) {
  apiClient.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
}

export function setApiClientAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete apiClient.defaults.headers.common.Authorization;
}

function getTokenFromBearerHeader(authorizationHeader) {
  if (typeof authorizationHeader !== "string") return "";
  if (!authorizationHeader.startsWith("Bearer ")) return "";

  return authorizationHeader.replace("Bearer ", "").trim();
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const requestConfig = error?.config;

    if (status !== 401 || !requestConfig || requestConfig.__retriedWithRawToken) {
      return Promise.reject(error);
    }

    const authorizationHeader =
      requestConfig?.headers?.Authorization ||
      requestConfig?.headers?.authorization ||
      apiClient.defaults.headers.common.Authorization;

    const token = getTokenFromBearerHeader(authorizationHeader);
    if (!token) {
      return Promise.reject(error);
    }

    requestConfig.__retriedWithRawToken = true;
    requestConfig.headers = requestConfig.headers || {};
    requestConfig.headers.Authorization = token;

    return apiClient.request(requestConfig);
  }
);

export default apiClient;
