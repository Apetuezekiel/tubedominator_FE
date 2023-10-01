/* eslint-disable */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoSearchCircle } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import Spinner from "../../../components/Spinner";
import showToast from "../../../utils/toastUtils";
import { useNavigate } from "react-router-dom";
import {
  useAllUserDeets,
  useUserAuthToken,
  // useUserLoggedin,
} from "../../../state/state";
import { useStateContext } from "../../../contexts/ContextProvider";
import CryptoJS from "crypto-js";
import { userFullDataDecrypted } from "../../../data/api/calls";

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

  const [suggestedChannels, setSuggestedChannels] = useState([]);
  const [showChannel, setShowChannel] = useState(false);
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channelUser, setChannelUser] = useState([]);
  const [callForUserChannels, setCallForUserChannels] = useState(false);
  const [clearSelectedChannel, setClearSelectedChannel] = useState(false);
  const userAuthToken = useUserAuthToken((state) => state.userAuthToken);
  const setUserAuthToken = useUserAuthToken((state) => state.setUserAuthToken);
  const allUserDeets = useAllUserDeets((state) => state.allUserDeets);
  const setAllUserDeets = useAllUserDeets((state) => state.setAllUserDeets);
  const secretKey = "+)()^77---<@#$>";
  const decryptedFullData = userFullDataDecrypted();
  console.log("decryptedFullDataaaaaa", decryptedFullData);

  useEffect(() => {
    const fetchChannel = () => {
      setIsLoading(true);
      axios
        .get(`http://localhost:8080/api/getMyChannels`, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
            Authorization: `Bearer ${decryptedFullData.gToken}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          // showToast('success', 'Channel Found!', '1000')
          // Extract channel title and image from the response
          const channelData = response.data.map((channel) => ({
            title: channel.channelTitle,
            image: channel.thumbnailUrl,
            id: channel.channelId,
            description: channel.description,
          }));
          setChannels(channelData);
          setShowChannel(true);
          console.log("channelData", channelData);
        })
        .catch((error) => {
          console.error("Error fetching channel data:", error);
          setIsLoading(false);
          showToast("error", "Channel search did not work. Search again", 5000);
        });
    };

    fetchChannel();
  }, [callForUserChannels]);

  const selectChannel = (channel) => {
    console.log(channel);
    setClearSelectedChannel(true);
    setShowChannel(false);
    setSelectedFormData(channel.title);
    setSelectedChannel(channel);
    setFormData((prevData) => ({
      ...prevData,
      channel_name: channel.title,
    }));
    console.log("selectedChannel", selectedChannel);
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

  const saveUserToken = async (token) => {
    // store the whole data to local storage and redirect
    // const userFullData = {
    //   token: token,
    //   channel_id: selectedChannel.id,
    //   business_email: user.externalAccounts[0].emailAddress,
    //   channelFirstName: user.firstName,
    //   channelLastName: user.lastName,
    //   channelFullName: user.fullName,
    //   channel_image_link: selectedChannel.image,
    //   description: selectedChannel.description,
    //   channel_title: selectedChannel.title,
    //   user_id: user.id,
    // };
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

    await axios
      .post(
        "http://localhost:8080/api/saveUserToken",
        {
          encryptedFullData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(async (response) => {
        console.log("Token stored successfully", response.data.message);
        navigate("/ideation");
      })
      .catch((error) => {
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
    e.preventDefault();

    // Extract relevant user data
    const userFirstName = decryptedFullData.firstName;
    const userLastName = decryptedFullData.lastName;
    const userFullName = decryptedFullData.fullName;
    const businessEmail = decryptedFullData.email;
    const channel_image_link = selectedChannel.image;
    const description = selectedChannel.description;
    const user_id = `TUBE_${decryptedFullData.gId}`;

    // Update form data with selected channel and user details
    const updatedFormData = {
      ...formData,
      channel_id: selectedChannel.id,
      business_email: businessEmail,
      fullName: `${formData.firstName} ${formData.lastName}`,
      channelFirstName: userFirstName,
      channelLastName: userLastName,
      channelFullName: userFullName,
      channel_image_link: channel_image_link,
      description: description,
      user_id,
    };

    console.log("updatedFormData", updatedFormData);

    try {
      // Send updated form data to the server
      const response = await axios.post(
        "http://localhost:8080/api/saveUserYoutubeInfo",
        updatedFormData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
          },
        },
      );

      console.log("Channel details stored successfully", response.data.token);
      const token = response.data.token;

      setTimeout(() => {
        saveUserToken(token);
      }, 2000);
    } catch (error) {
      console.error("-----------------------", error.response.data.message);
      showToast("error", "Error saving channel. Try again", 5000);
    }
  };

  const unselectChannel = () => {
    setClearSelectedChannel(false);
    setSelectedFormData(null);
  };

  function redirectToHome() {
    console.log("got here baby");
    window.location.href = "http://localhost:3000/";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <div className="bg-white shadow-lg rounded p-8 w-96 m-10">
        <h2 className="text-2xl font-semibold mb-4">
          Let's Get Your Channel Details
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
          </div>
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
                className={`${
                  selectedFormData ? "selectedChannel" : ""
                } mt-1 p-2 border rounded w-full mr-3`}
              >
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
                <MdCancel size={30} onClick={unselectChannel} />
              ) : (
                <button
                  type="button"
                  className="text-lg mr-3"
                  onClick={() => setCallForUserChannels(!callForUserChannels)}
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
              <div className="loading-container">
                <Spinner />
              </div>
            ) : (
              <div className=""></div>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="channel_language"
              className="block text-sm font-medium text-gray-700"
            >
              Channel Language
            </label>
            <select
              id="channel_language"
              name="channel_language"
              value={formData.channel_language}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
            >
              <option value="">Select a language</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              {/* Add more language options */}
            </select>
          </div>
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
            style={{ backgroundColor: "#7352FF" }}
            className="w-full text-white p-2 rounded"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;