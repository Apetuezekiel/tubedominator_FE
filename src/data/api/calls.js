/* eslint-disable */
import axios from "axios";
import { useUserAuthToken, useUserLoggedin } from "../../state/state";
import showToast from "../../utils/toastUtils";
import CryptoJS from "crypto-js";

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

// export async function getSavedIdeas() {
//   const decryptedFullData = userFullDataDecrypted();
//   try {
//     const response = await axios.get(
//       "${process.env.REACT_APP_API_BASE_URL}/getAllSavedIdeas",
//       {
//         params: {
//           email: decryptedFullData.email,
//         },
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": process.env.REACT_APP_X_API_KEY,
//           Authorization: `Bearer ${decryptedFullData.token}`,
//         },
//       },
//     );
//     // return response.data;
//     const data = response.data.data;

//     // Get saved data from localStorage
//     let savedData = JSON.parse(localStorage.getItem("savedIdeasData"));

//     // Compare the length of the API data with the localStorage data
//     if (!savedData || savedData.length < data.length) {
//       console.log("NOT serving local storage data");

//       // Update localStorage if API data is longer
//       localStorage.setItem("savedIdeasData", JSON.stringify(data));
//       return savedData;
//     } else {
//       console.log("serving local storage data");

//       localStorage.setItem("savedIdeasData", JSON.stringify(data));
//       savedData = JSON.parse(localStorage.getItem("savedIdeasData"));
//       return savedData;
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// }

export async function getSavedIdeas() {
  const decryptedFullData = userFullDataDecrypted();
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/getAllSavedIdeas?email=${decryptedFullData.email}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          Authorization: `Bearer ${decryptedFullData.token}`,
        },
      },
    );

    const data = response.data.data;
    console.log("response.data.data", response.data.data);

    // Get saved data from localStorage
    let savedData = localStorage.getItem("savedIdeasData");

    if (savedData == "undefined" || savedData == null) {
      console.log("Local storage data not found.");
      // Set "savedIdeasData" if not found
      localStorage.setItem("savedIdeasData", JSON.stringify(data));
      savedData = data;
    } else if (JSON.parse(savedData).length < data.length) {
      localStorage.setItem("savedIdeasData", JSON.stringify(data));
      savedData = data;
    } else {
      try {
        savedData = JSON.parse(savedData);
      } catch (parseError) {
        console.error("Error parsing local storage data:", parseError);
        savedData = [];
      }

      if (!Array.isArray(savedData)) {
        console.error("Local storage data is not an array.");
        savedData = [];
      }

      console.log("Serving local storage data");
    }

    return savedData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function getUserEncryptedDataFromDb(gId) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/getUserEncryptedData`,
      {
        params: {
          user_id: `TUBE_${gId}`,
        },
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
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
  // const userLoggedIn = useUserLoggedin((state) => state.userLoggedIn);
  // const setUserLoggedIn = useUserLoggedin((state) => state.setUserLoggedIn);
  const userEncryptedData = localStorage.getItem("encryptedFullData");
  const decryptedFullData = decryptAndRetrieveData(userEncryptedData);
  localStorage.setItem("userLoggedin", true);
  const userLoggedIn = localStorage.getItem("userLoggedin");
  // setUserLoggedIn(true);
  if (userLoggedIn) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/getUserEncryptedData`,
        {
          params: {
            // user_id: "user_2UlxAuRhXLeqwAQUhNMJFittkFD"
            user_id: decryptedFullData.user_id,
          },
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
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
        // setUserLoggedIn(true);
        localStorage.setItem("userLoggedin", true);
        return decryptedFullData;
      } else {
        console.log("encryptedFullData from local storage");
        // setUserLoggedIn(true);
        localStorage.setItem("userLoggedin", true);

        return decryptedFullData;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Rethrow the error to handle it in the component if needed
    }
  }
}

export const deleteChannelKeyword = async (props, setUserChannelKeywords) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  try {
    setIsLoading(true);

    const responseDelete = await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/deleteUserKeyword`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          Authorization: `Bearer ${userFullDataDecrypted.token}`,
        },
        params: {
          keyword: props.keyword,
        },
      },
    );

    console.log("Data removed successfully", props.keyword);

    if (responseDelete.data.success) {
      setUserChannelKeywords((prevData) =>
        prevData.filter((d) => d.keyword !== props.keyword),
      );
      showToast("success", "Keyword removed from saved keywords", 2000);
    } else {
      showToast("error", "Saved keyword wasn't removed. Try again", 2000);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    setError(error);
  } finally {
    setIsLoading(false);
  }

  return { isLoading, error };
};

export const isChannelRegistered = async (user_id) => {
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

    return response.data.success;

  } catch (error) {
    showToast(
      "error",
      "Your network is unstable. We couldn't verify your channel details",
      2000,
    );
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Helper Functions
const encryptAndStoreData = (data) => {
  const secretKey = "+)()^77---<@#$>";
  const jsonData = JSON.stringify(data);
  const encryptedGData = CryptoJS.AES.encrypt(jsonData, secretKey).toString();
  localStorage.setItem("encryptedGData", encryptedGData);
  return encryptedGData;
};
