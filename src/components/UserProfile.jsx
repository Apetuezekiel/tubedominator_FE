/* eslint-disable */

import React from "react";
import { MdOutlineCancel } from "react-icons/md";

import { Button } from ".";
import { userProfileData } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import avatar from "../data/avatar.jpg";
import {
  useUserAccessLevel,
  useUserData,
  useUserLoggedin,
} from "../state/state";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogout } from "react-google-login";
import { useRef } from "react";
import GoogleLogOut from "../pages/UserAuth/GoogleLogOut";

const UserProfile = () => {
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const setUserLoggedIn = useUserLoggedin((state) => state.setUserLoggedIn);
  const accessLevel = useUserAccessLevel((state) => state.accessLevel);
  const setAccessLevel = useUserAccessLevel((state) => state.setAccessLevel);
  const { currentColor } = useStateContext();
  const userData = useUserData((state) => state.userData);
  const setUserData = useUserData((state) => state.setUserData);
  const navigate = useNavigate();
  const logOutBtn = useRef(null);
  const dismissProfileBtn = useRef(null);
  const { setIsClicked, initialState } = useStateContext();

  const onLogoutSuccess = (res) => {
    console.log("Logout Success, res:", res);
    setIsClicked(initialState);
    localStorage.clear();
    setUserLoggedIn("");
    setAccessLevel("");
    setUserData(null);
    navigate("/");
  };

  const handleLogOut = () => {
    setIsClicked(initialState);
    console.log("Logout Success");
    setUserData(null);
    localStorage.clear();
    navigate("/");
    setUserLoggedIn("");
    setAccessLevel("");
  };

  const handleLogOutClick = () => {
    dismissProfileBtn.current.click();
  };

  const goToSettings = () => {
    setIsClicked(initialState);
    navigate("/settings");
  };

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      {/* <SignOutButton/> */}
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
          // ref={dismissProfileBtn}
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={userData.channel_image_link}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200">
            {" "}
            {userData.fullName}{" "}
          </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            {" "}
            Administrator{" "}
          </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
            {" "}
            {userData.business_email}{" "}
          </p>
        </div>
      </div>
      <div>
        {/* {userProfileData.map((item, index) => (
          <div
            key={index}
            className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"
            onClick={goToSettings}
          >
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              {item.icon}
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {" "}
                {item.desc}{" "}
              </p>
            </div>
          </div>
        ))} */}
      </div>
      <div className="mt-5 flex flex-col justify-center items-center relative">
        <div className="top-1 opacity-0 ml-8 absolute left-1/2 transform -translate-x-1/2 w-1/2">
          <GoogleLogOut />
        </div>
        <button
          className="w-1/2 rounded-md py-3 text-white"
          style={{
            background:
              "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
            color: "white",
          }}
          onClick={() => {
            setIsClicked(initialState);
            handleLogOut();
          }}
          ref={logOutBtn}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
