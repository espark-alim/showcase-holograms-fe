import { Navigate, Outlet } from "react-router-dom";

const ReviewerAccess = () => {
  const isAccess = !!localStorage.getItem("accessToken");

  return isAccess ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default ReviewerAccess;
