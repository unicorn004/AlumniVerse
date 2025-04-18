"use client";

import { AuthProvider } from "./useAuthContext"

const GlobalProvider = ({children}) => {
  return (
  <AuthProvider> 
    {children}
  </AuthProvider>);
}

export default GlobalProvider;