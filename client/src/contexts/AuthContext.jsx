import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast"

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
  fetchUser: async () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/auth/me", {
        withCredentials: true,
      });

      if (res.status === 200) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.log(err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        toast.success("Logout Successful!");
        setUser(null);
      } else {
        toast.error("Logout error");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
