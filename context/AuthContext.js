import React, { createContext, useContext, useState } from 'react';

// Create an Auth context
const AuthContext = createContext();

// AuthProvider component to wrap the app
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData); // Set user data after login
  };

  const logout = () => {
    setUser(null); // Clear user data after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export both AuthProvider and useAuth
export { AuthProvider, useAuth };
