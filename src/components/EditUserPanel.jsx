import React, { useEffect, useState } from "react";
import signInBtn from "../assets/images/Button.png";
import { BiLoaderCircle } from "react-icons/bi";
import showToast from "../utils/toastUtils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaPlus } from "react-icons/fa";
import { fetchUsers } from "../data/api/calls";
import "../index.css";

const EditUserPanel = ({ setShowEditUserPanel, setReloadUsersData, props }) => {
  console.log("props", props);
  const userType = props.accountType.toLowerCase();

  const [formData, setFormData] = useState({
    email: props.email || "",
    password: "",
    firstName: props.firstName || "",
    lastName: props.lastName || "",
    confirmPassword: "",
    gAppId: "2",
    agreeToTerms: false,
    accountType: props.accountType || "",
    package: props.package || "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setIsLoading(true);
  //       const userData = await fetchUsers(userType, userId);

  //       if (userData) {
  //         // Update the formData state with the retrieved user data
  //         setFormData({
  //           email: userData.email || "",
  //           firstName: userData.firstName || "",
  //           lastName: userData.lastName || "",
  //           gAppId: userData.gAppId || "2",
  //           agreeToTerms: userData.agreeToTerms || false,
  //           accountType: userType,
  //           package: userType === "reseller" ? "FE" : "",
  //         });
  //       } else {
  //         // Handle case when user data is not found
  //         console.error(`User with ID ${userId} not found`);
  //       }
  //     } catch (error) {
  //       // Handle error fetching user data
  //       console.error('Error fetching user data:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [userType, userId]);

  // Validation functions
  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Invalid email format";
    }

    // if (!formData.password) {
    //   errors.password = "Password is required";
    // } else if (formData.password.length < 8) {
    //   errors.password = "Password must be at least 8 characters";
    // }

    if (!formData.firstName) {
      errors.firstName = "First Name is required";
    }

    if (!formData.lastName) {
      errors.lastName = "Last Name is required";
    }

    // if (!formData.confirmPassword) {
    //   errors.confirmPassword = "Confirm Password is required";
    // } else if (formData.confirmPassword !== formData.password) {
    //   errors.confirmPassword = "Passwords do not match";
    // }

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
        const response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/updateUser/${props.id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.REACT_APP_X_API_KEY,
            },
          },
        );

        const data = response.data;
        console.log("Update user response", data);
        if (data.success) {
          showToast("success", data.message, 3000);
          setShowEditUserPanel(false);
          setReloadUsersData(true);
        } else {
          showToast("error", "Couldn't update user account", 3000);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error updating user:", error);
        showToast("error", `Couldn't update user account`, 3000);
        setIsLoading(false);
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", zIndex: 9999 }}
    >
      <div className="bg-white w-2/6 p-5 rounded-md">
        <div className="flex justify-between">
          <div></div>
          <span
            className="text-right text-xs rounded-full h-5 w-5 flex justify-end m-auto cursor-pointer"
            style={{
              background:
                "linear-gradient(210.54deg, #9999FF 7.79%, #4B49AC 92.58%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setShowEditUserPanel(false);
            }}
          >
            X
          </span>
        </div>
        <div className="mt-12 flex flex-col items-center">
          <h1 className="text-xl xl:text-3xl font-extrabold">Update Account</h1>
          <div
            className="flex gap-2 w-full justify-center mt-3 py-2 px-4 rounded-full"
            style={{ backgroundColor: "#F3F4F6" }}
          >
            <div className="text-xs mb-1 ml-1 text-gray-500">
              Account Type :
            </div>
            <span className="text-xs font-medium text-gray-900">
              {userType.toUpperCase()}
            </span>
          </div>
          <div className="w-full flex-1 mt-8">
            <div className="mx-auto max-w-xs">
              <div className="flex items-center gap-3 justify-between">
                {/* {validationErrors.firstName && (
                  <div className="text-red-500 text-sm mb-1">
                    {validationErrors.firstName}
                  </div>
                )} */}
                <div className="flex flex-col">
                  <div className="text-xs mb-1 ml-1 text-gray-500">
                    First Name
                  </div>
                  <input
                    className={`w-full px-8 mb-5 py-4 rounded-full font-medium text-xs bg-gray-100 border ${
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

                {/* {validationErrors.lastName && (
                  <div className="text-red-500 text-sm mb-1">
                    {validationErrors.lastName}
                  </div>
                )} */}
                <div className="flex flex-col">
                  <div className="text-xs mb-1 ml-1 text-gray-500">
                    Last Name
                  </div>
                  <input
                    className={`w-full px-8 py-4 mb-5 rounded-full font-medium bg-gray-100 border text-xs ${
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
              </div>

              {userType === "reseller" && (
                <>
                  <div className="text-xs mb-1 ml-1 text-gray-500">
                    Select Package
                  </div>
                  <select
                    className="w-full px-8 py-4 mb-5 rounded-full font-medium bg-gray-100 border text-xs focus:outline-none focus:border-gray-400 focus:bg-white"
                    value={formData.package}
                    onChange={(e) =>
                      setFormData({ ...formData, package: e.target.value })
                    }
                  >
                    <option value="FE">FE</option>
                    <option value="OTO1">OTO1</option>
                    <option value="OTO2">OTO2</option>
                    <option value="OTO3">OTO3</option>
                    <option value="OTO4">OTO4</option>
                  </select>
                </>
              )}

              <div className="text-xs mb-1 ml-1 text-gray-500">
                Select Account Type
              </div>
              <select
                className="w-full px-8 py-4 mb-5 rounded-full font-medium bg-gray-100 border text-xs focus:outline-none focus:border-gray-400 focus:bg-white"
                value={formData.accountType}
                onChange={(e) =>
                  setFormData({ ...formData, accountType: e.target.value })
                }
              >
                <option value="bundle">Bundle</option>
                <option value="premium">Premium</option>
                <option value="reseller">Reseller</option>
              </select>

              {/* {validationErrors.email && (
                  <div className="text-red-500 text-sm mb-1">
                    {validationErrors.email}
                  </div>
                )} */}
              <div className="text-xs mb-1 ml-1 text-gray-500">Email</div>
              <input
                readOnly
                className={`w-full px-8 py-4 mb-5 rounded-full font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-gray-400 focus:bg-white  ${
                  validationErrors.email ? "border-red-500" : "border-gray-200"
                }`}
                type="email"
                placeholder="youremail@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <div className="flex items-center gap-3 justify-between">
                {/* {validationErrors.password && (
                    <div className="text-red-500 text-sm mb-1">
                      {validationErrors.password}
                    </div>
                  )} */}
                <div className="flex flex-col">
                  <div className="text-xs mb-1 ml-1 text-gray-500">
                    Password
                  </div>
                  <div className="relative">
                    <input
                      className={`w-full px-8 mb-5 py-4 rounded-full font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-gray-400 focus:bg-white ${
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
                        <FaEyeSlash color="#7438FF" />
                      ) : (
                        <FaEye color="#7438FF" />
                      )}
                    </span>
                  </div>
                </div>

                {/* {validationErrors.confirmPassword && (
                    <div className="text-red-500 text-sm mb-1">
                      {validationErrors.confirmPassword}
                    </div>
                  )} */}
                <div className="flex flex-col">
                  <div className="text-xs mb-1 ml-1 text-gray-500">
                    Confirm Password
                  </div>
                  <div className="relative">
                    <input
                      className={`w-full px-8 mb-5 py-4 rounded-full font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-gray-400 focus:bg-white ${
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
                        <FaEyeSlash color="#7438FF" />
                      ) : (
                        <FaEye color="#7438FF" />
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-start mb-5">
                <label className="flex items-center cursor-pointer">
                  <input
                    className="w-4 h-4 mr-2 cursor-pointer text-xs"
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
                    className={`text-xs font-medium ${
                      validationErrors.agreeToTerms
                        ? "text-red-500"
                        : "text-gray-900"
                    }`}
                  >
                    I agree to abide by Tubedominator's Terms of Service
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between">
                  <button
                    className={`text-white rounded-md px-4 py-2 ml-4 flex items-center text-xs getIdeasBtn`}
                    style={{
                      background: "var(--special-background)",
                      // filter: `${
                      //   formData.email === "" ||
                      //   formData.password === "" ||
                      //   formData.confirmPassword === ""
                      //     ? "grayscale(1)"
                      //     : ""
                      // }`,
                    }}
                    onClick={handleSubmit}
                  >
                    <FaPlus className="mr-2" color="white" />
                    {"Update Account"}
                  </button>
                  {isLoading && (
                    <BiLoaderCircle
                      className="animate-spin text-center ml-3"
                      color="#9999FF"
                      size={20}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserPanel;
