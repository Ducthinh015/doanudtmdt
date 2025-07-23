/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const BookCard = ({ data, favourite }) => {
  const [loading, setLoading] = useState(false);

  // Headers for API request
  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    id: localStorage.getItem("id"),
    bookid: data._id,
  };

  // Remove book from favourites handler
  const handleRemoveBook = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `https://bookcove.onrender.com/api/v1/remove-book-from-favourite/${data._id}`,
        {},
        { headers }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error removing book:", error);
      alert("Failed to remove book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:w-[18rem] md:w-80 bg-none backdrop-blur-md p-4 flex flex-col shadow-md border border-white/10 rounded-xl transition-transform hover:scale-105 duration-300">
      <Link to={`/view-book-details/${data._id}`}>
        {/* Book Cover */}
        <div className="flex items-center justify-center">
          <img
            src={data.url}
            alt={data.title || "Book Cover"}
            className="h-[35vh] object-contain max-w-full rounded"
          />
        </div>

        {/* Book Info */}
        <div className="flex flex-col justify-center items-center mt-4 text-center">
          <h2 className="text-lg font-bold text-white break-words line-clamp-2">
            {data.title}
          </h2>
          <p className="text-sm mt-1 text-white font-medium break-words line-clamp-1">
            by {data.author}
          </p>
          <p className="mt-1 text-white font-semibold text-sm">₹{data.price}</p>
        </div>
      </Link>

      {/* Favourite Remove Button */}
      {favourite && (
        <button
          onClick={handleRemoveBook}
          disabled={loading}
          className={`mt-4 px-3 py-1 rounded font-semibold border transition-colors ${
            loading
              ? "bg-gray-400 text-black cursor-not-allowed"
              : "bg-transparent border-white/40 hover:bg-white hover:text-black"
          }`}
        >
          {loading ? "Removing..." : "Remove from favourites"}
        </button>
      )}
    </div>
  );
};

export default BookCard;
