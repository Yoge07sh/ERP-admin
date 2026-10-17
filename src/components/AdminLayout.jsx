import { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import Sidebar from "./Sidebar";

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content">{children}</main>
    </>
  );
}

export default AdminLayout;
