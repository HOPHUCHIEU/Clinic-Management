import { Outlet } from "react-router-dom";
import AdminHeader from "./components/layout/AdminHeader";
import AdminSidebar from "./components/layout/AdminSidebar";
import "../src/style/layoutAdmin/admin.scss";
import { ToastContainer } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";

function AdminApp() {
  return (
     <>
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <AdminHeader />
        <Outlet />
    <ToastContainer></ToastContainer>
      </div>
    </div>
     </> 
  );
}

export default AdminApp;
