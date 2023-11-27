/* eslint-disable */

import React from "react";
import { Link, NavLink } from "react-router-dom";
import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { FaYoutube, FaGoogle, FaPlus } from "react-icons/fa";
import tubedominatorLogo from "../assets/images/TDLogo.png";
import GoogleLoginComp from "../pages/UserAuth/GoogleLogin";

import { menuLinks } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import { FcGoogle } from "react-icons/fc";
import GoogleLogOut from "../pages/UserAuth/GoogleLogOut";
import { useUserAccessLevel } from "../state/state";

const Sidebar2 = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } =
    useStateContext();
  const accessLevel = useUserAccessLevel((state) => state.accessLevel);
  const setAccessLevel = useUserAccessLevel((state) => state.setAccessLevel);
  if (accessLevel === "" || null) {
    setAccessLevel(localStorage.getItem("accessLevel"));
  }

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const isDisabled = accessLevel !== "L2";
  console.log("accessLevel", accessLevel);

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2";

  return (
    <div className="">
      {menuLinks.map((item, index) => (
        <div key={index}>
          <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
            {item.title}
          </p>
          {item.links.map((link, index) => (
            <div
              className="flex flex-col w-20 justify-center m-auto"
              key={index}
            >
              <NavLink
                to={`/${link.link}`}
                key={link.name}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : "",
                  pointerEvents: isDisabled ? "none" : "auto",
                  opacity: isDisabled ? 0.5 : 1,
                })}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <div>{link.icon}</div>
                {/* <div className="capitalize pr-4">{link.name}</div> */}
              </NavLink>
              {isDisabled && ( // Show a message on hover if accessLevel is not 'L2'
                <div className="tooltip bg-white">
                  Connect to Youtube to access feature
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sidebar2;
