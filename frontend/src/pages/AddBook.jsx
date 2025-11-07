import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const Navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://bookcove.onrender.com";

  const [Data, setData] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
  });

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    id: localStorage.getItem("id"),
  };

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async () => {
    try {
      if (
        !Data.url ||
        !Data.title ||
        !Data.author ||
        !Data.price ||
        !Data.desc ||
        !Data.language
      ) {
        alert("Vui lòng điền đầy đủ thông tin");
      } else {
        const res = await axios.post(`${API_BASE}/api/v1/add-book`, Data, { headers });
        setData({
          url: "",
          title: "",
          author: "",
          price: "",
          desc: "",
          language: "",
        });
        alert(res.data?.message || "Thêm sách thành công");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại");
      Navigate("/all-books");
    }
  };

  return (
    <div className="w-full h-full overflow-auto p-4">
      <h1 className="text-3xl font-semibold text-white uppercase mb-6">
        Thêm sách
      </h1>
      <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl">
        <div className="mb-4">
          <label className="text-white font-semibold">Ảnh</label>
          <input
            type="text"
            className="w-full mt-2 bg-transparent border-2 text-white p-2 outline-none"
            placeholder="Đường dẫn ảnh"
            name="url"
            value={Data.url}
            onChange={change}
          />
        </div>

        <div className="mb-4">
          <label className="text-white font-semibold">Tiêu đề sách</label>
          <input
            type="text"
            className="w-full mt-2 bg-transparent border-2 text-white p-2 outline-none"
            placeholder="Tiêu đề"
            name="title"
            value={Data.title}
            onChange={change}
          />
        </div>

        <div className="mb-4">
          <label className="text-white font-semibold">Tác giả</label>
          <input
            type="text"
            className="w-full mt-2 bg-transparent border-2 text-white p-2 outline-none"
            placeholder="Tác giả"
            name="author"
            value={Data.author}
            onChange={change}
          />
        </div>

        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <label className="text-white font-semibold">Ngôn ngữ</label>
            <input
              type="text"
              className="w-full mt-2 bg-transparent border-2 text-white p-2 outline-none"
              placeholder="Ngôn ngữ"
              name="language"
              value={Data.language}
              onChange={change}
            />
          </div>
          <div className="w-full md:w-1/2">
            <label className="text-white font-semibold">Giá</label>
            <input
              type="text"
              className="w-full mt-2 bg-transparent border-2 text-white p-2 outline-none"
              placeholder="Giá"
              name="price"
              value={Data.price}
              onChange={change}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-white font-semibold">Mô tả</label>
          <input
            type="text"
            className="w-full mt-2 bg-transparent border-2 text-white p-2 outline-none"
            placeholder="Mô tả"
            name="desc"
            value={Data.desc}
            onChange={change}
          />
        </div>

        <button
          className="mt-4 px-4 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition-all duration-300"
          onClick={submit}
        >
          Thêm sách
        </button>
      </div>
    </div>
  );
};

export default AddBook;
