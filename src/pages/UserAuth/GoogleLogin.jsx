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
  userFullDataDecrypted,
} from "../../data/api/calls";
import { useUserAccessLevel, useUserLoggedin } from "../../state/state";
import showToast from "../../utils/toastUtils";
import CryptoJS from "crypto-js";
import { Link, useNavigate } from "react-router-dom";

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

  useEffect(() => {
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
            navigate("/ideation");
          } catch (error) {
            encryptAndStoreData(GUserData);
            console.error("Error fetching user data:", error);
            // Handle the error as needed
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
    // setUserLoggedIn(true);
    // localStorage.setItem("userLoggedin", true);
    isChannelRegistered(`TUBE_${googleId}`, GUserData);
  };

  const handleLoginClick = () => {
    setInitialized(true);
  };

  return (
    <div>
      {/* {initialized && (
        <GoogleApiInitializer
          apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
          ClientId={process.env.REACT_APP_CLIENT_ID}
          initializeOnLoad={true}
        />
      )} */}
      {initialized && fetchUserData.apiKey && fetchUserData.ClientId && (
        <GoogleApiInitializer
          // apiKey={fetchUserData.apiKey}
          clientId={fetchUserData.ClientId}
          initializeOnLoad={true}
        />
      )}

      {/* {(!fetchUserData.apiKey || !fetchUserData.ClientId) &&
        (() => {
          console.error("Error: apiKey or ClientId is not available");
        })()} */}

      {fetchUserData.apiKey && fetchUserData.ClientId && (
        <button onClick={() => handleLoginClick()}>
          <GoogleLogin
            // ClientId={process.env.REACT_APP_CLIENT_ID}
            clientId={fetchUserData.ClientId}
            buttonText="Login with Google"
            onSuccess={onLoginSuccess}
            onFailure={onLoginFailure}
            cookiePolicy="single_host_origin"
            isSignedIn={true}
            className="google-login-button rounded-full"
            redirectUri="http://localhost:3000/youtube"
          />
        </button>
      )}
    </div>
  );
});

export default GoogleLoginComp;
