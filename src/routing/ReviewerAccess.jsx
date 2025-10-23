import { Navigate, Outlet } from "react-router-dom";

const ReviewerAccess = () => {
  const isAccess = !!localStorage.getItem("token");

  return isAccess ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ReviewerAccess;
