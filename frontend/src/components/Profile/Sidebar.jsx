import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../features/auth";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);

  const handleLogout = () => {
    dispatch(authActions.logout());
    dispatch(authActions.changeRole("user"));
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="mt-28 bg-white/10 border border-white/30 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between h-98">
      {/* Profile Section */}
      <div className="flex flex-col items-center text-center">
        <img
          src={data.avatar || "https://i.ibb.co/4pDNDk1/avatar.png"}
          alt="User Avatar"
          className="h-20 w-20 sm:h-28 sm:w-28 lg:h-32 lg:w-32 rounded-full object-cover border-2 border-white/30"
        />
        <p className="mt-3 text-white text-lg sm:text-xl font-semibold">
          {data.username}
        </p>
        <p className="text-sm text-zinc-300">{data.email}</p>
        <hr className="w-full my-4 border-white/30 hidden lg:block" />
      </div>

      {/* Links */}
      <div className="flex flex-col items-center space-y-4 mt-6">
        {role === "user" && (
          <>
            <Link
              to="/profile"
              className="text-white w-full text-center font-medium hover:text-beige transition duration-300"
            >
              Favourites
            </Link>
            <Link
              to="/profile/orderHistory"
              className="text-white w-full text-center font-medium hover:text-beige transition duration-300"
            >
              Order History
            </Link>
            <Link
              to="/profile/settings"
              className="text-white w-full text-center font-medium hover:text-beige transition duration-300"
            >
              Settings
            </Link>
          </>
        )}

        {role === "admin" && (
          <>
            <Link
              to="/profile"
              className="text-white w-full text-center font-medium hover:text-beige transition duration-300"
            >
              All Orders
            </Link>
            <Link
              to="/profile/add-book"
              className="text-white w-full text-center font-medium hover:text-beige transition duration-300"
            >
              Add Book
            </Link>
            <Link
              to="/profile/settings"
              className="text-white w-full text-center font-medium hover:text-beige transition duration-300"
            >
              Settings
            </Link>
          </>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-8 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 w-full rounded flex items-center justify-center gap-2 transition-all duration-300"
      >
        <LogoutIcon /> Log Out
      </button>
    </div>
  );
};

export default Sidebar;
