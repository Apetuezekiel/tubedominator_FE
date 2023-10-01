/* eslint-disable */
import axios from "axios";
// import { useUserAuthToken } from "../../state/state";
// import { useUser } from "@clerk/clerk-react";
import CryptoJS from "crypto-js";
import { useUserAuthToken, useUserLoggedin } from "../../state/state";

// import { getUserFromClerk } from "../../components/Navbar";

// const userAuthToken = useUserAuthToken((state) => state.userAuthToken);
export const decryptAndRetrieveData = (data) => {
  const secretKey = "+)()^77---<@#$>";

  if (data) {
    const decryptedBytes = CryptoJS.AES.decrypt(data, secretKey);
    const decryptedData = JSON.parse(
      decryptedBytes.toString(CryptoJS.enc.Utf8),
    );
    return decryptedData;
  }
  return null;
};

export const userFullDataDecrypted = () => {
  const encryptedGData = localStorage.getItem("encryptedGData");
  const decryptedFullData = decryptAndRetrieveData(encryptedGData);

  return decryptedFullData;
};

export async function getSavedIdeas() {
  const decryptedFullData = userFullDataDecrypted();

  const token = JSON.parse(localStorage.getItem("authToken"));
  const clerkUser = JSON.parse(localStorage.getItem("clerkUser"));

  console.log("tokentokentokentokentokentokentoken", clerkUser);
  try {
    const response = await axios.get(
      "http://localhost:8080/api/getAllSavedIdeas",
      {
        params: {
          email: decryptedFullData.email,
        },
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
          Authorization: `Bearer ${decryptedFullData.token}`,
        },
      },
    );
    // return response.data;
    const data = response.data.data;
    // Get saved data from localStorage
    let savedData = JSON.parse(localStorage.getItem("savedIdeasData"));

    // Compare the length of the API data with the localStorage data
    if (!savedData || savedData.length < data.length) {
      console.log("NOT serving local storage data");

      // Update localStorage if API data is longer
      localStorage.setItem("savedIdeasData", JSON.stringify(data));
      return savedData;
    } else {
      console.log("serving local storage data");

      localStorage.setItem("savedIdeasData", JSON.stringify(data));
      savedData = JSON.parse(localStorage.getItem("savedIdeasData"));
      return savedData;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error to handle it in the component if needed
  }
}

export async function getUserEncryptedDataFromDb(gId) {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/getUserEncryptedData",
      {
        params: {
          user_id: `TUBE_${gId}`,
        },
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
        },
      },
    );
    const data = response.data.data.encryptedData;
    encryptAndStoreData(data);
    return decryptAndRetrieveData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error to handle it in the component if needed
  }
}

export async function getUserEncryptedData() {
  const userLoggedIn = useUserLoggedin((state) => state.userLoggedIn);
  const setUserLoggedIn = useUserLoggedin((state) => state.setUserLoggedIn);
  const userEncryptedData = localStorage.getItem("encryptedFullData");
  const decryptedFullData = decryptAndRetrieveData(userEncryptedData);
  setUserLoggedIn(true);
  // const { isLoaded, isSignedIn, user } = useUser();
  // const userAuthToken = useUserAuthToken((state) => state.userAuthToken);
  // const setUserAuthToken = useUserAuthToken((state) => state.setUserAuthToken);
  let userFromClerk = null;
  if (userLoggedIn) {
    // userFromClerk = getUserFromClerk();
    // console.log("user============= from api call.js=", user);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/getUserEncryptedData",
        {
          params: {
            // user_id: "user_2UlxAuRhXLeqwAQUhNMJFittkFD"
            user_id: decryptedFullData.user_id,
          },
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
          },
        },
      );
      // return response.data;
      const data = response.data.data.encryptedData;
      console.log("datadatadatadata", data);
      // Get saved data from localStorage
      // const userEncryptedData = localStorage.getItem("encryptedFullData");
      // const decryptedFullData = decryptAndRetrieveData(userEncryptedData);

      // Compare the length of the API data with the localStorage data
      if (!userEncryptedData) {
        console.log("encryptedFullData Fresh from API");

        // Update localStorage if API data is longer
        const decryptedFullData = decryptAndRetrieveData(data);
        setUserLoggedIn(true);
        return decryptedFullData;
      } else {
        console.log("encryptedFullData from local storage");
        setUserLoggedIn(true);
        return decryptedFullData;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Rethrow the error to handle it in the component if needed
    }
  }
}

// Helper Functions
const encryptAndStoreData = (data) => {
  const secretKey = "+)()^77---<@#$>";
  const jsonData = JSON.stringify(data);
  const encryptedGData = CryptoJS.AES.encrypt(jsonData, secretKey).toString();
  localStorage.setItem("encryptedGData", encryptedGData);
  return encryptedGData;
};

// getUserEncryptedDataFromDb();