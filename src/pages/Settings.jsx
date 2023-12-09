import React, { useState } from "react";
import profileImage from "../assets/images/demoUserImage.png";
import axios from "axios";
import showToast from "../utils/toastUtils";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BiLoaderCircle } from "react-icons/bi";
import { IoCloudUploadSharp } from "react-icons/io5";

function Settings() {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const [userProfile, setUserProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  });

  const [isLoading, setIsLoading] = useState(false);

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

  // Handler for updating profile information
  const handleUpdateProfile = () => {
    // Implement logic to update the user's profile information (API call, etc.)
    // For now, we'll just log the updated profile to the console
    console.log("Updated Profile:", userProfile);
  };

  // Handler for handling form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 rounded-md overflow-hidden min-h-screen">
      <div className="">
        <div className="pageTitle text-3xl font-semibold">Profile Settings</div>
        <div className="tag text-md mt-2 text-xs font-thin">
          Update your Profile Details
        </div>
      </div>

      <header
        className="flex items-center py-5 px-10 rounded-xl mt-8"
        style={{
          background:
            "linear-gradient(90.07deg, #9999FF 0.05%, rgba(153, 153, 255, 0) 98.56%)",
        }}
      >
        <div className="p-3 rounded-lg">
          <img src={profileImage} alt="" className="h-24" />
        </div>
        <div className="text-xl px-4 mr-4">
          <div className="font-semibold">Mikel wanger</div>
          <div className="text-xs">Mikelwanger02@email.com</div>
          <div className="flex items-center gap-2 cursor-pointer p-1 rounded-lg mt-2">
            <Link
              className="text-xs mr-4 py-2 px-5 rounded-md text-black flex items-center"
              to="/sign-up"
              style={{
                backgroundColor: "transparent",
                border: "1px black solid",
              }}
            >
              <IoCloudUploadSharp className="mr-2" />
              Upload Image
            </Link>
            <Link
              className="text-xs mr-4 text-black py-2 px-5 rounded-md"
              to="/sign-in"
              style={{
                background:
                  "linear-gradient(270deg, #FD2E2E 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                color: "white",
              }}
            >
              Delete
            </Link>
            {/* <p>
                <button
                  type="submit"
                  style={{ backgroundColor: "#7438FF" }}
                  className="w-full text-lg text-white py-2 px-5 rounded-full"
                >
                  Talk to an Expert
                </button>
              </p> */}
          </div>
        </div>
      </header>

      <div className="flex items-center gap-3 mt-10">
        <div className="flex flex-col">
          <div className="text-xs mb-1 ml-1 text-gray-400">First Name</div>
          <input
            className={`w-full px-8 mb-5 py-4 rounded-full font-medium text-xs bg-white border ${
              validationErrors.firstName ? "border-red-500" : "border-gray-200"
            } placeholder-gray-500 text-xs focus:outline-none focus:border-gray-400 focus:bg-white`}
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col">
          <div className="text-xs mb-1 ml-1 text-gray-400">Last Name</div>
          <input
            className={`w-full px-8 py-4 mb-5 rounded-full font-medium bg-white border text-xs ${
              validationErrors.lastName ? "border-red-500" : "border-gray-200"
            } placeholder-gray-500 text-xs focus:outline-none focus:border-gray-400 focus:bg-white`}
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </div>

        <div className="flex flex-col">
          <div className="text-xs mb-1 ml-1 text-gray-400">Email</div>
          <input
            className={`w-full px-8 py-4 mb-5 rounded-full font-medium bg-white border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-gray-400 focus:bg-white  ${
              validationErrors.email ? "border-red-500" : "border-gray-200"
            }`}
            type="email"
            placeholder="youremail@email.com"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="text-xs mb-1 ml-1 text-gray-400">Password</div>
          <div className="relative">
            <input
              className={`w-full px-8 mb-5 py-4 rounded-full font-medium bg-white border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-gray-400 focus:bg-white ${
                validationErrors.password ? "border-red-500" : "border-gray-200"
              }`}
              type={showPassword ? "text" : "password"}
              placeholder="********"
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
                <FaEyeSlash color="#9999FF" />
              ) : (
                <FaEye color="#9999FF" />
              )}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-xs mb-1 ml-1 text-gray-400">
            Confirm Password
          </div>
          <div className="relative">
            <input
              className={`w-full px-8 mb-5 py-4 rounded-full font-medium bg-white border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-gray-400 focus:bg-white ${
                validationErrors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
              type={showPassword ? "text" : "password"}
              placeholder="********"
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
                <FaEyeSlash color="#9999FF" />
              ) : (
                <FaEye color="#9999FF" />
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <span
            className="h-7 w-7 rounded-full flex items-center justify-center text-sm cursor-pointer"
            style={{
              background:
                "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
              color: "white",
            }}
          >
            X
          </span>
          <button
            className={`text-white rounded-full px-4 py-2 ml-2 text-xs flex items-center cursor-pointer`}
            // onClick={handleGetIdeas}
            style={{
              background:
                "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
              color: "white",
            }}
          >
            Save{" "}
            {isLoading && (
              <BiLoaderCircle className="ml-2 animate-spin" color="white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
