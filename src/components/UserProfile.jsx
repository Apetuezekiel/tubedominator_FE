/* eslint-disable */

import React from "react";
import { MdOutlineCancel } from "react-icons/md";

import { Button } from ".";
import { userProfileData } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import avatar from "../data/avatar.jpg";
import { useUserAccessLevel, useUserData, useUserLoggedin } from "../state/state";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogout } from "react-google-login";
import { useRef } from "react";

const UserProfile = () => {
  const clientId =
    "372673946018-lu1u3llu6tqi6hmv8m2226ri9qev8bb8.apps.googleusercontent.com";
  const setUserLoggedIn = useUserLoggedin((state) => state.setUserLoggedIn);
  const accessLevel = useUserAccessLevel((state) => state.accessLevel);
  const setAccessLevel = useUserAccessLevel((state) => state.setAccessLevel);
  const { currentColor } = useStateContext();
  const userData = useUserData((state) => state.userData);
  const setUserData = useUserData((state) => state.setUserData);
  const navigate = useNavigate();
  const logOutBtn = useRef(null);
  const dismissProfileBtn = useRef(null)
  const { setIsClicked, initialState } = useStateContext();


  const onLogoutSuccess = (res) => {
    console.log("Logout Success, res:", res);
    localStorage.clear();
    navigate("/");
  };

  const handleLogOut = () => {
    setIsClicked(initialState)
    console.log("Logout Success");
    localStorage.clear();
    navigate("/");
    setUserLoggedIn('')
    setAccessLevel('')
  };

  const handleLogOutClick = () => {
    dismissProfileBtn.current.click();
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
          src={userData.data.channel_image_link}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200">
            {" "}
            {userData.data.fullName}{" "}
          </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            {" "}
            Administrator{" "}
          </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
            {" "}
            {userData.data.business_email}{" "}
          </p>
        </div>
      </div>
      <div>
        {userProfileData.map((item, index) => (
          <div
            key={index}
            className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"
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
        ))}
      </div>
      <div className="mt-5">
        <div id="signoutButton">
          {/* <GoogleLogout
            clientId={clientId}
            buttonText="Logout"
            onLogoutSuccess={onLogoutSuccess}
          ></GoogleLogout> */}
        </div>
          {/* <Button
            color="white"
            bgColor={currentColor}
            text="Logout"
            borderRadius="10px"
            width="full"
          /> */}
          <button
          className="w-full rounded-md py-3 text-white"
          style={{backgroundColor: "#7352FF"}}
          onClick={() => {setIsClicked(initialState)
            handleLogOut()}}
          ref={logOutBtn}
          >
            Log Out
          </button>
      </div>
    </div>
  );
};

export default UserProfile;
