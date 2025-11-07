import { useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { trackEvent } from "../../utils/analytics";

const ViewBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [Data, setData] = useState();
  const [related, setRelated] = useState([]);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bookcove.onrender.com";

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/v1/get-book-by-id/${id}`);
        setData(response.data.data);
        console.log(response.data);
      } catch (err) {
        console.error("Failed to fetch book details", err);
      }
    };
    fetch();
  }, [id]);

  // track view & fetch related
  useEffect(() => {
    (async () => {
      if (id) {
        trackEvent("view", { bookId: id });
        try {
          const r = await axios.get(`${API_BASE}/api/v1/books/related`, { params: { bookId: id } });
          setRelated(r.data.data || []);
        } catch (_) {}
      }
    })();
  }, [id]);

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    id: localStorage.getItem("id"),
    bookid: id,
  };

  const handleFav = async () => {
    try {
      const response = await axios.put(`${API_BASE}/api/v1/add-book-to-favourite`, {}, { headers });
      alert(response.data.message);
      trackEvent("favorite", { bookId: id });
    } catch (error) {
      console.log("Failed to add to favorites", error);
    }
  };

  const handleCart = async () => {
    try {
      const response = await axios.put(`${API_BASE}/api/v1/add-to-cart`, {}, { headers });
      alert(response.data.message);
      trackEvent("add_to_cart", { bookId: id });
    } catch (error) {
      console.log("Failed to add to Cart", error);
    }
  };

  const deleteBook = async () => {
    const response = await axios.delete(`${API_BASE}/api/v1/delete-book`, { headers });
    alert(response.data.message);
    navigate("/all-books");
  };

  if (!Data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#0a192f] via-black to-black text-white">
        <Navbar />
        <div className="px-4 md:px-12 py-8 flex flex-col lg:flex-row gap-8 mt-8">
          {/* Left Section: Image + Admin/User Buttons */}
          <div className="w-full lg:w-1/2 flex flex-col lg:flex-row gap-4 items-center lg:items-start">
            <img
              src={Data.url}
              className="w-full sm:w-[80%] lg:w-[60%] max-h-[70vh] object-contain rounded"
              alt={Data.title}
            />

            {/* Buttons Section */}
            {isLoggedIn && (
              <div className="flex gap-4 lg:flex-col mt-4 lg:mt-0">
                {role === "admin" && (
                  <>
                    <Link
                      to={`/updateBook/${id}`}
                      className="bg-white text-black rounded-full w-12 h-12 text-2xl flex items-center justify-center"
                    >
                      <EditIcon />
                    </Link>
                    <button
                      onClick={deleteBook}
                      className="bg-white rounded-full w-12 h-12 text-2xl flex items-center justify-center text-red-400"
                    >
                      <DeleteIcon />
                    </button>
                  </>
                )}
                {role === "user" && (
                  <>
                    <button
                      className="bg-white rounded-full w-12 h-12 text-2xl flex items-center justify-center text-red-400"
                      onClick={handleFav}
                    >
                      <FavoriteIcon />
                    </button>
                    <button
                      onClick={handleCart}
                      className="bg-white rounded-full w-12 h-12 text-2xl flex items-center justify-center text-blue-400"
                    >
                      <ShoppingCartIcon />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Section: Book Details */}
          <div className="w-full lg:w-1/2 p-4 text-white">
            <h2 className="text-3xl font-bold mb-4">{Data.title}</h2>
            <p className="mb-2 font-semibold">Tác giả: {Data.author}</p>
            <p className="mb-4 font-semibold">{Data.desc}</p>
            <p className="mb-2 font-semibold">Giá: {Data.price?.toLocaleString("vi-VN")} ₫</p>
            <p className="mb-2 font-semibold">Ngôn ngữ: {Data.language}</p>
          </div>
        </div>
      </div>
      {/* Related Books */}
      {related?.length > 0 && (
        <div className="px-4 md:px-12 pb-12">
          <h3 className="text-xl font-semibold mb-4">Gợi ý cho bạn</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.map((b, i) => (
              <Link key={i} to={`/view-book-details/${b._id}`} className="bg-white/10 p-3 rounded hover:bg-white/20">
                <img src={b.url} alt={b.title} className="w-full h-48 object-cover rounded" />
                <div className="mt-2 font-semibold">{b.title}</div>
                <div className="text-sm opacity-80">{b.author}</div>
                <div className="text-sm">{Number(b.price).toLocaleString('vi-VN')} ₫</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ViewBookDetails;
