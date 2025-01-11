import React, { createContext, useEffect, useContext, useState } from "react";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "../FireBase/Firebase";
import { User } from "firebase/auth";
import { useNavigate } from "react-router";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null),
    navigate = useNavigate();

  const signin = () => {
    signInWithPopup(auth, provider).catch((error) => {
      alert(error.message);
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Current user details
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser) {
      navigate("/list-view");
    }
  }, [currentUser, navigate]);

  const value = {
    currentUser,
    signin,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
