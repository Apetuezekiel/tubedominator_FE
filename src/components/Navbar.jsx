/* eslint-disable */

import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
// import { FiShoppingCart } from "react-icons/fi";
// import { BsChatLeft } from "react-icons/bs";
// import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { GoogleLogin } from "react-google-login";

import avatar from "../assets/images/TubeDominator 1000x1000.png";
import { UserProfile } from ".";
import PreviewKeyword from "./PreviewKeyword";
// import PreviewKeyword from
import { useStateContext } from "../contexts/ContextProvider";
// import { useUser, SignOutButton } from "@clerk/clerk-react";
import axios from "axios";
import { useUserData, useUserAuthToken, useUserLoggedin } from "../state/state";
import { Link, useNavigate } from "react-router-dom";
// import {
//   getUserEncryptedData,
//   getUserEncryptedDataFromDb,
//   userFullDataDecrypted,
// } from "../data/api/calls";
import CryptoJS from "crypto-js";
// import showToast from "../utils/toastUtils";
import GoogleLoginComp from "../pages/UserAuth/GoogleLogin";
import { BiLoaderCircle } from "react-icons/bi";
import { useRef } from "react";

const clientId =
  "372673946018-lu1u3llu6tqi6hmv8m2226ri9qev8bb8.apps.googleusercontent.com";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const encryptAndStoreData = (data) => {
  const secretKey = process.env.REACT_APP_JWT_SECRET;
  const jsonData = JSON.stringify(data);
  const encryptedGData = CryptoJS.AES.encrypt(jsonData, secretKey).toString();
  localStorage.setItem("encryptedGData", encryptedGData);
  return encryptedGData;
};

