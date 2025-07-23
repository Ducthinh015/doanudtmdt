import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";

const Settings = () => {
  const [value, setValue] = useState({ address: "" });
  const [profileData, setProfileData] = useState();

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
    id: localStorage.getItem("id"),
  };
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        "https://bookcove.onrender.com/api/v1/get-user-information",
        { headers }
      );

      setProfileData(response.data);
      setValue({ address: response.data.address });
    };
    fetch();
  }, []);

  const change = (e) => {
    const { name, value } = e.target;
    setValue({ ...value, [name]: value });
  };

  const submitAddress = async () => {
    const response = await axios.put(
      "http://localhost:1000/api/v1/update-address",
      value,
      { headers }
    );
    console.log(response);
    alert(response.data.message);
  };
  return (
    <>
      {!profileData && (
        <div className="w-full h-[100%] flex items-center justify-center">
          <Loader />
        </div>
      )}

      {profileData && (
        <div className="w-full min-h-screen flex flex-col items-center pt-10 px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white uppercase mb-12 text-center">
            Settings
          </h1>

          <div className="w-full max-w-3xl border-2 bg-transparent shadow-xl rounded-2xl p-8 space-y-8">
            {/* Username and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="drop-shadow-md font-semibold block text-white mb-2">
                  Username
                </label>
                <p className="p-3 backdrop-blur-sm rounded bg-transparent border-2 text-white font-semibold">
                  {profileData.username}
                </p>
              </div>

              <div>
                <label className="drop-shadow-md font-semibold text-white block mb-2">
                  Email
                </label>
                <p className="p-3 rounded backdrop-blur-sm bg-transparent border-2 text-white font-semibold">
                  {profileData.email}
                </p>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="drop-shadow-md font-semibold text-white block mb-2">
                Address
              </label>
              <textarea
                className="w-full p-3  rounded bg-transparent border-2 text-white font-semibold backdrop-blur-sm"
                rows={5}
                placeholder="Address"
                name="address"
                value={value.address}
                onChange={change}
              />
            </div>

            {/* Update Button */}
            <div className="flex justify-end">
              <button
                onSubmit={submitAddress}
                className="bg-yellow-700 text-white font-semibold px-6 py-2 rounded hover:bg-black transition duration-300"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;
