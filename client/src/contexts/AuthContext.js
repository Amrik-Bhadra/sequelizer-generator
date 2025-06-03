import { createContext, useContext } from "react";

export const AuthContext = createContext({
    userID: "",
});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = AuthContext.Provider;