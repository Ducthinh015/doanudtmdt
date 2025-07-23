import Sidebar from "../components/Profile/Sidebar";
import { Outlet } from "react-router-dom";

import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import MobileNav from "../components/Profile/MobileNav";
import Navbar from "../components/Navbar/Navbar";

const Profile = () => {
  const [profile, setProfile] = useState();
  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    id: localStorage.getItem("id"),
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-user-information",
          { headers }
        );
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetch();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover text-white"
      style={{ backgroundImage: `url(/images/background-img.webp)` }}
    >
      <Navbar />
      <div className="px-1 md:px-12 py-8 flex flex-col lg:flex-row gap-6">
        {!profile ? (
          <div className="w-full flex items-center justify-center h-[60vh]">
            <Loader />
          </div>
        ) : (
          <>
            {/* Sidebar for desktop */}
            <div className="hidden md:block md:w-full lg:w-1/6">
              <Sidebar data={profile} />
            </div>

            {/* Mobile nav for small devices */}
            <div className="block md:hidden">
              <MobileNav />
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-5/6 overflow-y-auto">
              <Outlet />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
