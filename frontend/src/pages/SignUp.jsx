import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [Values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });
  const navigate = useNavigate();
  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    console.log("submit");
    try {
      if (
        Values.username === "" ||
        Values.email === "" ||
        Values.password === "" ||
        Values.address === ""
      ) {
        alert("All fields are required");
      } else {
        const response = await axios.post(
          "http://localhost:1000/api/v1/sign-up",
          Values
        );
        console.log(response);
        alert(response.data.message);
        navigate("/LogIn");
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="w-1/2 hidden md:flex items-center justify-center bg-gray-100">
        <img
          src="../public/images/signup.visual.webp"
          alt="Signup Visual"
          className="object-cover h-full w-full"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="max-w-md w-full space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Create an Account
          </h2>

          <form className="space-y-4" onSubmit={submit}>
            <div>
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkbrown"
                name="username"
                placeholder="Username"
                required
                value={Values.username}
                onChange={change}
              />
            </div>
            <div>
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkbrown"
                name="email"
                placeholder="Email"
                value={Values.email}
                onChange={change}
                required
              />
            </div>
            <div>
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkbrown"
                name="password"
                placeholder="Password"
                value={Values.password}
                onChange={change}
                required
              />
            </div>

            <div>
              <label
                htmlFor=""
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <textarea
                rows="5"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-darkbrown"
                name="address"
                placeholder="Address"
                required
                value={Values.address}
                onChange={change}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-darkbrown text-white rounded-md hover:bg-darkbrown/95 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm text-gray-600">
            Already have an account?
            <Link
              to="/login"
              className="text-darkbrown font-semibold hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
