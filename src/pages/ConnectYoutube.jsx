import { useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import appLogo from "../assets/images/TubeDominator 1000x1000.png";
import pagePic from "../assets/images/3d-youtube-logo-silver-stand-with-dark-logos-background.jpg";
import GoogleLoginComp from "./UserAuth/GoogleLogin";
import { NavLink } from "react-router-dom";
import accountIllus from "../assets/images/brand loyalty-rafiki.png";
import homeBg from "../assets/images/homeBg.png";
import youtubeIllus from "../assets/images/HomeImage2.png";

const ConnectYoutube = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation logic goes here
    // For instance:
    if (!formData.email) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
      return;
    }
    if (!formData.password) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));
      return;
    }

    // If validation passes, perform login or sign up action
    // This is a mock representation of a successful login:
    console.log("Login successful!");
  };

  return (
    // <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
    <div
      className="w-full h-screen bg-gray-100 text-gray-900 flex justify-center"
      style={{ backgroundImage: `url(${homeBg})`, backgroundSize: "cover" }}
    >
      <div className="w-full flex-1 mt-8">
        <div className="flex flex-col items-center">
          {/* <button className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
            <div className="bg-white p-2 rounded-full">
              <svg className="w-4" viewBox="0 0 533.5 544.3">
                <path
                  d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                  fill="#4285f4"
                />
              </svg>
            </div>
            <span className="ml-4">Sign Up with Google</span>
          </button> */}
          {/* <div>
                <div className="-mb-24 ml-8 opacity-0">
                  <GoogleLoginComp />
                </div>
                <NavLink
                  to={``}
                  className="flex items-center ml-6 mt-10 px-5 py-3 rounded-md"
                  style={{ backgroundColor: "#7438FF" }}
                >
                  <div className="mr-3">
                    <FcGoogle size={20} />
                  </div>
                  <div className="capitalize pr-4 text-white">
                    Connect your Youtube
                  </div>
                </NavLink>
              </div> */}
        </div>
        <div className="my-12 text-center">
          <div
            className="leading-none px-2 inline-block text-2xl whitespace-normal w-1/2 text-black font-extrabold tracking-wide transform translate-y-1/2"
            style={{ lineHeight: "30px" }}
          >
            One more step to power up Your Youtube Channel with TubeDominator's
            awesome features
          </div>
        </div>
        <div className="mx-auto max-w-xs">
          {/* <input
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            type="email"
            placeholder="Email"
          />
          <input
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
            type="password"
            placeholder="Password"
          /> */}
          {/* <button className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
            <svg
              className="w-6 h-6 -ml-2"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            </svg>
            <span className="ml-3">Sign Up</span>
          </button> */}
          <div>
            <img
              src={accountIllus}
              alt="Sales magnet illustration"
              className="mb-5"
            />
          </div>

          <div>
            <div className="-mb-24 ml-8 opacity-0">
              <GoogleLoginComp />
            </div>
            <NavLink
              to={``}
              className="flex items-center ml-6 mt-10 px-5 py-3 rounded-md"
              style={{
                background:
                  "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                color: "white",
              }}
            >
              <div className="mr-3">
                <FcGoogle size={20} />
              </div>
              <div className="capitalize pr-4 text-white">
                Connect your Youtube
              </div>
            </NavLink>
          </div>

          {/* <p className="mt-6 text-xs text-gray-600 text-center">
            I agree to abide by templatana's
            <a href="#" className="border-b border-gray-500 border-dotted">
              Terms of Service
            </a>
            and its
            <a href="#" className="border-b border-gray-500 border-dotted">
              Privacy Policy
            </a>
          </p> */}
        </div>
                  
      </div>
      {/* <div className="max-w-screen-xl w-1/2 m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 flex flex-col justify-center items-center">
          <div>
            <img src={appLogo} className="w-10 mx-auto" alt="logo" />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Login</h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                <div className="flex flex-col items-center">
                <button className="w-full max-w-xs font-bold px-10 shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                  <div className="bg-white p-2 rounded-full">
                    <FcGoogle />
                  </div>
                  <span className="ml-4">
                    Sign Up with Google
                  </span>
                </button>
              </div>
              </div>
            </div>
          </div>
        </div> */}
      {/* <div className="flex-1 text-center hidden lg:flex" style={{backgroundColor: "#8584E9", backgroundImage: `url(${pagePic})`}}>
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default ConnectYoutube;
