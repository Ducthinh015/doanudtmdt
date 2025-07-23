import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";
import Newsletter from "../Newsletter/Newsletter";

const RecentlyAdded = () => {
  const [Data, setData] = useState();

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "https://bookcove.onrender.com/api/v1/get-recent-books"
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };
    fetch();
  }, []);

  return (
    <div className="bg-gradient-to-b from-black via-[#0a192f] to-white/70 text-white py-10 px-4 sm:px-6 lg:px-10">
      {/* Heading */}
      <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white mb-10">
        Recently Added Books
      </h4>

      {/* Loader */}
      {!Data && (
        <div className="flex items-center justify-center h-40">
          <Loader />
        </div>
      )}

      {/* Book Grid */}
      {Data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {Data.map((items, i) => (
            <div key={i}>
              <BookCard data={items} />
            </div>
          ))}
        </div>
      )}

      {/* Newsletter Section */}
      <div className="mt-12">
        <Newsletter />
      </div>
    </div>
  );
};

export default RecentlyAdded;
