import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();

  // while we know auth state, render nothing (you can render a spinner)
  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // optional: require email verification
  if (!user.emailVerified) {
    return <Navigate to="/login" replace />; // or to a verify page
  }

  return children;
};

export default ProtectedRoute;