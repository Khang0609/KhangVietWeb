import axios from "axios";
import { getApiUrl } from "./api";

// Create Axios instance
const apiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send Cookies (Refresh Token) with requests
});

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle 401 & Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if 401 and not already retried
    // Also ensure we are not looping on the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/token") // Don't retry login itself
    ) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        // Note: We use a separate axios call or the same logic,
        // but be careful not to use the interceptor if it fails again?
        // Actually, using `axios.post` directly avoids the interceptor IF we don't use the instance.
        // But we want to use the instance to get the baseURL.
        // Let's rely on the check `!originalRequest.url.includes("/refresh")` to break loop.

        const res = await apiClient.post("/auth/refresh");

        if (res.status === 200) {
          const { access_token } = res.data;

          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", access_token);
          }

          // Update header and retry original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed (Session expired)
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          // Redirect to login (optional: save current path to redirect back)
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
