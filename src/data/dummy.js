/* eslint-disable */

import React from "react";
import {
  BsBarChart,
  BsYoutube,
} from "react-icons/bs";
import {
  RiContactsLine,
  RiLightbulbFlashLine,
  RiStockLine,
} from "react-icons/ri";
import {
  MdOutlineSocialDistance,
  MdScreenSearchDesktop,
} from "react-icons/md";
import { FaRegHeart, FaUserAlt } from "react-icons/fa";
import { IoRocketOutline, IoSettings } from "react-icons/io5";
import { SiCampaignmonitor, SiGoogleanalytics } from "react-icons/si";


export const menuLinks = [
  {
    title: "",
    links: [
      // {
      //   name: "Connect Your Youtube",
      //   link: "youtube",
      //   icon: <AiFillWarning color="#F89C0E" />,
      // available: true
      // },
      {
        name: "ideation",
        link: "ideation",
        icon: <RiLightbulbFlashLine />,
        available: true,
        package: "general",
      },
      {
        name: "Saved Ideas",
        link: "saved-ideas-cat",
        icon: <FaRegHeart />,
        available: true,
        package: "general",
      },
      // {
      //   name: "Reporting",
      //   link: "reporting",
      //   icon: <BsGraphUp />,
      // available: true
      // },
      {
        name: "Keywords Ranking",
        link: "keywords",
        icon: <BsBarChart />,
        available: true,
        package: "general",
      },
      {
        name: "AI Generator",
        link: "ai-generator",
        icon: <BsYoutube />,
        available: true,
        package: "general",
      },
    ],
  },
];

export const bundleLinks = [
  {
    title: "",
    links: [
      {
        name: "25 DFY Campaigns",
        link: "dfy-campaigns",
        icon: <SiCampaignmonitor />,
        available: true,
        package: "bundle",
      },
      {
        name: "DFY SEO Agency",
        link: "dfy-seo-agency",
        icon: <MdScreenSearchDesktop />,
        available: true,
        package: "bundle",
      },
      {
        name: "Afilliate Marketing Coaching",
        link: "afilliate-marketing-coaching",
        icon: <MdOutlineSocialDistance />,
        available: true,
        package: "bundle",
      },
      {
        name: "Unlimited Traffic",
        link: "unlimited-traffic",
        icon: <SiGoogleanalytics />,
        available: true,
        package: "bundle",
      },
    ],
  },
];

export const accountActions = [
  {
    title: "",
    links: [
      {
        name: "Settings",
        link: "settings",
        icon: <IoSettings />,
        available: true,
      },
      // {
      //   name: "Log Out",
      //   link: "#",
      //   icon: <MdPowerSettingsNew />,
      // available: true
      // },
    ],
  },
];
export const optimizationMenuLink = [
  {
    title: "",
    links: [
      {
        name: "optimization",
        link: "optimization",
        icon: <IoRocketOutline />,
        available: true,
        package: "general",
      },
    ],
  },
];

export const themeColors = [
  {
    name: "blue-theme",
    color: "#1A97F5",
  },
  {
    name: "green-theme",
    color: "#03C9D7",
  },
  {
    name: "purple-theme",
    color: "#7352FF",
  },
  {
    name: "red-theme",
    color: "#FF5C8E",
  },
  {
    name: "indigo-theme",
    color: "#1E4DB7",
  },
  {
    color: "#FB9678",
    name: "orange-theme",
  },
];

export const userProfileData = [
  {
    icon: <FaUserAlt />,
    title: "My Profile",
    desc: "Account Settings",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
    link: "/settings",
  },
  // {
  //   icon: <BsShield />,
  //   title: "My Inbox",
  //   desc: "Messages & Emails",
  //   iconColor: "rgb(0, 194, 146)",
  //   iconBg: "rgb(235, 250, 242)",
  // },
  // {
  //   icon: <FiCreditCard />,
  //   title: "My Tasks",
  //   desc: "To-do and Daily Tasks",
  //   iconColor: "rgb(255, 244, 229)",
  //   iconBg: "rgb(254, 201, 15)",
  // },
];
