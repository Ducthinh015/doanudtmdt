  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bookcove.onrender.com";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateBook = () => {
  const [Data, setData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    id: localStorage.getItem("id"),
    bookid: id,
  };
  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async () => {
    try {
      if (
        Data.url === "" ||
        Data.title === "" ||
        Data.author === "" ||
        Data.price === "" ||
        Data.desc === "" ||
        Data.language === ""
      ) {
        alert("Vui lòng điền đầy đủ thông tin");
      } else {
        const res = await axios.put(`${API_BASE}/api/v1/update-book`, Data, { headers });
        setData({
          url: "",
          title: "",
          author: "",
          price: "",
          desc: "",
          language: "",
        });
        alert(res.data?.message || "Cập nhật sách thành công");
      }
    } catch (err) {
      alert(err.res.data.message);
      navigate(`/view-book-details/${id}`);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/v1/get-book-by-id/${id}`);
        setData(response.data.data);
      } catch (err) {
        console.error("Failed to fetch book details", err);
      }
    };
    fetch();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a192f] via-black to-black text-white">
      <Navbar />
      <div className="h-[100%] p-0 md:p-4 mt-4">
        <h1 className="text-3xl md:text 5xl font-semibold text-white mb-8 text-center uppercase">
          Cập nhật sách
        </h1>
        <div className="p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl">
          <div>
            <label htmlFor="" className="text-white font-semibold">
              Ảnh
            </label>
            <input
              type="text"
              className="w-full mt-2 bg-white/10 placeholder-white/70 border border-white/40 text-white p-2 rounded outline-none"
              placeholder="Đường dẫn ảnh"
              required
              value={Data.url}
              onChange={change}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="" className="text-white font-semibold">
              Tiêu đề sách
            </label>
            <input
              type="text"
              className="w-full mt-2 bg-white/10 placeholder-white/70 border border-white/40 text-white p-2 rounded outline-none"
              placeholder="Tiêu đề"
              name="title"
              required
              value={Data.title}
              onChange={change}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="" className="text-white font-semibold">
              Tác giả
            </label>
            <input
              type="text"
              className="w-full mt-2 bg-white/10 placeholder-white/70 border border-white/40 text-white p-2 rounded outline-none"
              placeholder="Tác giả"
              name="author"
              required
              value={Data.author}
              onChange={change}
            />
          </div>

          <div className="mt-4 flex gap-4">
            <div className="w-3/6">
              <label htmlFor="" className="text-white font-semibold">
                Ngôn ngữ
              </label>
              <input
                type="text"
                className="w-full mt-2 bg-white/10 placeholder-white/70 border border-white/40 text-white p-2 rounded outline-none"
                placeholder="Ngôn ngữ"
                name="language"
                required
                value={Data.language}
                onChange={change}
              />
            </div>
            <div className="w-3/6">
              <label htmlFor="" className="text-white font-semibold">
                Giá
              </label>
              <input
                type="text"
                className="w-full mt-2 bg-white/10 placeholder-white/70 border border-white/40 text-white p-2 rounded outline-none"
                placeholder="Giá"
                name="price"
                required
                value={Data.price}
                onChange={change}
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="" className="text-white font-semibold">
              Mô tả
            </label>
            <input
              type="text"
              className="w-full mt-2 bg-white/10 placeholder-white/70 border border-white/40 text-white p-2 rounded outline-none"
              placeholder="Mô tả"
              name="desc"
              required
              value={Data.desc}
              onChange={change}
            />
          </div>
          <button
            className="mt-4 px-4 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition-all duration-300"
            onClick={submit}
          >
            Cập nhật sách
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateBook;
