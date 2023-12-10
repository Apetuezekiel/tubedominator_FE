/* eslint-disable */
import React, { useEffect, useState } from "react";
import axios from "axios";
import showToast from "../utils/toastUtils";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BiLoaderCircle } from "react-icons/bi";
import { IoCloudUploadSharp } from "react-icons/io5";
import { checkClientAndApiKey, fetchUser } from "../data/api/calls";
import Loader from "../components/Loader";
import userAvatar from "../assets/images/man-avatar-profile-picture-vector-illustration_268834-538.avif";
import { useUserGoogleCreds } from "../state/state";
import { FiCamera } from "react-icons/fi";

function Settings() {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
    thumbnail: ""
  });
  const [formDataGoogleCreds, setFormDataGoogleCreds] = useState({
    apiKey: "",
    ClientId: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [loadingUserDataFailed, setLoadingUserDataFailed] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fetchedUserData, setFetchUserData] = useState(false);
  const isGoogleCreds = useUserGoogleCreds(
    (state) => state.isGoogleCreds,
  );
  const setIsGoogleCreds = useUserGoogleCreds(
    (state) => state.setIsGoogleCreds,
  );

  const [userProfile, setUserProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    apiKey: "Youtube API Key",
    ClientId: "Youtube API Client ID",
    email: "john.doe@example.com",
  });

  useEffect(() => {
    setLoadingUserData(true);
    const fetchData = async () => {
      try {
        const fetchedUser = await fetchUser();
        setFetchUserData(fetchedUser);
        setFormData((prevFormData) => ({
          ...prevFormData,
          email: fetchedUser.email,
          firstName: fetchedUser.firstName,
          apiKey: fetchedUser.apiKey,
          ClientId: fetchedUser.ClientId,
          lastName: fetchedUser.lastName,
        }));
        setFormDataGoogleCreds((prevFormData) => ({
          ...prevFormData,
          apiKey: fetchedUser.apiKey,
          ClientId: fetchedUser.ClientId,
        }));
        setLoadingUserData(false);

        console.log("fetched user data: ", fetchedUser);
      } catch (error) {
        setLoadingUserData(false);

        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [loadingUserDataFailed]);

  const [isLoading, setIsLoading] = useState({
    accData: false,
    googleCreds: false,
  });

  const validateForm = (type) => {
    const errors = {};

    if (type === "accData") {
      if (!formData.email) {
        errors.email = "Email is required";
      } else if (!isValidEmail(formData.email)) {
        errors.email = "Invalid email format";
      }
      
      if (formData.password && formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
  
      if (!formData.firstName) {
        errors.firstName = "First Name is required";
      }
  
      if (!formData.lastName) {
        errors.lastName = "Last Name is required";
      }
  
      if (formData.confirmPassword || formData.password && formData.confirmPassword !== formData.password) {
         errors.confirmPassword = "Passwords do not match";
       }
    }

    if (type === "googleCreds"){
      if (!formDataGoogleCreds.apiKey) {
        errors.apiKey = "Please provide your google api key ";
      }
  
      if (!formDataGoogleCreds.ClientId) {
        errors.ClientId = "Please provide your google Client ID ";
      }
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const resetFormData = (type) => {
    if (type === "accData"){
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        confirmPassword: "",
      });
    }
    if (type === "googleCreds"){
      console.log("Got here. I should delete");
      setFormDataGoogleCreds({
        apiKey: "",
        ClientId: "",
      });
    }
  };

  const handleSave = async (type) => {
    if (validateForm(type)) {
      setIsLoading((prevLoading) => ({ ...prevLoading, [type]: true }));
  
      try {
        let postData;
        let url = `${process.env.REACT_APP_API_BASE_URL}/saveUser`;
  
        if (type === "accData") {
          postData = formData;
        } else if (type === "googleCreds") {
          postData = {
            ...formDataGoogleCreds,
            email: localStorage.getItem("userRegEmail"),
          };
        }
  
        const response = await axios.post(
          url,
          postData,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.REACT_APP_X_API_KEY,
            },
          },
        );
  
        const data = response.data;
        console.log("updated user data response", data);
        if (data.success) {
          showToast("success", `Account updated successfully`, 3000);
  
          if (type === "googleCreds") {
            localStorage.setItem("ClientId", formDataGoogleCreds.ClientId);
            localStorage.setItem("apiKey", formDataGoogleCreds.apiKey);
            const clientAndApiKey = await checkClientAndApiKey();
            setIsGoogleCreds(clientAndApiKey);
          }

          if (type === "accData") {
            localStorage.setItem("firstName", formData.firstName);
            localStorage.setItem("lastName", formData.lastName);
            localStorage.setItem("userFullName", `${formData.firstName} ${formData.lastName}`);
            localStorage.setItem("userRegEmail", formData.email);
          }
  
          setIsLoading((prevLoading) => ({ ...prevLoading, [type]: false }));
        } else {
          showToast("error", "Couldn't update your account details", 3000);
          setIsLoading((prevLoading) => ({ ...prevLoading, [type]: false }));
        }
      } catch (error) {
        console.error("Error updating User details:", error);
        showToast("error", `Couldn't update your account details`, 3000);
        setIsLoading((prevLoading) => ({ ...prevLoading, [type]: false }));
        setLoadingUserDataFailed(true);
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

    // Read the image file and convert it to Base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result;
      setFormData({ ...formData, thumbnail: base64String });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 rounded-md overflow-hidden min-h-screen">
      <div className="">
        <div className="pageTitle text-3xl font-semibold">Profile Settings</div>
        <div className="tag text-md mt-2 text-xs font-thin">
          Update your Profile Details
        </div>
      </div>

      {loadingUserData ? (
        <Loader message={"Loading your account info. Hold on"} />
      ) : (
        <div>
          <header
            className="flex items-center py-5 px-10 rounded-xl mt-8"
            style={{
              background:
                "linear-gradient(90.07deg, #9999FF 0.05%, rgba(153, 153, 255, 0) 98.56%)",
            }}
          >
            <div className="p-3 rounded-lg">
              <img src={selectedImage && URL.createObjectURL(selectedImage) || userAvatar} alt="" className="h-24 w-24 rounded-full" />
            </div>
            <div className="text-xl px-4 mr-4">
              <div className="font-semibold">{fetchedUserData.fullName}</div>
              <div className="text-xs">{fetchedUserData.email}</div>
              <div className="flex items-center gap-2 cursor-pointer p-1 rounded-lg mt-2">
                <label
                  className="relative text-xs mr-4 py-2 px-5 rounded-md text-black flex items-center"
                  style={{
                    backgroundColor: "transparent",
                    border: "1px black solid",
                  }}
                >
                  <IoCloudUploadSharp className="mr-2" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </label>
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
              </div>
            </div>
          </header>

          <div className="flex items-center gap-3 mt-10">
            <div className="flex flex-col">
              <div className="text-xs mb-1 ml-1 text-gray-400">First Name</div>
              <input
                className={`w-full px-8 mb-5 py-4 rounded-full font-medium text-xs bg-white border ${
                  validationErrors.firstName
                    ? "border-red-500"
                    : "border-gray-200"
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
                  validationErrors.lastName
                    ? "border-red-500"
                    : "border-gray-200"
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
                value={formData.email}
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
                    validationErrors.password
                      ? "border-red-500"
                      : "border-gray-200"
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
                onClick={() => resetFormData("accData")}
              >
                X
              </span>
              <button
                className={`text-white rounded-full px-4 py-2 ml-2 text-xs flex items-center cursor-pointer`}
                onClick={() => handleSave("accData")}
                style={{
                  background:
                    "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                  color: "white",
                }}
              >
                Save{" "}
                {isLoading.accData && (
                  <BiLoaderCircle className="ml-2 animate-spin" color="#9999FF" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-10">
            <div className="flex flex-col">
              <div className="text-xs mb-1 ml-1 text-gray-400">
                Google Client ID
              </div>
              <input
                className={`w-full px-8 mb-5 py-4 rounded-full font-medium text-xs bg-white border ${
                  validationErrors.ClientId
                    ? "border-red-500"
                    : "border-gray-200"
                } placeholder-gray-500 text-xs focus:outline-none focus:border-gray-400 focus:bg-white`}
                type="text"
                placeholder="Your Client ID"
                value={formDataGoogleCreds.ClientId}
                onChange={(e) =>
                  setFormDataGoogleCreds({ ...formDataGoogleCreds, ClientId: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <div className="text-xs mb-1 ml-1 text-gray-400">
                Google API key
              </div>
              <input
                className={`w-full px-8 py-4 mb-5 rounded-full font-medium bg-white border text-xs ${
                  validationErrors.apiKey ? "border-red-500" : "border-gray-200"
                } placeholder-gray-500 text-xs focus:outline-none focus:border-gray-400 focus:bg-white`}
                type="text"
                placeholder="Your API Key"
                value={formDataGoogleCreds.apiKey}
                onChange={(e) =>
                  setFormDataGoogleCreds({ ...formDataGoogleCreds, apiKey: e.target.value })
                }
              />
            </div>

            <div className="flex items-center">
              <span
                className="h-7 w-7 rounded-full flex items-center justify-center text-sm cursor-pointer"
                style={{
                  background:
                    "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                  color: "white",
                }}
                onClick={() => resetFormData("googleCreds")}
              >
                X
              </span>
              <button
                className={`text-white rounded-full px-4 py-2 ml-2 text-xs flex items-center cursor-pointer`}
                onClick={() => handleSave("googleCreds")}
                style={{
                  background:
                    "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                  color: "white",
                }}
              >
                Save{" "}
                {isLoading.googleCreds && (
                  <BiLoaderCircle className="ml-2 animate-spin" color="#9999FF" />
                )}
              </button>
            </div>
          </div>
              <div className="text-xs mb-1 ml-1 text-gray-400">
                how to setup google api key for youtube ?
              </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
