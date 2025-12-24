import Navbar from "../User-Components/Navbar.jsx";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <>
      <Navbar />

      {/* Main page content */}
      <main className=" relative z-10">
        <Outlet />
      </main>
    </>
  );
}