const Navbar = () => {
  const googleLoginBtn = useRef(null);
  const appRegisterBtn = useRef(null);
  const appLoginBbtn = useRef(null);
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();
  // const userLoggedIn = useUserLoggedin((state) => state.userLoggedIn);
  // const setUserLoggedIn = useUserLoggedin((state) => state.setUserLoggedIn);
  const userLoggedIn = localStorage.getItem("userLoggedin");

  const decryptAndRetrieveData = (data) => {
    const secretKey = process.env.REACT_APP_JWT_SECRET;

    if (data) {
      const decryptedBytes = CryptoJS.AES.decrypt(data, secretKey);
      const decryptedData = JSON.parse(
        decryptedBytes.toString(CryptoJS.enc.Utf8),
      );
      return decryptedData;
    }
    return null;
  };

  // useEffect(() => {
  //   gapi.load("client:auth2", () => {
  //     gapi.client.init({
  //       apiKey,
  //       client_id,
  //       scope:
  //         "https://www.googleapis.com/auth/youtube.readonly " +
  //         "https://www.googleapis.com/auth/youtube.force-ssl " +
  //         "https://www.googleapis.com/auth/youtube " +
  //         "https://www.googleapis.com/auth/youtube.upload " +
  //         "https://www.googleapis.com/auth/cse", // Added Custom Search scope
  //     });
  //   });
  // }, []);

  const userData = useUserData((state) => state.userData);
  const setUserData = useUserData((state) => state.setUserData);
  // const userAuthToken = useUserAuthToken((state) => state.userAuthToken);
  // const setUserAuthToken = useUserAuthToken((state) => state.setUserAuthToken);
  // const userFullData = getUserEncryptedData();
  const userEncryptedData = localStorage.getItem("encryptedGData");
  const decryptedFullData = decryptAndRetrieveData(userEncryptedData);
  const navigate = useNavigate();
  const [loadedUserData, setLoadeduserData] = useState(false);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  const fetchUserYoutubeInfo = async () => {
    // const { isLoaded, isSignedIn, user } = useUser();
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/getSavedUserYoutubeInfo`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            Authorization: `Bearer ${decryptedFullData.token}`,
          },
        },
      );

      setUserData(response.data);
      setLoadeduserData(true);
      console.log(
        "getSavedUserYoutubeInfo:",
        response.data,
        decryptedFullData.token,
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // fetchUserYoutubeInfo();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  useEffect(() => {
    if (userLoggedIn) {
      fetchUserYoutubeInfo();
    }
  }, [userLoggedIn]);

  console.log("userLoggedIn", userLoggedIn);
  const RegisterUser = () => {
    if (googleLoginBtn.current) {
      googleLoginBtn.current.click(); // Triggering click on the second element
    }
  };

  return (
    <div
      // style={{backgroundColor: 'black'}}
      className={`w-8/9 flex justify-between py-2 md:ml-6 md:mr-6 relative ${
        userLoggedIn ? "" : "shadow-xl"
      }`}
    >
      {userLoggedIn && !userData ? (
        <div className="flex flex-col justify-center items-center w-full mt-20">
          <BiLoaderCircle
            className="animate-spin text-center"
            color="#7352FF"
            size={30}
          />
          <div>Give us a minute to load up your account data</div>
        </div>
      ) : userLoggedIn && userData ? (
        <>
          <NavButton
            title="Menu"
            customFunc={handleActiveMenu}
            color={currentColor}
            icon={<AiOutlineMenu />}
          />
          <div className="flex">
            <TooltipComponent content="Profile" position="BottomCenter">
              <div
                className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
                onClick={() => handleClick("userProfile")}
              >
                <img
                  className="rounded-full w-8 h-8"
                  src={userData.data.channel_image_link}
                  alt="user-profile"
                />
                <p>
                  <span className="text-gray-400 text-14">Hi,</span>{" "}
                  <span className="text-gray-400 font-bold ml-1 text-14">
                    {userData.data.firstName}
                  </span>
                </p>
                <MdKeyboardArrowDown className="text-gray-400 text-14" />
              </div>
            </TooltipComponent>
            {isClicked.userProfile && <UserProfile />}
          </div>
        </>
      ) : (
        <div
          className="w-5/6 flex justify-between p-2 md:ml-6 md:mr-6 relative homeHeader"
          // style={{backgroundColor: 'black'}}
        >
          <img
            className="w-15"
            src={avatar}
            alt="user-profile"
            height={50}
            width={50}
          />
          <div className="navbar-nav ms-auto py-0 flex justify-between items-center">
            <a href="/project" className="nav-item nav-link mr-8">
              Services
            </a>
            <a href="/project" className="nav-item nav-link mr-8">
              Software
            </a>
            <a href="/project" className="nav-item nav-link mr-8">
              Rankings
            </a>
            <a href="/project" className="nav-item nav-link mr-8">
              Cases
            </a>
            <a href="/contact" className="nav-item nav-link">
              About
            </a>
          </div>
          <div className="flex">
            <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg">
              {/* <GoogleLogin
                clientId={clientId}
                buttonText="Login"
                onSuccess={onLoginSuccess}
                onFailure={onLoginFailure}
                cookiePolicy="single_host_origin"
                isSignedIn={true}
                className="google-login-button rounded-full"
              >
                Log In
              </GoogleLogin> */}
              <div className="mr-[-8rem] z-10 opacity-0">
                {<GoogleLoginComp ref={googleLoginBtn} />}
              </div>
              <div
                className="text-lg mr-4 text-black py-2 px-5 rounded-full"
                // to="/sign-up"
                style={{ backgroundColor: "#F2F2F2" }}
                onClick={RegisterUser}
                ref={appRegisterBtn}
              >
                Register
              </div>
              <p>
                <button
                  type="submit"
                  style={{ backgroundColor: "#7438FF" }}
                  className="w-full text-lg text-white py-2 px-5 rounded-full"
                >
                  Talk to an Expert
                </button>
              </p>
            </div>
            {/* {isClicked.userProfile && <PreviewKeyword />} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
