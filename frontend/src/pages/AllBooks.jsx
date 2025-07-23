import Loader from "../components/Loader/Loader";
import BookCard from "../components/BookCard/BookCard";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

const AllBooks = () => {
  const [Data, setData] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "https://bookcove.onrender.com/api/v1/get-all-books"
      );
      setData(response.data.data);
    };
    fetch();
  }, []);

  const filteredBooks = Data?.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0a192f] via-black to-black text-white bg-cover">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="px-12 py-8 flex-1 overflow-y-auto relative">
        <h4 className="text-3xl text-white uppercase text-center font-semibold">
          All Books
        </h4>

        {/* Glassmorphic Search Input */}
        <div className="flex justify-center my-6">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              padding: "12px 20px",
              color: "#fff",
              outline: "none",
              width: "90%",
              maxWidth: "400px",
              fontSize: "16px",
            }}
          />
        </div>

        {/* Loader */}
        {!Data && (
          <div className="flex items-center justify-center my-8">
            <Loader />
          </div>
        )}

        {/* Filtered Book Grid */}
        <div className="my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 relative z-20">
          {filteredBooks?.length > 0 ? (
            filteredBooks.map((items, i) => (
              <div key={i}>
                <BookCard data={items} />
              </div>
            ))
          ) : (
            <p className="text-white text-center col-span-full">
              No books found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBooks;
