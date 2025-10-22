import { Navigate, Outlet } from "react-router-dom";

const UserAccess = () => {
  const isAccess = !!localStorage.getItem("accessToken");

  return isAccess ? <Outlet /> : <Navigate to="/" replace />;
};

export default UserAccess;
