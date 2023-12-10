import { useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import appLogo from "../../assets/images/TDLogo.png";
import signInBtn from "../../assets/images/ButtonSignIn.png";
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
import makeYoutubeWork from "../../assets/images/We Make YouTube Work for Businesses.png";
import signInAppBanner from "../../assets/images/SignInAppBanner.png";

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
        // showToast("success", data.message, 3000);
        setIsLoading(false);
        // console.log("Data0", data);
        // const gId = data.user_id ? data.user_id.split("_")[1] : null;

        // gId && (await getUserEncryptedDataFromDb(gId));

        // const channelRegistered = data.user_id
        //   ? await isChannelRegistered(data.user_id)
        //   : null;
        // channelRegistered
        //   ? localStorage.setItem("accessLevel", "L2")
        //   : localStorage.setItem("accessLevel", data.accessLevel);
        localStorage.setItem("userLoggedin", true);
        localStorage.setItem("userRecordId", data.userRecordId);
        localStorage.setItem("userFirstName", data.firstName);
        localStorage.setItem("userLastName", data.lastName);
        localStorage.setItem("userRegEmail", formData.email);

        setAccessLevel("L1");
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
        <div className="w-1/2 p-6 flex flex-col justify-center items-center">
          <div>
            <img src={appLogo} className="w-28 mx-auto" alt="logo" />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Login to your Account
            </h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                {/* {validationErrors.email && (
                  <div className="text-red-500 text-sm mb-1">
                    {validationErrors.email}
                  </div>
                )} */}
                <div className="text-xs mb-1 ml-1 text-gray-500">Email</div>
                <input
                  className={`w-full px-8 py-4 mb-5 rounded-full font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-gray-400 focus:bg-white  ${
                    validationErrors.email
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  type="email"
                  placeholder="youremail@email.com"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <div className="text-xs mb-1 ml-1 text-gray-500">Password</div>
                <input
                  className={`w-full px-8 py-4 mb-5 rounded-full font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-gray-400 focus:bg-white  ${
                    validationErrors.password
                      ? "border-red-500"
                      : "border-gray-200"
                  }`}
                  type="password"
                  placeholder="*********"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={signInBtn}
                      alt="Sign in Button"
                      className={`h-8 ${
                        formData.email === "" || formData.password === ""
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={handleSubmit}
                      style={{
                        filter: `${
                          (formData.email === "" || formData.password === "") ?
                          "grayscale(1)" : ""
                        }`,
                      }}
                    />
                    {isLoading && (
                      <BiLoaderCircle
                        className="animate-spin text-center ml-3"
                        color="#9999FF"
                        size={20}
                      />
                    )}
                  </div>
                  {/* <div className="border-b-1 text-center text-xs mb-3">
                    <Link
                      to="/sign-up"
                      className="leading-none px-2 inline-block text-xs text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2"
                    >
                      Sign Up Here
                    </Link>
                    <hr />
                  </div> */}
                </div>

                {loginError && (
                  <div className="text-red-500 text-sm mt-4">
                    Incorrect email or password. Please try again.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className="text-center w-1/2 relative"
          style={{ backgroundColor: "#000015" }}
        >
          <div>
            <img
              src={makeYoutubeWork}
              alt=""
              className="translate-x-32 mt-12 ml-20"
            />
          </div>
          <div>
            <img
              src={signInAppBanner}
              alt=""
              className="h-96 text-right absolute bottom-0 right-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
