import axios from "axios";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";  // ✅ Correct import

const baseURL = "http://127.0.0.1:8000/api";

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens, logoutUser } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` }
  });

  axiosInstance.interceptors.request.use(async req => {
    if (!authTokens) return req; // Ensure authTokens exist

    const user = jwtDecode(authTokens.access);  // ✅ Fixed usage
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    try {
      const response = await axios.post(`${baseURL}/token/refresh/`, {
        refresh: authTokens.refresh
      });

      setAuthTokens(response.data);
      setUser(jwtDecode(response.data.access));  // ✅ Fixed usage
      localStorage.setItem("authTokens", JSON.stringify(response.data));

      req.headers.Authorization = `Bearer ${response.data.access}`;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logoutUser(); // Log the user out if refresh fails
    }

    return req;
  });

  return axiosInstance;
};

export default useAxios;
