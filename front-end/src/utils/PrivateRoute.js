import Cookies from "js-cookie";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const token = Cookies.get("token");
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
