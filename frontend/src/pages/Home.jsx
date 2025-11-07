import Hero from "../components/Home/Hero";
import RecentlyAdded from "../components/Home/RecentlyAdded";
import RecentlyViewed from "../components/Home/RecentlyViewed";
import Navbar from "../components/Navbar/Navbar";
const Home = () => {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(/images/bg-img.png)`,
        }}
        className="bg-cover bg-center bg-no-repeat text-white min-h-screen w-full"
      >
        <Navbar />
        <Hero />
      </div>
      <RecentlyAdded />
      <RecentlyViewed />
    </>
  );
};

export default Home;
