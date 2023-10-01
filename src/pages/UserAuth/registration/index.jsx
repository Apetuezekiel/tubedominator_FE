/* eslint-disable */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoSearchCircle } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import Spinner from "../../../components/Spinner";
import { SignOutButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import showToast from "../../../utils/toastUtils";
import { useNavigate } from "react-router-dom";
import {
  useAllUserDeets,
  useUserAuthToken,
  // useUserLoggedin,
} from "../../../state/state";
import { useStateContext } from "../../../contexts/ContextProvider";
import CryptoJS from "crypto-js";

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
  const { isLoaded, isSignedIn, user } = useUser();
  const userAuthToken = useUserAuthToken((state) => state.userAuthToken);
  const setUserAuthToken = useUserAuthToken((state) => state.setUserAuthToken);
  // const userLoggedIn = useUserLoggedin((state) => state.userLoggedIn);
  // const setUserLoggedIn = useUserLoggedin((state) => state.setUserLoggedIn);
  const allUserDeets = useAllUserDeets((state) => state.allUserDeets);
  const setAllUserDeets = useAllUserDeets((state) => state.setAllUserDeets);
  const secretKey = "+)()^77---<@#$>";

  // useEffect(() => {
  //   const isChannelRegistered = async () => {
  //     console.log("userAuthToken", user);
  //     localStorage.setItem('clerkUser', JSON.stringify(user));
  //     console.log("localStorage.getItem('clerkUser')", localStorage.getItem('clerkUser'));
  //     const clerkUser = JSON.parse(localStorage.getItem('clerkUser'));
  //     clerkUser && setAllUserDeets(clerkUser);
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:8080/api/ischannelRegistered",
  //         {
  //           params: {
  //             user_id: clerkUser.id
  //           },
  //           headers: {
  //             "Content-Type": "application/json",
  //             "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
  //           },
  //         },
  //       );

  //       console.log('is channel registered', response);
  //       if (response.data.success) {
  //         setTimeout(() => {
  //           navigate("/ideation");
  //         }, 2000);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       throw error;

  //     }
  //   }

  //   setTimeout(() => {
  //     isChannelRegistered();
  //   }, 5000)
  // }, [])
  // setChannelUser(user)

  function fetchUserFromClerk() {
    if (!isLoaded || !isSignedIn) {
      console.log("NOT SIGNED IN");
      return null;
    }
    console.log("user", user);
    return user;
  }

  // fetchUserFromClerk()

  // Simulated API call to fetch suggested channels based on user input
  // const fetchSuggestedChannels = (channel_title) => {
  //   // Simulate API call delay
  //   console.log("----------------------------------");
  //   axios
  //     .get(
  //       "http://localhost:8080/api/getChannels",
  //       {
  //         channelTitle: channel_title,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
  //         },
  //       },
  //     )
  //     .then((response) => {
  //       // Extract channel title and image from the response
  //       const channelData = response.data.map((channel) => ({
  //         title: channel.channelTitle,
  //         image: channel.thumbnailUrl,
  //       }));
  //       // setChannels(channelData);
  //       console.log("channelDatarrrttyuuu", channelData);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching channel data:", error);
  //     });
  //   setTimeout(() => {
  //     const suggestions = ["Channel 1", "Channel 2", "Channel 3"]; // Replace with actual API response
  //     setSuggestedChannels(suggestions);
  //   }, 300);
  // };

  const fetchChannel = (channel_title) => {
    setIsLoading(true);
    axios
      .get(`http://localhost:8080/api/getChannels`, {
        params: {
          channelTitle: channel_title,
        },
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
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
        showToast("error", "Channel search did not work. Search again");
      });
  };

  const selectChannel = (channel) => {
    console.log(channel);
    setShowChannel(false);
    setSelectedFormData(channel.title);
    setSelectedChannel(channel);
    setFormData((prevData) => ({
      ...prevData,
      channel_name: channel.title,
    }));
    console.log("selectedChannel", selectedChannel);
  };

  const clearFormData = () => {
    setSelectedFormData("");
  };

  // const handleCompetitiveChannelChange = (e) => {
  //   const inputValue = e.target.value;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     competitiveChannelInput: inputValue,
  //   }));

  //   if (inputValue) {
  //     fetchSuggestedChannels(inputValue);
  //   } else {
  //     setSuggestedChannels([]);
  //   }
  // };

  // const handleAddCompetitiveChannel = (suggestion) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     competitive_channels: [...prevData.competitive_channels, suggestion],
  //     competitiveChannelInput: "", // Clear input
  //   }));
  //   setSuggestedChannels([]); // Clear suggestions
  // };

  // const handleRemoveCompetitiveChannel = (index) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     competitive_channels: prevData.competitive_channels.filter(
  //       (_, i) => i !== index,
  //     ),
  //   }));
  // };

  // useEffect(() => {
  //   // Simulate API call when competitiveChannelInput changes
  //   if (formData.competitiveChannelInput) {
  //     fetchSuggestedChannels(formData.competitiveChannelInput);
  //   }
  // }, [formData.competitiveChannelInput]);

  const handleChange = (e) => {
    selectedFormData ? setSelectedFormData(null) : null;
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const Redirect = (path) => {
    navigate(path);
  };

  const saveUserToken = async (token) => {
    // store the whole data to local storage and redirect
    const userFullData = {
      token: token,
      channel_id: selectedChannel.id,
      business_email: user.externalAccounts[0].emailAddress,
      channelFirstName: user.firstName,
      channelLastName: user.lastName,
      channelFullName: user.fullName,
      channel_image_link: selectedChannel.image,
      description: selectedChannel.description,
      channel_title: selectedChannel.title,
      user_id: user.id,
    };
    const encryptedFullData = encryptAndStoreData(userFullData);

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
        setTimeout(() => {
          // setUserLoggedIn(true);
        }, 2000);
        setTimeout(() => {
          navigate("/ideation");
        }, 2000);
      })
      .catch((error) => {
        console.error("Error storing token:", error);
        console.error("-----------------------", error.response.data.message);
        showToast("error", "Error saving token. Try again", 2000);
      });
  };

  const encryptAndStoreData = (data) => {
    const jsonData = JSON.stringify(data);
    const encryptedFullData = CryptoJS.AES.encrypt(
      jsonData,
      secretKey,
    ).toString();
    localStorage.setItem("encryptedFullData", encryptedFullData);
    return encryptedFullData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user, user);

    // Extract relevant user data
    const userFirstName = user.firstName;
    const userLastName = user.lastName;
    const userFullName = user.fullName;
    const businessEmail = user.externalAccounts[0].emailAddress;
    const channel_image_link = selectedChannel.image;
    const description = selectedChannel.description;
    const user_id = user.id;

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
      user_id: user_id,
      // clerkProfile: JSON.stringify(user),
    };

    console.log("updatedFormData", updatedFormData);
    console.log("allUserDeets", allUserDeets);

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
      showToast("error", "Error saving channel. Try again", 2000);
    }
  };

  function redirectToHome() {
    console.log("got here baby");
    window.location.href = "http://localhost:3000/";
    // window.location.href =
    //   "https://integral-fish-11.accounts.dev/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fideation";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <div className="bg-white shadow-lg rounded p-8 w-96 m-10">
        <h2 className="text-2xl font-semibold mb-4">
          Let's Get Your Channel Details
        </h2>
        <SignOutButton signOutCallback={() => redirectToHome()} />
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
              value={formData.keywords}
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
              value={formData.keywords}
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
              Channel Name
            </label>
            <div className="flex items-center justify-center">
              <input
                type="text"
                id="channel_name"
                name="channel_name"
                placeholder="type and search for your channel"
                value={
                  selectedFormData ? selectedFormData : formData.channel_name
                }
                onChange={handleChange}
                className={`${
                  selectedFormData ? "selectedChannel" : ""
                } mt-1 p-2 border rounded w-full mr-3`}
              />
              {/* {selectedFormData ? } */}
              {selectedFormData ? (
                <MdCancel size={30} onClick={clearFormData} />
              ) : (
                <button
                  type="button"
                  className="text-lg mr-3"
                  onClick={() => fetchChannel(formData.channel_name)}
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
          {/* <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description <em>(optional)</em>
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div> */}
          {/* <div className="mb-4">
            <label
              htmlFor="business_email"
              className="block text-sm font-medium text-gray-700"
            >
              Business Email
            </label>
            <input
              type="email"
              id="business_email"
              name="business_email"
              value={formData.business_email}
              onChange={handleChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div> */}
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
          {/* <div className="mb-4">
            <label htmlFor="competitive_channels" className="block text-sm font-medium text-gray-700">
              Competitive Channels
            </label>
            <input
              type="text"
              id="competitive_channels"
              name="competitive_channels"
              value={formData.competitiveChannelInput}
              onChange={handleCompetitiveChannelChange}
              className="mt-1 p-2 border rounded w-full"
            />
            {suggestedChannels.length > 0 && (
              <div className="mt-2 border rounded p-2">
                {suggestedChannels.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-200 rounded-full p-1 mt-1 cursor-pointer"
                    onClick={() => handleAddCompetitiveChannel(suggestion)}
                  >
                    <span>{suggestion}</span>
                    <span className="text-red-600 font-bold text-sm cursor-pointer" onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCompetitiveChannel(index);
                    }}>
                      X
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap mt-2">
              {formData.competitive_channels.map((channel, index) => (
                <div
                  key={index}
                  className="bg-blue-500 text-white rounded-full px-3 py-1 m-1 flex items-center"
                >
                  {channel}
                  <span
                    className="ml-2 text-red-600 font-bold cursor-pointer"
                    onClick={() => handleRemoveCompetitiveChannel(index)}
                  >
                    X
                  </span>
                </div>
              ))}
            </div>
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
