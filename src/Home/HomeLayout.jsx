import { Outlet } from "react-router-dom";
import Navbar from "./header/Navbar";
import Footer from "./footer/Footer";

export default function HomeLayout() {
  return (
    <>
      <Navbar />
      <div className="container min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
