import React from "react";
import menu from "../../assets/img/menu.png";
import customer from "../../assets/img/customer01.png";
import { CiSearch } from "react-icons/ci";
import "../../style/layoutAdmin/admin.scss";

function AdminHeader() {
  return (
    <header className="admin-header">
      <div className="header-left">
      </div>
      
      <div className="header-right">
        <img src={customer} alt="avatar" />
      </div>
    </header>
  );
}

export default AdminHeader;
