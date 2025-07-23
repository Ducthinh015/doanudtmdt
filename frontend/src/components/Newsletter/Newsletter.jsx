import React from "react";

const Newsletter = () => {
  return (
    <div className="flex justify-center items-center h-96 p-4">
      <div className="w-full max-w-3xl rounded-3xl p-8 backdrop-blur-lg bg-white/30 shadow-lg border border-white/20 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#0a192f] mb-4">
          Subscribe our newsletter for newest books updates
        </h2>

        <form className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
          <input
            type="email"
            placeholder="Type your email here"
            className="px-4 py-3 w-full md:w-2/3 rounded-full bg-white/70 backdrop-blur-sm placeholder-gray-600 text-gray-800 focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-white text-[#0a192f] font-semibold hover:bg-[#0a192f] hover:text-white transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
