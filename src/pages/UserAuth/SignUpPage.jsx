/* eslint-disable */
import { useState } from "react";
import {
  MdAccountCircle,
  MdLock,
  MdPerson,
  MdCheckCircle,
} from "react-icons/md";
import appLogo from "../../assets/images/TubeDominator 1000x1000.png";
import signInIcon from "../../assets/images/Sign-in-rafiki.svg";
import { BiSearch, BiWorld, BiStar, BiLoaderCircle } from "react-icons/bi";
import showToast from "../../utils/toastUtils";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUserAccessLevel, useUserLoggedin } from "../../state/state";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const setUserLoggedIn = useUserLoggedin((state) => state.setUserLoggedIn);
  const accessLevel = useUserAccessLevel((state) => state.accessLevel);
  const setAccessLevel = useUserAccessLevel((state) => state.setAccessLevel);

  // Validation functions
  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!formData.firstName) {
      errors.firstName = "First Name is required";
    }

    if (!formData.lastName) {
      errors.lastName = "Last Name is required";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the terms";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/sign-up`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.REACT_APP_X_API_KEY,
            },
          },
        );

        const data = response.data;
        console.log("Sign up response", data);
        if (data.success) {
          showToast("success", data.message, 3000);
          setIsLoading(false);
          localStorage.setItem("accessLevel", "L1");
          setAccessLevel("L1");
          localStorage.setItem("userLoggedin", true);
          localStorage.setItem("userFirstName", formData.firstName);
          localStorage.setItem("userRecordId", data.userRecordId);
          setUserLoggedIn(true);
          // console.log("Got to the navigation");
          navigate("/");
        } else {
          showToast("error", data.message, 3000);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error Registering User:", error);
        showToast("error", `Couldn't Sign you up`, 3000);
        setIsLoading(false);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl w-1/2 m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <img src={appLogo} className="w-10 mx-auto" alt="logo" />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Create an Account
            </h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                {validationErrors.firstName && (
                  <div className="text-red-500 text-sm mb-1">
                    {validationErrors.firstName}
                  </div>
                )}
                <input
                  className={`w-full px-8 mb-5 py-4 rounded-lg font-medium bg-gray-100 border ${
                    validationErrors.firstName
                      ? "border-red-500"
                      : "border-gray-200"
                  } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />

                {validationErrors.lastName && (
                  <div className="text-red-500 text-sm mb-1">
                    {validationErrors.lastName}
                  </div>
                )}
                <input
                  className={`w-full px-8 py-4 mb-5 rounded-lg font-medium bg-gray-100 border ${
                    validationErrors.lastName
                      ? "border-red-500"
                      : "border-gray-200"
                  } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />

                {validationErrors.email && (
                  <div className="text-red-500 text-sm mb-1">
                    {validationErrors.email}
                  </div>
                )}
                <input
                  className="w-full px-8 py-4 mb-5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Email"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />

                <div>
                  {validationErrors.password && (
                    <div className="text-red-500 text-sm mb-1">
                      {validationErrors.password}
                    </div>
                  )}
                  <div className="relative">
                    <input
                      className="w-full px-8 mb-5 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <span
                      className="absolute top-4 right-3 cursor-pointer"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? (
                        <FaEyeSlash color="#7438FF" />
                      ) : (
                        <FaEye color="#7438FF" />
                      )}
                    </span>
                  </div>

                  {validationErrors.confirmPassword && (
                    <div className="text-red-500 text-sm mb-1">
                      {validationErrors.confirmPassword}
                    </div>
                  )}
                  <div className="relative">
                    <input
                      className="w-full px-8 mb-5 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    <span
                      className="absolute top-4 right-3 cursor-pointer"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? (
                        <FaEyeSlash color="#7438FF" />
                      ) : (
                        <FaEye color="#7438FF" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-start justify-start mb-5">
                  <label className="flex items-center cursor-pointer">
                    <input
                      className="w-4 h-4 mr-2 cursor-pointer"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          agreeToTerms: !formData.agreeToTerms,
                        })
                      }
                    />
                    <span
                      className={`text-sm font-medium ${
                        validationErrors.agreeToTerms
                          ? "text-red-500"
                          : "text-gray-900"
                      }`}
                    >
                      I agree to abide by Tubedominator's Terms of Service
                    </span>
                  </label>
                </div>

                <button
                  className="mt-5 tracking-wide font-semibold text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  style={{ backgroundColor: "#7438FF" }}
                  type="submit"
                  onClick={handleSubmit}
                >
                  <span>
                    <MdAccountCircle size={20} color="white" />
                  </span>
                  <span className="ml-3">Sign Up</span>
                  {isLoading && (
                    <BiLoaderCircle
                      className="animate-spin text-center ml-3"
                      color="white"
                      size={20}
                    />
                  )}
                </button>
                <div className="my-12 border-b text-center">
                  <Link
                    to="/sign-in"
                    className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2"
                  >
                    Or Log in Here
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex-1 text-center hidden lg:flex"
          style={{ backgroundColor: "#8584E9" }}
        >
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${signInIcon})` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
