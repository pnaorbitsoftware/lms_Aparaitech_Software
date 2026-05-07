import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userData } = useContext(AppContext);
  if (!userData) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(userData.role)) return <Navigate to="/unauthorized" replace />;
  return children;
};

export default ProtectedRoute;
