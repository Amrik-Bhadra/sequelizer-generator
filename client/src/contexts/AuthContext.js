import { createContext, useContext } from "react";

export const AuthContext = createContext({
    userID: "",
    email:"",
    name: ""
});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = AuthContext.Provider;