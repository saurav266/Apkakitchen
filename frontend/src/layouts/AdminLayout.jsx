import { useState, useCallback, useMemo, memo } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../Admin-Components/AdminNavbar.jsx";
import AdminSidebar from "../Admin-Components/AdminSidebar.jsx";

const AdminLayout = memo(function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  // ✅ stable handler
  const toggleSidebar = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  // ✅ stable class calculation
  const contentClass = useMemo(
    () =>
      `
        flex-1 pt-20 bg-orange-50 min-h-screen
        transition-all duration-300
        ${collapsed ? "ml-20" : "ml-64"}
      `,
    [collapsed]
  );

  return (
    <>
      {/* Navbar never re-renders unnecessarily */}
      <AdminNavbar />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar
          collapsed={collapsed}
          setCollapsed={toggleSidebar}
        />

        {/* Main Content */}
        <div className={contentClass}>
          <Outlet />
        </div>
      </div>
    </>
  );
});

export default AdminLayout;
