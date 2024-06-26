/* eslint-disable */

import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
// import { FiShoppingCart } from "react-icons/fi";
// import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { GoogleLogin } from "react-google-login";

import TDLogo from "../assets/images/TDLogo.png";
import TDLogoWhite from "../assets/images/TDLogoWhite.png";
import { UserProfile } from ".";
import PreviewKeyword from "./PreviewKeyword";
// import PreviewKeyword from
import { useStateContext } from "../contexts/ContextProvider";
// import { useUser, SignOutButton } from "@clerk/clerk-react";
import axios from "axios";
import {
  useUserData,
  useUserAuthToken,
  useUserLoggedin,
  useUserAccessLevel,
  useUserGoogleCreds,
  useUserProfilePic,
} from "../state/state";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { pagesInfo } from "../data/pagesInfo";
import userAvatar from "../assets/images/man-avatar-profile-picture-vector-illustration_268834-538.avif";
import Loader from "./Loader";
import { GoPlus } from "react-icons/go";
import { checkClientAndApiKey } from "../data/api/calls";
import { IoIosWarning } from "react-icons/io";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color, display: "none" }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray hidden"
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
  const secretKey = "+)()^77---<@#$>";
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
  const userLoggedIn = useUserLoggedin((state) => state.userLoggedIn);
  const setUserLoggedIn = useUserLoggedin((state) => state.setUserLoggedIn);
  const accessLevel = useUserAccessLevel((state) => state.accessLevel);
  const setAccessLevel = useUserAccessLevel((state) => state.setAccessLevel);
  const userProfilePic = useUserProfilePic((state) => state.userProfilePic);
  const setUserProfilePic = useUserProfilePic(
    (state) => state.setUserProfilePic,
  );

  //
  //  if (accessLevel === "" || null){
  //   setAccessLevel(localStorage.getItem("accessLevel"))
  //  }
  //  if (userLoggedIn === "" || null){
  //   setUserLoggedIn(localStorage.getItem("userLoggedin"));
  //  }
  //  console.log('localStorage.getItem("accessLevel")', localStorage.getItem("accessLevel"));
  //  console.log('localStorage.getItem("userLoggedin")', localStorage.getItem("userLoggedin"));

  const decryptAndRetrieveData = (data) => {
    const secretKey = "+)()^77---<@#$>";

    if (data) {
      const decryptedBytes = CryptoJS.AES.decrypt(data, secretKey);
      const decryptedData = JSON.parse(
        decryptedBytes.toString(CryptoJS.enc.Utf8),
      );
      return decryptedData;
    }
    return null;
  };

  const userData = useUserData((state) => state.userData);
  const setUserData = useUserData((state) => state.setUserData);
  // const userAuthToken = useUserAuthToken((state) => state.userAuthToken);
  // const setUserAuthToken = useUserAuthToken((state) => state.setUserAuthToken);
  // const userFullData = getUserEncryptedData();
  const userEncryptedData = localStorage.getItem("encryptedGData");
  // const decryptedFullData = decryptAndRetrieveData(userEncryptedData);
  const navigate = useNavigate();
  const [loadedUserData, setLoadeduserData] = useState(false);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);
  const [pageTitle, setPageTitle] = useState("");
  const [pageTag, setPageTag] = useState("");
  const [reloadRequired, setReloadRequired] = useState(false);
  const [isUserGoogleCreds, setIsUserGoogleCreds] = useState(null);
  const isGoogleCreds = useUserGoogleCreds((state) => state.isGoogleCreds);
  const setIsGoogleCreds = useUserGoogleCreds(
    (state) => state.setIsGoogleCreds,
  );

  const location = useLocation();

  // const fetchUserYoutubeInfo = async () => {
  //   // const { isLoaded, isSignedIn, user } = useUser();
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API_BASE_URL}/getSavedUserYoutubeInfo`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "x-api-key": process.env.REACT_APP_X_API_KEY,
  //           Authorization: `Bearer ${decryptedFullData.token}`,
  //         },
  //       },
  //     );

  //     setUserData(response.data);
  //     setLoadeduserData(true);
  //     alert("got here too ran the code too")
  //     console.log(
  //       "getSavedUserYoutubeInfo:",
  //       response.data,
  //       decryptedFullData.token,
  //     );
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // fetchUserYoutubeInfo();

  useEffect(() => {
    const fetchUserSetGoogleCreds = async () => {
      try {
        const userSetGoogleCreds = await checkClientAndApiKey();
        console.log(
          "userSetGoogleCreds userSetGoogleCreds",
          userSetGoogleCreds,
        );
        setIsUserGoogleCreds(userSetGoogleCreds);
      } catch (error) {
        console.error("Error fetching user Google credentials:", error);
      }
    };

    fetchUserSetGoogleCreds();
  }, [isGoogleCreds]);

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
    const refreshInterval = 20000; // 2 minutes in milliseconds
    let timeoutId;

    const checkCondition = () => {
      if (userLoggedIn && accessLevel === "L2" && !userData) {
        setReloadRequired(true);
        // window.location.reload(true); // force reload from the server
      } else {
        setReloadRequired(false);
      }
    };

    timeoutId = setTimeout(checkCondition, refreshInterval);

    return () => clearTimeout(timeoutId); // cleanup the timeout on component unmount or condition met
  }, [userLoggedIn, userData, accessLevel]);

  // useEffect(()=>{

  // })

  // useEffect(() => {
  //   if (userLoggedIn) {
  //     alert("got here ran the code")
  //     fetchUserYoutubeInfo();
  //   }
  // }, [userLoggedIn]);

  // useEffect(() => {
  //   const savedUserData = JSON.parse(localStorage.getItem("userData"));
  //   console.log('savedUserData', savedUserData);
  //   if (userLoggedIn && savedUserData === null) {
  //     fetchUserYoutubeInfo();
  //   } else {
  //     setUserData(savedUserData);
  //     setLoadeduserData(true);
  //   }
  // }, [userLoggedIn]);

  // useEffect(() => {
  //   const fetchUserYoutubeData = async () => {
  //     const fetchUserData = await fetchUserYoutubeInfo();

  //     setUserData(fetchUserData);
  //     setLoadeduserData(true);
  //   }

  //   if (userLoggedIn) {
  //     const fetchUserYoutubeDataLocal = JSON.parse(localStorage.getItem("userData"));
  //     console.log("fetchUserYoutubeDataLocal", fetchUserYoutubeDataLocal);
  //     if (!fetchUserYoutubeDataLocal || fetchUserYoutubeDataLocal === null || fetchUserYoutubeDataLocal === undefined){
  //       fetchUserYoutubeData()
  //     } else {
  //       setUserData(fetchUserYoutubeDataLocal)
  //     }
  //   }
  // }, [userLoggedIn])

  useEffect(() => {
    const path = location.pathname;
    const pageName = path.substring(path.lastIndexOf("/") + 1);

    // Find the page info based on the extracted pageName
    const pageInfo = pagesInfo.find(
      (page) => page.page.toLowerCase() === pageName.toLowerCase(),
    );

    if (pageInfo) {
      setPageTitle(pageInfo.page);
      setPageTag(pageInfo.tag);
    }
  }, [location]);

  console.log("userLoggedIn", userLoggedIn);
  const RegisterUser = () => {
    if (googleLoginBtn.current) {
      googleLoginBtn.current.click(); // Triggering click on the second element
    }
  };

  return (
    <div
      // style={{backgroundColor: 'black'}}
      className={`w-full flex justify-between navBar relative`}
    >
      {
        // userLoggedIn && accessLevel === "L2" && !userData ? (
        //   <Loader
        //     message={
        //       "Hold on tight while your account loads Up. We might reload the page."
        //     }
        //   />
        // )
        // : userLoggedIn && userData ? (
        //   <>
        //     <div className="ml-5 my-auto py-5">
        //       <img src={TDLogo} alt="TubeDominator Logo" className="h-6"/>
        //     </div>
        //     <div className="flex my-auto">
        //       <TooltipComponent content="Profile" position="BottomCenter">
        //         <div
        //           className="flex items-center gap-2 cursor-pointer hover:bg-light-gray rounded-full px-2 py-2 mr-10"
        //           onClick={() => handleClick("userProfile")}
        //           style={{ backgroundColor: "#EAEAFF" }}
        //         >
        //           <img
        //             className="rounded-full w-5 h-5"
        //             src={userData.channel_image_link}
        //             alt="user-profile"
        //           />
        //           <p className="">
        //             <span className="text-gray-400 font-bold ml-1 text-14">
        //               {userData.firstName}
        //             </span>
        //           </p>
        //           <MdKeyboardArrowDown className="text-gray-400 text-14" />
        //         </div>
        //       </TooltipComponent>
        //       {isClicked.userProfile && <UserProfile />}
        //     </div>
        //   </>
        // )
        userLoggedIn ? (
          <div className="w-full flex justify-between p-2 md:ml-6 md:mr-6 relative homeHeader">
            <div className="ml-5 my-auto py-5">
              {/* <div className="pageTitle text-3xl font-semibold">{pageTitle}</div>
            <div className="tag text-md mt-2 text-xs">{pageTag}</div> */}
              <img src={TDLogo} alt="TubeDominator Logo" className="h-6" />
            </div>
            <div className="navbar-nav ms-auto py-0 flex justify-between items-center text-lg">
              {/* Welcome,{" "}
            <span className="text-2xl ml-2 font-semibold">
              {localStorage.getItem("userFirstName")}
            </span> */}
              {/* {
              isUserGoogleCreds === false && (
                <span className="text-md ml-4 font-semibold flex items-center">
                  <IoIosWarning color="#D25C87" /><a style={{color: "blue"}} href={`${process.env.REACT_APP_BASE_URL}/settings`}>You need to connect your Api Key and Client ID. Click here</a>
              </span>
              )
            } */}
              <Link
                className="text-md ml-4 font-semibold flex items-center cursor-pointer text-blue-500"
                to={"/training"}
              >
                Start By Watching Our Training Videos
              </Link>
            </div>
            <div className="flex my-auto">
              <TooltipComponent content="Profile" position="BottomCenter">
                <div
                  className="flex items-center gap-2 cursor-pointer hover:bg-light-gray rounded-full px-2 py-2 mr-10"
                  onClick={() => handleClick("userProfile")}
                  style={{ backgroundColor: "#EAEAFF" }}
                >
                  <img
                    className="rounded-full w-5 h-5"
                    src={userProfilePic ? userProfilePic : userAvatar}
                    alt="user-profile"
                  />
                  <p className="">
                    <span className="text-gray-400 font-bold ml-1 text-14">
                      {localStorage.getItem("userFirstName")}
                    </span>
                  </p>
                  <MdKeyboardArrowDown className="text-gray-400 text-14" />
                </div>
              </TooltipComponent>
              {isClicked.userProfile && <UserProfile />}
            </div>
          </div>
        ) : (
          <div
            className="w-full flex justify-between p-2 relative homeHeader"
            style={{
              backgroundColor: "#1C1F33",
              borderRadius: "0 0 20px 20px",
            }}
          >
            <Link to={"/"}>
              <img
                className="h-8 my-auto"
                src={TDLogoWhite}
                alt="Tubedominator Logo"
              />
            </Link>
            {/* <div className="navbar-nav ms-auto py-0 flex justify-between items-center">
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
          </div> */}
            <div className="flex">
              <div className="flex items-center gap-2 cursor-pointer p-1 rounded-lg">
                {/* <Link
                className="text-xs mr-4 py-2 px-5 rounded-full text-white flex items-center"
                to="/sign-up"
                style={{
                  backgroundColor: "transparent",
                  border: "1px white solid",
                }}
              >
                <GoPlus className="mr-2" />
                Register
              </Link> */}
                <Link
                  className="text-xs mr-4 text-black py-2 px-8 rounded-full"
                  to="/sign-in"
                  style={{ backgroundColor: "#9999ff" }}
                >
                  Log In
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
          </div>
        )
      }
    </div>
  );
};

export default Navbar;
