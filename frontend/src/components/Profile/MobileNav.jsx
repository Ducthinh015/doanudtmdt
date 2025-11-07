import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../features/auth";
const MobileNav = () => {
  const role = useSelector((state) => state.auth.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(authActions.logout());
    dispatch(authActions.changeRole("user"));
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };
  return (
    <>
      {role === "user" && (
        <div className="w-full flex lg:hidden items-center justify-between my-8">
          <Link
            to="/profile"
            className="text-zinc-100 font-semibold w-full  text-center hover:bg-white/30 rounded transition-all duration-300"
          >
            Yêu thích
          </Link>
          <Link
            to="/profile/orderHistory"
            className="text-zinc-100 font-semibold w-full text-center hover:bg-white/30 rounded transition-all duration-300"
          >
            Lịch sử đơn hàng
          </Link>
          <Link
            to="/profile/settings"
            className="text-zinc-100 font-semibold w-full text-center hover:bg-white/30 rounded transition-all duration-300"
          >
            Cài đặt
          </Link>
        </div>
      )}

      {role === "admin" && (
        <div className="w-full flex lg:hidden items-center justify-between my-8">
          <Link
            to="/profile"
            className="text-zinc-100 font-semibold w-full  text-center hover:bg-white/30 rounded transition-all duration-300"
          >
            Tất cả đơn hàng
          </Link>
          <Link
            to="/profile/add-book"
            className="text-zinc-100 font-semibold w-full text-center hover:bg-white/30 rounded transition-all duration-300"
          >
            Thêm sách
          </Link>
          <button
            onClick={handleLogout}
            className="text-zinc-100 font-semibold w-full text-center hover:bg-white/30 rounded transition-all duration-300"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </>
  );
};

export default MobileNav;
