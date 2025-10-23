import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import { PATHS } from "../constant";
import UserAccess from "./UserAccess";
import Uploads from "../pages/Upload";
import NotFound from "../components/NotFound";
import Images from "../pages/Images";
import Login from "../pages/Login";
import ReviewerAccess from "./ReviewerAccess";
import Dashboard from "../pages/Dashboard";
import Detailed from "../components/Detailed";
import Layout from "../components/Layout";
import Users from "../pages/Users";
import Setting from "../pages/Setting";

const AppRoutes = () => {
  const {
    home,
    uploads,
    uploadImage,
    notFound,
    login,
    dashboard,
    users,
    userDetail,
    setting,
  } = PATHS;

  return (
    <Routes>
      <Route path={home} element={<Home />} />
      <Route path={notFound} element={<NotFound />} />
      <Route path={login} element={<Login />} />
      <Route element={<UserAccess />}>
        <Route path={uploads} element={<Images />} />
        <Route path={uploadImage} element={<Uploads />} />
      </Route>
      <Route element={<ReviewerAccess />}>
        <Route element={<Layout />}>
          <Route path={dashboard} element={<Dashboard />} />
          <Route path={users} element={<Users />} />
          <Route path={userDetail} element={<Detailed />} />
          <Route path={setting} element={<Setting />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
