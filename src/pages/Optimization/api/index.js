import axios from "axios";
import { userFullDataDecrypted } from "../../../data/api/calls";
const decryptedFullData = userFullDataDecrypted();

export async function fetchMyYoutubeInfo() {
  const userEmail = localStorage.getItem("userRegEmail");

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/fetchMyYoutubeInfo?email`,
      {
        params: {
          email: userEmail,
        },
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          gToken: decryptedFullData.gToken,
        },
      },
    );

    if (response.data.success) {
      const data = response.data.data;
      console.log("User youtube posts info retrieved successfully:", data);
      return data;
    } else {
      console.error(
        "Failed to retrieve user youtube posts info:",
        response.data.message,
      );
      return null;
    }
  } catch (error) {
    console.error("Error fetching user youtube posts info:", error);
    return null;
  }
}
