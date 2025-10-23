import { Navigate, Outlet } from "react-router-dom";

const PublicAccess = () => {
  const hasUser = !!localStorage.getItem("accessToken");
  const hasReviewer = !!localStorage.getItem("token");

  // If reviewer token exists, block public routes
  if (hasReviewer && !hasUser) return <Navigate to="/dashboard" replace />;

  // If user token exists, block login only, allow / if needed
  if (hasUser && !hasReviewer) return <Navigate to="/uploads" replace />;

  // Otherwise allow access
  return <Outlet />;
};

export default PublicAccess;
