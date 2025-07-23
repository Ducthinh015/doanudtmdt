import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";
// import About from "../../pages/About";
import Newsletter from "../Newsletter/Newsletter";

// const items = [
//   {
//     id: "1",
//     img: "https://picsum.photos/id/1015/600/900?grayscale",
//     url: "https://example.com/one",
//     height: 400,
//   },
//   {
//     id: "2",
//     img: "https://picsum.photos/id/1011/600/750?grayscale",
//     url: "https://example.com/two",
//     height: 250,
//   },
//   {
//     id: "3",
//     img: "https://picsum.photos/id/1020/600/800?grayscale",
//     url: "https://example.com/three",
//     height: 600,
//   },
//   {
//     id: "4",
//     img: "https://picsum.photos/id/1015/600/900?grayscale",
//     url: "https://example.com/one",
//     height: 400,
//   },
//   {
//     id: "5",
//     img: "https://picsum.photos/id/1015/600/900?grayscale",
//     url: "https://example.com/one",
//     height: 400,
//   },
//   {
//     id: "6",
//     img: "https://picsum.photos/id/1015/600/900?grayscale",
//     url: "https://example.com/one",
//     height: 400,
//   },
//   {
//     id: "7",
//     img: "https://picsum.photos/id/1015/600/900?grayscale",
//     url: "https://example.com/one",
//     height: 400,
//   },
//   {
//     id: "8",
//     img: "https://picsum.photos/id/1015/600/900?grayscale",
//     url: "https://example.com/one",
//     height: 400,
//   },
//   {
//     id: "9",
//     img: "https://picsum.photos/id/1015/600/900?grayscale",
//     url: "https://example.com/one",
//     height: 400,
//   },
//   {
//     id: "9",
//     img: "https://picsum.photos/id/1015/600/900?grayscale",
//     url: "https://example.com/one",
//     height: 400,
//   },
//   {
//     id: "10",
//     img: "https://picsum.photos/id/1015/600/900?grayscale",
//     url: "https://example.com/one",
//     height: 400,
//   },
// ];
const RecentlyAdded = () => {
  const [Data, setData] = useState();

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "http://localhost:1000/api/v1/get-recent-books"
      );
      setData(response.data.data);
    };
    fetch();
  }, []);

  return (
    <div className="h-[130vh] bg-cover bg-center text-white py-8 px-4 bg-gradient-to-b from-black via-[#0a192f] to-text-white/70">
      <h4 className="mb-10 text-2xl md:text-3xl lg:text-4xl text-white text-center font-bold">
        Recently added books
      </h4>

      {!Data && (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      )}
      <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Data &&
          Data.map((items, i) => (
            <div key={i}>
              <BookCard data={items} />
            </div>
          ))}
      </div>
      <div>
        {/* <About
          items={items}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={0.95}
          blurToFocus={true}
          colorShiftOnHover={false}
        /> */}
        <Newsletter />
      </div>
    </div>
  );
};

export default RecentlyAdded;
