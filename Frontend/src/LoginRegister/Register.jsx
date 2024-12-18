import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
function Register() {
  const navigate = useNavigate();
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailExist, setEmailexist] = useState(false);
  const [showRequiredfilled, setRequiredFilled] = useState(false);
  const [pass, setPass] = useState(false);
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
        email,
        password,
      };
      const { data } = await axios.post(URL + "/register", register);
      if (data.status == false) {
        toast(data.message, toastStyle);
      }
      if (data.status == true) {
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        navigate("/setAvatar");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleValidation = (event) => {
    if (password !== confirmPassword) {
      toast.error("Password mismaatch", toastStyle);
      return false;
    } else if (username.length < 4) {
      toast.error("username should be gretar than or equal 4", toastStyle);
      return false;
    }
  };
  setTimeout(() => {
    setEmailexist(false);
    setRequiredFilled(false);
    setPass(false);
  }, 5000);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="max-w-md w-full bg-gray-200 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8">
          Create Account here{" "}
        </h2>
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
          <div className="mb-4">
            <label
              className="block text-gray-700 text-lg font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight  outline-black"
              placeholder="Enter your email"
            />
          </div>
          <div className="mt-1">
            {emailExist && (
              <p className="text-red-600">
                Email already exist try with different account !!{" "}
              </p>
            )}
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
          <div className="mb-4 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight  outline-black"
              placeholder="Confirm password here "
            />
          </div>

          <div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 mx-20 rounded focus:outline-none focus:shadow-outline"
            >
              Create Account
            </button>
          </div>
          {showRequiredfilled && (
            <p className="text-red-600 mx-14">
              Please fill all required filled{" "}
            </p>
          )}
          {pass && (
            <p className="text-red-600 mx-14">
              Password should be greater than 5{" "}
            </p>
          )}
          <div className="text-xl mt-6 text-teal-600">
            if u have already account
            <Link
              to="/login"
              className="px-2 text-green-400 hover:text-green-500"
            >
              Login
            </Link>
            here
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Register;
