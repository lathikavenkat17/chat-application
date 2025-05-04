import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";  // ✅ Correct import
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    const storedTokens = localStorage.getItem("authTokens");
    return storedTokens ? JSON.parse(storedTokens) : null;
  });

  const [user, setUser] = useState(() => {
    try {
      return authTokens ? jwtDecode(authTokens.access) : null;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 User Login
  const loginUser = async (email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/");

        Swal.fire({
          title: "Login Successful",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Invalid Username or Password",
          icon: "error",
          toast: true,
          timer: 3000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  // 🔹 User Logout
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");

    Swal.fire({
      title: "You have been logged out",
      icon: "success",
      toast: true,
      timer: 3000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  // 🔹 User Registration
  const registerUser = async (email, username, password, password2) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password, password2 }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Registration Successful!",
          text: "You can now log in.",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
        navigate("/login"); // Redirect to login page after successful registration
      } else {
        Swal.fire({
          title: "Registration Failed!",
          text: data?.detail || "Something went wrong.",
          icon: "error",
          toast: true,
          timer: 3000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  useEffect(() => {
    if (authTokens) {
      try {
        setUser(jwtDecode(authTokens.access));
      } catch (error) {
        console.error("Token decode error:", error);
        logoutUser();
      }
    }
    setLoading(false);
  }, [authTokens]);

  // ✅ Add registerUser inside contextData
  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    loginUser,
    logoutUser,
    registerUser, // ✅ Now accessible in RegisterPage.js
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
