import { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";

const Favorites = () => {
  const [favoriteBook, setFavoriteBook] = useState();

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    id: localStorage.getItem("id"),
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "https://bookcove.onrender.com/api/v1/get-favourite-books",
        { headers }
      );
      setFavoriteBook(response.data.data);
    };
    fetch();
  }, []);

  return (
    <>
      {favoriteBook?.length === 0 && (
        <div className="text-5xl font-semibold text-white flex items-center justify-center w-full min-h-[30vh] opacity-40 mb-10">
          No Favourite Books
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favoriteBook &&
          favoriteBook.map((items, i) => (
            <div key={i}>
              <BookCard data={items} favourite="true" />
            </div>
          ))}
      </div>
    </>
  );
};

export default Favorites;
