import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import { PATHS } from "../constant";
import UserAccess from "./UserAccess";
import Uploads from "../pages/Upload";
import NotFound from "../components/NotFound";
import Images from "../pages/Images";

const AppRoutes = () => {
  const { home, uploads, uploadImage, notFound } = PATHS;

  return (
    <Routes>
      <Route path={home} element={<Home />} />
      <Route path={notFound} element={<NotFound />} />
      <Route element={<UserAccess />}>
        <Route path={uploads} element={<Images />} />
        <Route path={uploadImage} element={<Uploads />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
