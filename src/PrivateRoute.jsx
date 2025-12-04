import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import auth from "../firebase";
import api from "./API";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const [isAuth, setAuth] = useState({});

  function getAuth() {
    onAuthStateChanged(auth, (user) => {
      setAuth(user);
    });
  }

  async function getCurUser() {
    try {
      const res = await api.get("/cur_user");
      setAuth(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getAuth();
    getCurUser();
  }, []);

//   return isAuth != null ? <Outlet/> : <Navigate to="/"/>

  // Not logged in
  if (!isAuth) {
    if (location.pathname === "/") {
      return <Navigate to="/" />; // Login page
    }

    if (location.pathname === "/register") {
      return <Navigate to="/register" />; // Register page
    }

    return <Navigate to="/" />; // Any protected page → redirect to login
  }

  // Logged in → allow protected routes
  return <Outlet />;
};

export default PrivateRoute;
