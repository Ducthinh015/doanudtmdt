import { Link } from "react-router-dom";
import Chatbot from "../Chatbot/Chatbot";

const Hero = () => {
  return (
    <div className="min-h-[75vh] flex justify-center items-center px-4 py-8">
      <div className="w-full md:w-4/6 lg:w-3/6 flex flex-col justify-center items-center gap-6 font-sans text-center">
        <h1 className="text-md md:text-5xl lg:text-4xl  text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
          Discover Your Next Read!
        </h1>
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-xs md:text-lg lg:text-sm drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] mb-5">
            Discover a world of stories with our online book platform.
            <br />
            Dive into your favorite genres, explore new authors,
            <br />
            and read books anytime, anywhere.
          </p>

          <Link
            to="/all-books"
            className="text-black bg-white text-base md:text-sm lg:text-sm font-semibold border-2 px-4 md:px-10 py-2 md:py-2 rounded-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-in-out hover:scale-105 hover:text-white hover:bg-transparent"
          >
            Discover Books
          </Link>
        </div>
      </div>
      {/* <div className="absolute bottom-4 right-4 z-50">
        <Chatbot />
      </div> */}
    </div>
  );
};

export default Hero;
