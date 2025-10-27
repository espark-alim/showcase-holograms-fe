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
import Layout from "../components/Layout";

const AppRoutes = () => {
  const { home, uploads, uploadImage, notFound, login, dashboard } = PATHS;

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
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
