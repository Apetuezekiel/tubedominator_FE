/* eslint-disable */

import { React, useState, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import GoogleApiInitializer from "../../utils/GoogleApiInitializer";
import axios from "axios";
import {
  getUserEncryptedDataFromDb,
  userFullDataDecrypted,
} from "../../data/api/calls";
import { useUserLoggedin } from "../../state/state";
import showToast from "../../utils/toastUtils";
import CryptoJS from "crypto-js";
import { Link, useNavigate } from "react-router-dom";

const clientId =
  "372673946018-lu1u3llu6tqi6hmv8m2226ri9qev8bb8.apps.googleusercontent.com";
const apiKey = "AIzaSyBhnxmlAowrcFI7owW40YrsqI3xPVVk0IU";

function GoogleLoginComp() {
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);
  const userLoggedIn = useUserLoggedin((state) => state.userLoggedIn);
  const setUserLoggedIn = useUserLoggedin((state) => state.setUserLoggedIn);

  const encryptAndStoreData = (data) => {
    const secretKey = "+)()^77---<@#$>";
    const jsonData = JSON.stringify(data);
    const encryptedGData = CryptoJS.AES.encrypt(jsonData, secretKey).toString();
    localStorage.setItem("encryptedGData", encryptedGData);
    return encryptedGData;
  };

  const isChannelRegistered = async (user_id, GUserData) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/ischannelRegistered",
        {
          params: {
            user_id,
          },
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
          },
        },
      );

      console.log("is channel registered", response);
      if (response.data.success) {
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
          } catch (error) {
            encryptAndStoreData(GUserData);
            console.error("Error fetching user data:", error);
            // Handle the error as needed
          }
        }

        setUserLoggedIn(true);
        setTimeout(async () => {
          const currentURL = window.location.href;
          console.log("I got here and will redirect", currentURL);
          if (
            currentURL === "http://localhost:3000/channel" ||
            currentURL === "http://localhost:3000/channel/"
          ) {
            navigate("/ideation");
          } else if (
            currentURL === "http://localhost:3000" ||
            currentURL === "http://localhost:3000/"
          ) {
            navigate("/ideation");
          } else {
            return null;
          }
        }, 3000);
      } else {
        encryptAndStoreData(GUserData);
        setTimeout(async () => {
          navigate("/channel");
        }, 3000);
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

  const onLoginFailure = (res) => {
    console.log("Login Failed, res:", res);
    showToast("error", "Login Failed", 2000);
  };

  const onLoginSuccess = (res) => {
    console.log("Login Success, res:", res);
    const { email, givenName, familyName, name, imageUrl, tokenObj, googleId } =
      res.profileObj;

    const gToken = res.tokenObj.access_token;
    const GUserData = {
      email,
      firstName: givenName,
      lastName: familyName,
      fullName: name,
      imageUrl,
      gToken,
      gId: googleId,
    };
    showToast("success", "Login Successful", 2000);
    setUserLoggedIn(true);
    isChannelRegistered(`TUBE_${googleId}`, GUserData);
  };

  const handleLoginClick = () => {
    setInitialized(true);
  };

  return (
    <div>
      {initialized && (
        <GoogleApiInitializer
          apiKey={apiKey}
          clientId={clientId}
          initializeOnLoad={true}
        />
      )}
      <button onClick={handleLoginClick}>
        <GoogleLogin
          clientId={clientId}
          buttonText="Login with Google"
          onSuccess={onLoginSuccess}
          onFailure={onLoginFailure}
          cookiePolicy="single_host_origin"
          isSignedIn={true}
          className="google-login-button rounded-full"
        />
      </button>
    </div>
  );
}

export default GoogleLoginComp;
