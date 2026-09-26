import { createContext } from "react";
import { useState, useContext } from "react";
import { toast } from "react-hot-toast";
import api from "../config/api";

const AppContext = createContext();

const getErrMsg = (error, fallback) => {
  return error?.response?.data?.error || fallback || "Something went wrong";
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  //Auth action helper function
  const authAction = async (requestFn, successMsg, errorFallback) => {
    try {
      const { data } = await requestFn();
      setUser(data.user);
      if (successMsg) toast.success(successMsg);
      return true;
    } catch (error) {
      toast.error(getErrMsg(error, errorFallback));
      return false;
    }
  };

  const login = (email, password) => {
    return authAction(
      () => api.post("/api/auth/login", { email, password }),
      "Welcome back!",
      "Failed to login",
    );
  };

  const register = (name, email, password) => {
    return authAction(
      () => api.post("/api/auth/register", { name, email, password }),
      "Account created successfully!",
      "Failed to create account",
    );
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(getErrMsg(error, "Failed to logout"));
    }
  };

  const value = {
    user, setUser, login, register, logout
  };

  return (
    <AppContext.Provider value={value }>{children}</AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
