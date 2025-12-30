import { memo } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../User-Components/Navbar.jsx";

const UserLayout = memo(function UserLayout() {
  return (
    <>
      <Navbar />

      {/* Main page content */}
      <main className="relative z-10">
        <Outlet />
      </main>
    </>
  );
});

export default UserLayout;
