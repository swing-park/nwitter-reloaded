import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = auth.currentUser;

  return !user ? <Navigate to="login" /> : children;
};

export default ProtectedRoute;
