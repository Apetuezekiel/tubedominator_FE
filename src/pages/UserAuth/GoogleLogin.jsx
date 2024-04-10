/* eslint-disable */

import {
  React,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { GoogleLogin } from "react-google-login";
import GoogleApiInitializer from "../../utils/GoogleApiInitializer";
import axios from "axios";
import {
  encryptAndStoreData,
  fetchUser,
  getUserEncryptedDataFromDb,
  saveUser,
  userFullDataDecrypted,
} from "../../data/api/calls";
import {
  useInitializeOAuth,
  useUserAccessLevel,
  useUserChannelConnected,
  useUserLoggedin,
} from "../../state/state";
import showToast from "../../utils/toastUtils";
import CryptoJS from "crypto-js";
import { Link, useNavigate } from "react-router-dom";
import { gapi } from "gapi-script";

const GoogleLoginComp = forwardRef((props, ref) => {
  const internalRef = useRef(null);

  useImperativeHandle(ref, () => ({
    click: () => {
      internalRef.current.click();
    },
  }));

  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);
  const [fetchUserData, setFetchUserData] = useState(false);
  const accessLevel = useUserAccessLevel((state) => state.accessLevel);
  const setAccessLevel = useUserAccessLevel((state) => state.setAccessLevel);
  const initializeOAuth = useInitializeOAuth((state) => state.initializeOAuth);
  const setInitializeOAuth = useInitializeOAuth(
    (state) => state.setInitializeOAuth,
  );
  const userChannelConnected = useUserChannelConnected(
    (state) => state.userChannelConnected,
  );
  const setUserChannelConnected = useUserChannelConnected(
    (state) => state.setUserChannelConnected,
  );
  useEffect(() => {
    // setInitializeOAuth(true);

    const fetchData = async () => {
      try {
        const fetchedUser = await fetchUser();

        console.log(fetchedUser);
        setFetchUserData(fetchedUser);
        console.log("fetched user data: ", fetchedUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataAndInitGAPI = async () => {
      try {
        console.log("google login INITIALIZED ");
        // Initialize gapi.client inside the try block
        gapi.load("client:auth2", () => {
          gapi.client.init({
            apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
            clientId: process.env.REACT_APP_CLIENT_ID,
            scope:
              "https://www.googleapis.com/auth/youtube.readonly " +
              "https://www.googleapis.com/auth/youtube.force-ssl " +
              "https://www.googleapis.com/auth/youtube " +
              "https://www.googleapis.com/auth/youtube.upload",
          });
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchDataAndInitGAPI();
  }, []);

  const isChannelRegistered = async (user_id, GUserData) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/ischannelRegistered`,
        {
          params: {
            user_id,
          },
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
          },
        },
      );

      console.log("is channel registered", response.data.success);
      if (response.data.success) {
        // addUserId(`TUBE_${GUserData.gId}`);
        const decryptedFullData = userFullDataDecrypted();
        if (
          !decryptedFullData ||
          decryptedFullData.user_id !== `TUBE_${GUserData.gId}`
        ) {
          try {
            const userDataFromDb = await getUserEncryptedDataFromDb(
              GUserData.gId,
            );
            console.log("userDataFromDb", userDataFromDb);
            encryptAndStoreData(userDataFromDb);
            localStorage.setItem("accessLevel", "L2");
            setAccessLevel(localStorage.getItem("accessLevel"));
            localStorage.setItem("channelConnected", 1);
            setUserChannelConnected(1);
            await saveUser({
              channelConnected: 1,
              email: localStorage.getItem("userRegEmail"),
            });
            console.log("I JUST LOGGEDDDD IN");
            navigate("/ideation");
          } catch (error) {
            encryptAndStoreData(GUserData);
            console.error("Error fetching user data:", error);
          }
        }

        // setUserLoggedIn(true);
        // localStorage.setItem("userLoggedin", true);
        setTimeout(async () => {
          const path = location.pathname;
          const pageName = path.substring(path.lastIndexOf("/") + 1);
          const currentURL = window.location.href;
          console.log("I got here and will redirect", currentURL);
          // if (pageName === `channel`) {
          //   localStorage.setItem("accessLevel", "L2");
          //   setAccessLevel(localStorage.getItem("accessLevel"));
          //   navigate("/ideation");
          // } else if (
          //   currentURL === process.env.REACT_APP_BASE_URL ||
          //   currentURL === `${process.env.REACT_APP_BASE_URL}/`
          // ) {
          //   localStorage.setItem("accessLevel", "L2");
          //   setAccessLevel(localStorage.getItem("accessLevel"));
          //   navigate("/ideation");
          // } else {
          //   return null;
          // }
        }, 3000);
      } else {
        encryptAndStoreData(GUserData);
        navigate("/channel");
      }
    } catch (error) {
      showToast(
        "error",
        "Your network is unstable. We couldn't log you in",
        2000,
      );
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const addUserId = async (user_id) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/addUserId`,
        {
          user_id,
          email: decryptedFullData.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
          },
        },
      );

      const data = response.data;
      if (data.success) {
        localStorage.setItem("accessLevel", "L2");
        navigate("/ideation");
      } else {
        console.log("Error occurred with adding user ID");
      }
    } catch (error) {
      console.error("Error Adding user Id:", error);
    }
  };

  const onLoginFailure = (res) => {
    console.log("Login Failed, res:", res);
    showToast("error", "Login Failed", 2000);
  };

  const onLoginSuccess = (res) => {
    console.log("Login Success, res:", res);
    const {
      email,
      givenName,
      familyName,
      name,
      imageUrl,
      tokenObj,
      googleId,
      expires_in,
    } = res.profileObj;

    const gToken = res.tokenObj.access_token;
    const expiryDate = res.tokenObj.expires_in;
    const GUserData = {
      email,
      firstName: givenName,
      lastName: familyName,
      fullName: name,
      imageUrl,
      gToken,
      expiryDate,
      bants: "jst for bants",
      gId: googleId,
    };
    encryptAndStoreData(GUserData);
    showToast("success", "Login Successful", 2000);
    setInitializeOAuth(false);
    navigate("/channel");

    // isChannelRegistered(`TUBE_${googleId}`, GUserData);
  };

  const handleLoginClick = () => {
    setInitialized(true);
  };

  return (
    <div>
      {/* {localStorage.getItem("channelConnected") === 0 && ( */}
      <>
        {initialized && (
          <GoogleApiInitializer
            apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
            ClientId={process.env.REACT_APP_CLIENT_ID}
            // initializeOnLoad={true}
          />
        )}
        <button onClick={() => handleLoginClick()}>
          <GoogleLogin
            // clientId={process.env.REACT_APP_CLIENT_ID}
            buttonText="Login with Google"
            onSuccess={onLoginSuccess}
            onFailure={onLoginFailure}
            cookiePolicy="single_host_origin"
            isSignedIn={true}
            className="google-login-button rounded-full"
            // redirectUri={`${process.env.REACT_APP_BASE_URL}/optimization`}
          />
        </button>
      </>
      {/* )} */}
    </div>
  );
});

export default GoogleLoginComp;
