/* eslint-disable */

import React from "react";
import { Link, NavLink } from "react-router-dom";
import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { FaYoutube, FaGoogle, FaPlus } from "react-icons/fa";
import tubedominatorLogo from "../assets/images/TDLogo.png";
import GoogleLoginComp from "../pages/UserAuth/GoogleLogin";

import { accountActions, menuLinks } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import { FcGoogle } from "react-icons/fc";
import GoogleLogOut from "../pages/UserAuth/GoogleLogOut";
import { useUserAccessLevel } from "../state/state";
import { GoogleLogout } from "react-google-login";

const Sidebar = () => {
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
    // <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 width-sidebar">
    <div className="bg-white w-fit rounded-lg flex justify-center items-center fixed mx-auto ml-16">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            {/* <Link
              to="/"
              onClick={handleCloseSideBar}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              <img className="" src={tubedominatorLogo} alt="Tubics Logo" />
            </Link> */}
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="">
            {/* {accessLevel === "L1" || accessLevel === null ? (
              <div>
                <div className="-mb-24 ml-8 opacity-0">
                  <GoogleLoginComp />
                </div>
                <NavLink
                  to={``}
                  className="flex items-center ml-6 mt-10 px-5 py-3 rounded-md"
                  style={{ backgroundColor: "#7438FF" }}
                >
                  <div className="mr-3">
                    <FcGoogle size={20} />
                  </div>
                  <div className="capitalize pr-4 text-white">
                    Connect your Youtube
                  </div>
                </NavLink>
              </div>
            ) : (
              ""
            )} */}
            {menuLinks.map((item, index) => (
              <div key={index}>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  {item.title}
                </p>
                {item.links.map((link, index) => (
                  <div
                    className="flex flex-col w-16 justify-center m-auto"
                    key={index}
                  >
                    <NavLink
                      to={`/${link.link}`}
                      key={link.name}
                      onClick={handleCloseSideBar}
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? "#EAEAFE" : "",
                        border: isActive
                          ? "#9999FF 1px solid"
                          : "#E5E4E2 1px solid",
                        color: isActive ? "#9999FF" : "#000000",
                        borderRadius: "6px",
                        // pointerEvents: isDisabled ? "none" : "auto",
                        // opacity: isDisabled ? 0.5 : 1,
                      })}
                      className={({ isActive }) =>
                        isActive ? activeLink : normalLink
                      }
                    >
                      <div className="">{link.icon}</div>
                      {/* <div className="capitalize pr-4">{link.name}</div> */}
                    </NavLink>
                    {/* {isDisabled && (
                      <div className="tooltip bg-white">
                        Connect to Youtube to access feature
                      </div>
                    )} */}
                  </div>
                ))}
              </div>
            ))}
            <br />
            <br />
            <br />
            {accountActions.map((item, index) => (
              <div key={index} className="">
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  {item.title}
                </p>
                {item.links.map((link, index) => (
                  <div
                    className={`flex flex-col w-16 justify-center m-auto ${
                      link.name === "Log Out" ? "relative" : ""
                    }`}
                    key={index}
                  >
                    <NavLink
                      to={`/${link.link}`}
                      key={link.name}
                      onClick={handleCloseSideBar}
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? "#EAEAFE" : "",
                        border: isActive
                          ? "#9999FF 1px solid"
                          : "#E5E4E2 1px solid",
                        color: isActive ? "#9999FF" : "#000000",
                        borderRadius: "6px",
                        // pointerEvents: isDisabled ? "none" : "auto",
                        // opacity: isDisabled ? 0.5 : 1,
                      })}
                      className={({ isActive }) =>
                        isActive ? activeLink : normalLink
                      }
                    >
                      <div className="">{link.icon}</div>
                      {/* <div className="capitalize pr-4">{link.name}</div> */}
                    </NavLink>
                    <div className="absolute opacity-0">
                      {link.name === "Log Out" && <GoogleLogOut />}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div className="">{/* <GoogleLogOut /> */}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
