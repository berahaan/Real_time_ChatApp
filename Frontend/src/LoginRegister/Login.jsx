import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
function Login() {
  const navigate = useNavigate();
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  ////////////////////////////////////////////
  const URL = "http://localhost:5000";
  const toastStyle = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      // navigate("/");
    }
  }, []);
  //////////////////////////////////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();
    handleValidation();

    try {
      const register = {
        username,
        password,
      };
      const { data } = await axios.post(URL + "/login", register);
      if (data.status == false) {
        toast(data.message, toastStyle);
      }
      if (data.status == true) {
        localStorage.setItem("chat-app-user", JSON.stringify(data.Userfind));
        navigate("/");
      }
      setName("");
      setPassword("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleValidation = (event) => {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="max-w-md w-full bg-gray-200 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8">Login here </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-lg font-bold mb-2"
              htmlFor="username"
            >
              User name
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight  outline-black "
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight  outline-black"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 mx-20 rounded focus:outline-none focus:shadow-outline"
            >
              Log in
            </button>
          </div>

          <div className="text-xl mt-6 text-teal-600">
            if u don't have already account
            <Link
              to="/register"
              className="px-2 text-green-400 hover:text-green-500"
            >
              create account
            </Link>
            here
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
