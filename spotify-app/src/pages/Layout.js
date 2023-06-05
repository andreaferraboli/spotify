import { Outlet, Link } from "react-router-dom";
import MyNavbar from "../components/navbar";

const Layout = () => {
  return (
    <>
      <MyNavbar/>

      <Outlet />
    </>
  )
};

export default Layout;