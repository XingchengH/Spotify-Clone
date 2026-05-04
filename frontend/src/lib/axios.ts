import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL + "/api";

export const axiosInstance = axios.create({ baseURL, withCredentials: true });

export const updateApiToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isAuthEndpoint = error.config?.url?.includes("/auth/");
    if (!isAuthEndpoint && (error.response?.status === 401 || error.response?.status === 403)) {
      const { default: store } = await import("../store/store");
      const { logout } = await import("../store/slices/userSlice");
      store.dispatch(logout());
      const { default: toast } = await import("react-hot-toast");
      toast.error("Your session has expired. Please log in again.", { id: "session-expired" });
    }
    return Promise.reject(error);
  }
);
