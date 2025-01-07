import React from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from '../../components/layout/profileUserSidebar';
import '../../style/userProfile/profile.scss'

const Profile = () => {
    return (
        <div className="profile-page">
            <Sidebar />
            <Outlet />
        </div>
    );
};

export default Profile;