/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import axios from "axios";

const BookCard = ({ data, favourite }) => {
  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    id: localStorage.getItem("id"),
    bookid: data._id,
  };
  const handleRemoveBook = async () => {
    const response = await axios.put(
      `http://localhost:1000/api/v1/remove-book-from-favourite/${data._id}`,
      {},
      { headers }
    );
    alert(response.data.message);
  };
  return (
    <div className="w-80 h-[90%] bg-none backdrop-blur-md p-4 flex flex-col shadow-md border border-white/10 rounded-xl transition-transform hover:scale-105 duration-300">
      {/* Link to view book details */}
      <Link to={`/view-book-details/${data._id}`}>
        {/* Book Image */}
        <div className="flex items-center justify-center">
          <img
            src={data.url}
            alt={data.title}
            className="h-[35vh] object-contain rounded"
          />
        </div>

        {/* Book Info */}
        <div className="flex flex-col justify-center items-center mt-4 text-center">
          <h2 className="text-xl text-white font-bold">{data.title}</h2>
          <p className="mt-1 text-white font-semibold">by {data.author}</p>
          <p className="mt-1 text-white font-semibold">
            {"\u20B9"}
            {data.price}
          </p>
        </div>
      </Link>

      {/* Favourite Button */}
      {favourite && (
        <button
          onClick={handleRemoveBook}
          className="mt-4 px-3 py-1 bg-transparent border border-white/40 hover:bg-white hover:text-black transition-colors font-semibold rounded"
        >
          Remove from favourites
        </button>
      )}
    </div>
  );
};

export default BookCard;
