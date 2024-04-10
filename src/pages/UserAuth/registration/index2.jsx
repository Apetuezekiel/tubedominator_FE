/* eslint-disable */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoSearchCircle } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import showToast from "../../../utils/toastUtils";
import { useNavigate } from "react-router-dom";
import {
  useAllUserDeets,
  useUserAccessLevel,
  useUserAuthToken,
  useUserChannelConnected,
  useUserConnectionEntry,
  useUserData,
  useUserLoggedin,
  // useUserLoggedin,
} from "../../../state/state";
import { useStateContext } from "../../../contexts/ContextProvider";
import CryptoJS from "crypto-js";
import {
  fetchUserYoutubeInfo,
  saveUser,
  userFullDataDecrypted,
} from "../../../data/api/calls";
import countriesWithLanguages from "../../../data/countries";
import Loader from "../../../components/Loader";
import { BiLoaderCircle } from "react-icons/bi";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    channel_name: "",
    channel_id: "",
    business_email: "",
    accept_terms: false,
    channel_language: "",
    keywords: "",
    firstName: "",
    lastName: "",
    channelFirstName: "",
    channelLastName: "",
    channelFullName: "",
    user_id: "",
  });

  const [selectedFormData, setSelectedFormData] = useState(null);
  const accessLevel = useUserAccessLevel((state) => state.accessLevel);
  const setAccessLevel = useUserAccessLevel((state) => state.setAccessLevel);
  const setUserData = useUserData((state) => state.setUserData);
  const userLoggedIn = useUserLoggedin((state) => state.userLoggedIn);
  const setUserLoggedIn = useUserLoggedin((state) => state.setUserLoggedIn);
  const [suggestedChannels, setSuggestedChannels] = useState([]);
  const [showChannel, setShowChannel] = useState(false);
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channelUser, setChannelUser] = useState([]);
  const [callForUserChannels, setCallForUserChannels] = useState(false);
  const [clearSelectedChannel, setClearSelectedChannel] = useState(false);
  const [connectingChannel, setConnectingChannel] = useState(false);
  const userAuthToken = useUserAuthToken((state) => state.userAuthToken);
  const setUserAuthToken = useUserAuthToken((state) => state.setUserAuthToken);
  const allUserDeets = useAllUserDeets((state) => state.allUserDeets);
  const setAllUserDeets = useAllUserDeets((state) => state.setAllUserDeets);
  const secretKey = "+)()^77---<@#$>";
  const decryptedFullData = userFullDataDecrypted();
  const initialCountry = {
    countryCode: "GLB",
    languageCode: "en",
  };
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const userChannelConnected = useUserChannelConnected(
    (state) => state.userChannelConnected,
  );
  const setUserChannelConnected = useUserChannelConnected(
    (state) => state.setUserChannelConnected,
  );
  const userRecordId = localStorage.getItem("userRecordId");

  const setUserConnectionEntry = useUserConnectionEntry(
    (state) => state.setUserConnectionEntry,
  );

  console.log(
    "4567890987654323456789",
    localStorage.getItem("channelConnected"),
    localStorage.getItem("connectionEntry"),
  );
  useEffect(() => {
    if (!userRecordId || userRecordId.trim() === "" || userRecordId === null) {
      showToast("error", "Error occurred. Kindly login again", 2000);

      // Redirect to sign-in after 2 seconds
      setTimeout(() => {
        setAccessLevel("");
        setUserLoggedIn(false);
        localStorage.clear();
        navigate("/sign-in");
      }, 2000);
    }
  }, []);

  useEffect(() => {
    console.log("goteen decryptedFullData: ", decryptedFullData);
    const userRegEmail = localStorage.getItem("userRegEmail");
    const fetchChannel = () => {
      setIsLoading(true);
      axios
        .get(
          `${process.env.REACT_APP_API_BASE_URL}/getMyChannels?email=${userRegEmail}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.REACT_APP_X_API_KEY,
              gToken: decryptedFullData.gToken,
            },
          },
        )
        .then((response) => {
          setIsLoading(false);
          // Extract channel title and image from the response
          const channelData = response.data.map((channel) => ({
            title: channel.channelTitle,
            image: channel.thumbnailUrl,
            id: channel.channelId || channel.channelId.channelId,
            description: channel.description,
          }));
          console.log("channelData from api for this user", channelData);
          setChannels(channelData);
          setShowChannel(true);
        })
        .catch((error) => {
          console.error("Error fetching channel data:", error);
          setIsLoading(false);
          showToast("error", "Channel search did not work. Search again", 5000);
        });
    };

    fetchChannel();
  }, [callForUserChannels]);

  const fetchChannelsForUser = async (channelName) => {
    console.log("goteen decryptedFullData: ", decryptedFullData);
    const userRegEmail = localStorage.getItem("userRegEmail");
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/getMyChannels`,
        {
          params: {
            email: userRegEmail,
            channelName: channelName,
          },
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            gToken: decryptedFullData.gToken,
          },
        },
      );

      const channelData = response.data.map((channel) => ({
        title: channel.channelTitle,
        image: channel.thumbnailUrl,
        id: channel.channelId.channelId,
        description: channel.description,
      }));

      setChannels(channelData);
      setShowChannel(true);
    } catch (error) {
      console.error("Error fetching channel data:", error);
      showToast("error", "Channel search did not work. Search again", 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Call the function with the desired channelName
  // fetchChannelsForUser("yourChannelName");

  const selectChannel = (channel) => {
    setClearSelectedChannel(true);
    setShowChannel(false);
    setSelectedFormData(channel.title);
    setSelectedChannel(channel);
    setFormData((prevData) => ({
      ...prevData,
      channel_name: channel.title,
    }));
  };

  const handleChange = (e) => {
    setSelectedFormData(selectedFormData ? null : selectedFormData);
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const newValue = type === "checkbox" ? checked : value;
      setFormData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const Redirect = (path) => {
    navigate(path);
  };

  const saveUserToken = async (token, updatedFormData) => {
    const userRegEmail = localStorage.getItem("userRegEmail");
    const updatedGUserData = {
      ...decryptedFullData,
      token,
      channelId: selectedChannel.id,
      channelImage: selectedChannel.image,
      channelDescription: selectedChannel.description,
      channelTitle: selectedChannel.title,
    };
    const encryptedFullData = encryptAndStoreData(updatedGUserData);
    console.log("updatyed encryptedFullData:", updatedGUserData);
    // await fetchUserYoutubeInfo();

    await axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/saveUserToken`,
        {
          encryptedFullData,
          email: userRegEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(async (response) => {
        // await fetchUserYoutubeInfo();
        setConnectingChannel(false);
        setUserData(updatedFormData);
        setUserLoggedIn(true);
        navigate("/optimization");
      })
      .catch((error) => {
        setConnectingChannel(false);
        console.error("Error storing token:", error);
        console.error("-----------------------", error.response.data.message);
        showToast("error", "Error saving token. Try again", 5000);
      });
  };

  const encryptAndStoreData = (data) => {
    const jsonData = JSON.stringify(data);
    const encryptedGData = CryptoJS.AES.encrypt(jsonData, secretKey).toString();
    localStorage.setItem("encryptedGData", encryptedGData);
    return encryptedGData;
  };

  const handleSubmit = async (e) => {
    if (!selectedChannel) {
      showToast("warning", "Kindly select your channel first", 3000);
      e.preventDefault();
      return;
    }
    setConnectingChannel(true);
    e.preventDefault();
    // Extract relevant user data
    const userFirstName = localStorage.getItem("userFirstName");
    const userLastName = localStorage.getItem("userLastName");
    const userFullName = localStorage.getItem("userFullName");
    const businessEmail = localStorage.getItem("userRegEmail");
    const channel_image_link = selectedChannel.image;
    const description = selectedChannel.description;
    const user_id = `TUBE_${localStorage.getItem("userRegEmail")}`;

    // Update form data with selected channel and user details
    const updatedFormData = {
      ...formData,
      channel_id: selectedChannel.id,
      business_email: businessEmail,
      fullName: `${userFirstName} ${userLastName}`,
      channelFirstName: userFirstName,
      channelLastName: userLastName,
      channelFullName: userFullName,
      channel_image_link: channel_image_link,
      description: description,
      connectionEntry: "google_auth",
      user_id,
      userRecordId: localStorage.getItem("userRecordId"),
    };

    try {
      // Send updated form data to the
      console.log(
        "updatedFormData from channel reg page",
        updatedFormData,
        selectedChannel,
      );
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/saveUserYoutubeInfo`,
        updatedFormData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
          },
        },
      );

      if (response.data.success) {
        localStorage.setItem("accessLevel", "L2");
        localStorage.setItem("channel_id", selectedChannel.id);
        setAccessLevel("L2");
        console.log("Channel details stored successfully");
        const token = response.data.token;
        localStorage.setItem("channelConnected", 1);
        localStorage.setItem("connectionEntry", "google_auth");
        setUserConnectionEntry("google_auth");
        setUserChannelConnected(1);
        await saveUser({
          channelConnected: 1,
          email: localStorage.getItem("userRegEmail"),
        });
        setTimeout(() => {
          saveUserToken(token, updatedFormData);
        }, 2000);
      }
    } catch (error) {
      console.error("-----------------------", error.response.data.message);
      showToast("error", error.response.data.message, 5000);
      setConnectingChannel(false);
    }
  };

  const unselectChannel = () => {
    setClearSelectedChannel(false);
    setSelectedFormData(null);
  };

  function redirectToHome() {
    window.location.href = "http://localhost:3000/";
  }

  const renderCapsules = () => {
    if (formData.keywords) {
      const keywordsArray = formData.keywords
        .split(",")
        .map((keyword) => keyword.trim());

      // return keywordsArray.map((keyword, index) => (
      //   <div
      //     key={index}
      //     className="inline-block bg-gray-200 text-gray-700 rounded-full px-2 py-1 m-1"
      //   >
      //     {keyword}
      //   </div>))
      return keywordsArray.map((item, index) => (
        <div key={index} className="m-2">
          <div className="flex rounded-full bg-gray-200 p-2">
            <div className="bg-gray-300 rounded-l-full px-3 py-1 text-xs">
              {item}
            </div>
            <div className="bg-gray-400 rounded-r-full px-3 py-1 ml-2 text-xs">
              {index + 1}
            </div>
          </div>
        </div>
      ));
    }
  };

  const handleCountryChange = (event) => {
    const selectedValue = event.target.value;
    const [selectedCountryCode, selectedLanguageCode] =
      selectedValue.split(":");

    // if (selectedCountryData) {
    setSelectedCountry({
      countryCode: selectedCountryCode,
      languageCode: selectedLanguageCode,
    });
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded p-8 w-96 m-10">
        <h2 className="text-2xl font-semibold mb-8 text-center">
          Let's get some of your Channel Details
        </h2>
        <form onSubmit={handleSubmit}>
          {/* <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
              placeholder="Please enter your First Name"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
              placeholder="Please enter your Last Name"
            />
          </div> */}
          <div className="mb-4">
            <label
              htmlFor="channel_name"
              className="block text-sm font-medium text-gray-700"
            >
              Select your Channel(s)
            </label>
            <div className="flex items-center justify-center">
              <div
                type="text"
                id="channel_name"
                name="channel_name"
                placeholder="keywords your channel focuses on"
                // value={formData.channel_name}
                // onChange={handleChange}
                className={`${
                  selectedFormData ? "selectedChannel" : ""
                } mt-1 p-2 border rounded w-full mr-3`}
              >
                <br />
                {clearSelectedChannel === false ? (
                  <span style={{ color: "#999", fontStyle: "italic" }}>
                    click Channel below or the Search Icon to search for your
                    channel
                  </span>
                ) : (
                  <div className="bg-gray-200 rounded-full channelCapsule flex items-center justify-center">
                    <img
                      src={selectedChannel.image}
                      alt=""
                      className="channelImageSm mr-3"
                    />{" "}
                    {selectedFormData
                      ? selectedFormData
                      : formData.channel_name}
                  </div>
                )}
              </div>
              {selectedFormData ? (
                <MdCancel
                  size={30}
                  onClick={unselectChannel}
                  className="cursor-pointer"
                />
              ) : (
                <button
                  type="button"
                  className="text-lg mr-3"
                  onClick={() => {
                    setCallForUserChannels(!callForUserChannels);
                    // fetchChannelsForUser(formData.channel_name)
                  }}
                >
                  <IoSearchCircle size={30} />
                </button>
              )}
            </div>
            <div
              className={`${
                showChannel ? "showChannel" : "hideChannel"
              } text-black flex items-center justify-center`}
            >
              <div className="mt-3">
                {channels.map((channel, index) => (
                  <div
                    onClick={() => selectChannel(channel)}
                    key={index}
                    className="flex items-center justify-center cursor-pointer bg-gray-200 rounded-full p-3 channelCapsule mt-2"
                  >
                    <img
                      src={channel.image}
                      alt={channel.title}
                      className="channelImageSm mr-3"
                    />
                    <h2>{channel.title}</h2>
                  </div>
                ))}
              </div>
            </div>
            {isLoading ? (
              <Loader message={"Searching for your channel"} marginTop={3} />
            ) : (
              <div className=""></div>
            )}
          </div>
          {/* <div className="mb-4">
            <label
              htmlFor="channel_language"
              className="block text-sm font-medium text-gray-700"
            >
              Channel Language
            </label>
              <select
              id="countrySelect"
              className="rounded-full py-2 pl-4 pr-8 border border-gray-300 bg-white text-xs"
              value={`${selectedCountry.countryCode}:${selectedCountry.languageCode}`}
              onChange={handleCountryChange}
            >
              {countriesWithLanguages.map((item, index) => (
                <option
                  key={index}
                  value={`${item.countryCode}:${item.languageCode}`}
                >
                  {`${item.country} (${item.language})`}
                </option>
              ))}
            </select>
          </div> */}
          <div className="mb-4">
            <label
              htmlFor="keywords"
              className="block text-sm font-medium text-gray-700"
            >
              Channel Keywords (optional)
            </label>
            <input
              type="text"
              id="keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
              placeholder="keywords your channel focuses on"
            />
            {/* <div className="mt-2">
              {renderCapsules()}
            </div> */}
            <div className="flex flex-wrap -mx-2">{renderCapsules()}</div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="accept_terms"
                checked={formData.accept_terms}
                onChange={handleChange}
                className="mr-2"
              />
              I accept the terms and conditions
            </label>
          </div>
          <button
            type="submit"
            style={{
              background:
                selectedChannel === null
                  ? "grey"
                  : "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
              color: "white",
              cursor: selectedChannel === null ? "not-allowed" : "pointer",
              // pointerEvents: selectedChannel === null && "none"
            }}
            className="w-full text-white p-2 rounded flex items-center cursor-pointer justify-center"
          >
            Connect Channel
            {connectingChannel && (
              <BiLoaderCircle
                className="animate-spin text-center ml-2"
                color="white"
                size={20}
              />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
