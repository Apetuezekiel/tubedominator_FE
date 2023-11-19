import { useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import appLogo from "../../assets/images/TubeDominator 1000x1000.png";
import loginIcon from "../../assets/images/Mobile-login-pana.png";
import showToast from "../../utils/toastUtils";
import axios from "axios";
import { BiLoaderCircle } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useUserAccessLevel, useUserLoggedin } from "../../state/state";
import {
  getUserEncryptedDataFromDb,
  isChannelRegistered,
} from "../../data/api/calls";

const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });

  const userLoggedIn = useUserLoggedin((state) => state.userLoggedIn);
  const setUserLoggedIn = useUserLoggedin((state) => state.setUserLoggedIn);
  const accessLevel = useUserAccessLevel((state) => state.accessLevel);
  const setAccessLevel = useUserAccessLevel((state) => state.setAccessLevel);

  const handleSubmit = async (e) => {
    setIsLoading(true);
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

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/sign-in`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
          },
        },
      );

      const data = response.data;
      if (data.success) {
        showToast("success", data.message, 3000);
        setIsLoading(false);
        console.log("Data0", data);
        const gId = data.user_id ? data.user_id.split("_")[1] : null;

        gId && (await getUserEncryptedDataFromDb(gId));

        const channelRegistered = data.user_id
          ? await isChannelRegistered(data.user_id)
          : null;
        channelRegistered
          ? localStorage.setItem("accessLevel", "L2")
          : localStorage.setItem("accessLevel", data.accessLevel);
        localStorage.setItem("userLoggedin", true);
        localStorage.setItem("userRecordId", data.userRecordId);
        localStorage.setItem("userFirstName", data.firstName);
        setAccessLevel(localStorage.getItem("accessLevel"));
        setUserLoggedIn(true);
        navigate("/ideation");
      } else {
        showToast("error", data.message, 3000);
        setLoginError(true);
        setIsLoading(false);
      }
    } catch (error) {
      setLoginError(true);
      console.error("Error Logging User in:", error);
      showToast("error", `Couldn't Log you in`, 3000);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl w-1/2 m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 flex flex-col justify-center items-center">
          <div>
            <img src={appLogo} className="w-10 mx-auto" alt="logo" />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Login</h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                {validationErrors.email && (
                  <div className="text-red-500 text-sm mb-1">
                    {validationErrors.email}
                  </div>
                )}
                <input
                  className={`w-full px-8 mb-5 py-4 rounded-lg font-medium bg-gray-100 border ${
                    validationErrors.email
                      ? "border-red-500"
                      : "border-gray-200"
                  } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />

                {validationErrors.password && (
                  <div className="text-red-500 text-sm mb-1">
                    {validationErrors.password}
                  </div>
                )}
                <input
                  className={`w-full px-8 py-4 mb-5 rounded-lg font-medium bg-gray-100 border ${
                    validationErrors.password
                      ? "border-red-500"
                      : "border-gray-200"
                  } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />

                <button
                  className={`mt-5 tracking-wide font-semibold text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                    (formData.email === "" || formData.password === "") &&
                    "cursor-not-allowed"
                  }`}
                  style={{
                    backgroundColor: `${
                      formData.email === "" || formData.password === ""
                        ? "#E0E0E0"
                        : "#7438FF"
                    }`,
                  }}
                  onClick={handleSubmit}
                  disabled={formData.email === "" || formData.password === ""}
                >
                  <span>
                    <MdAccountCircle size={20} color="white" />
                  </span>
                  <span className="ml-3">Login</span>
                  {isLoading && (
                    <BiLoaderCircle
                      className="animate-spin text-center ml-3"
                      color="white"
                      size={20}
                    />
                  )}
                </button>
                {loginError && (
                  <div className="text-red-500 text-sm mt-4">
                    Incorrect email or password. Please try again.
                  </div>
                )}
                <div className="my-12 border-b text-center">
                  <Link
                    to="/sign-up"
                    className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2"
                  >
                    Or Sign Up Here
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
            style={{ backgroundImage: `url(${loginIcon})` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
