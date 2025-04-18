"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie, deleteCookie, hasCookie } from "cookies-next";

const AuthContext = createContext(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

const authSessionKey = "_SS_AUTH_KEY_";

export const AuthProvider = ({ children }) => {
  //const navigate = useNavigate();
  const router = useRouter();
  //router.push('/some-path');

  // Retrieve session from cookies
  const getSession = () => {
    const cookieData = getCookie(authSessionKey);
    return cookieData ? JSON.parse(cookieData) : null;
  };

  const [user, setUser] = useState(getSession());

  // Save session
  const saveSession = (sessionData) => {
    setCookie("access_token", sessionData.access);
    //setCookie('refresh_token', sessionData.refresh);
    setCookie(authSessionKey, JSON.stringify(sessionData.user));
    setUser(sessionData.user);
  };

  // Remove session and call logout API

  // const removeSession = async () => {
  //   try {
  //     // Call the logout API
  //     await logout(); // Make sure you handle this API call as needed

  //     // Delete session cookies
  //     deleteCookie(authSessionKey);
  //     deleteCookie("access_token");
  //     deleteCookie("refresh_token");

  //     setUser(null); // Clear the user state

  //     navigate("/auth/sign-in"); // Redirect to the sign-in page
  //   } catch (error) {
  //     console.error("Logout API call failed:", error);
  //     // Handle the error gracefully if necessary
  //   }
  // };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: hasCookie(authSessionKey),
        saveSession,
        //removeSession,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
