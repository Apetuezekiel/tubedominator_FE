/* eslint-disable */
import axios from "axios";
import {
  useUserAuthToken,
  useUserData,
  useUserLoggedin,
} from "../../state/state";
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

export async function generateThumbnail(prompt) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/generateThumbnail`,
      {
        prompt,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          Authorization: `Bearer ${userFullDataDecrypted()?.token}`,
        },
      },
    );

    if (response.data.success) {
      console.log("Thumbnail", response);
      const thumbnailUrl = response.data.data.data[0].url;
      console.log("Thumbnail URL", thumbnailUrl);
      localStorage.setItem("generatedThumbnail", JSON.stringify(thumbnailUrl));
      return thumbnailUrl;
    } else {
      console.log("Error generating thumbnail");
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // You can handle the error here or rethrow it if needed
    throw error;
  }
}

export async function getCategorySavedIdeas(category) {
  try {
    const decryptedFullData = userFullDataDecrypted();
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/getCategorySavedIdeas?email=${decryptedFullData.email}&category=${category}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          Authorization: `Bearer ${decryptedFullData.token}`,
        },
      },
    );

    if (response.data.success) {
      console.log("Category Ideas", response.data.data);
      localStorage.setItem(
        "savedCatIdeasData",
        JSON.stringify(response.data.data),
      );
      return response.data.data;
    } else {
      console.log("No ideas for this category");
      showToast("error", response.data.message, 2000);
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // You can handle the error here or rethrow it if needed
    throw error;
  }
}

// export async function getSavedIdeas() {
//   const decryptedFullData = userFullDataDecrypted();
//   try {
//     const response = await axios.get(
//       `${process.env.REACT_APP_API_BASE_URL}/getAllSavedIdeas?email=${decryptedFullData.email}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": process.env.REACT_APP_X_API_KEY,
//           Authorization: `Bearer ${decryptedFullData.token}`,
//         },
//       },
//     );

//     const data = response.data.data;
//     console.log("response.data.data", response.data.data);

//     // Get saved data from localStorage
//     let savedData = localStorage.getItem("savedIdeasData");

//     if (!savedData) {
//       console.log("Local storage data not found.");
//       // Set "savedIdeasData" if not found
//       localStorage.setItem("savedIdeasData", JSON.stringify(data));
//       savedData = data;
//     } else if (JSON.parse(savedData).length !== data.length) {
//       localStorage.setItem("savedIdeasData", JSON.stringify(data));
//       savedData = data;
//     } else {
//       try {
//         savedData = JSON.parse(savedData);
//       } catch (parseError) {
//         console.error("Error parsing local storage data:", parseError);
//         savedData = [];
//       }

//       if (!Array.isArray(savedData)) {
//         console.error("Local storage data is not an array.");
//         savedData = [];
//       }

//       console.log("Serving local storage data");
//     }

//     return savedData;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return [];
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
    console.log("response.data.data", data);

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export async function checkClientAndApiKey() {
  const userRegEmail = localStorage.getItem("userRegEmail");
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/checkClientAndApiKey?email=${
        userRegEmail || decryptedFullData.email
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
        },
      },
    );

    const data = response.data.success;
    console.log("checkClientAndApiKey", data);

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export async function fetchUser() {
  const userRegEmail = localStorage.getItem("userRegEmail");
  console.log("userRegEmail, userRegEmail", userRegEmail);

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/fetchUser?email=${
        userRegEmail || decryptedFullData.email
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
        },
      },
    );

    const data = response.data;
    console.log("response.data", response);

    return data.user;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export async function getUserEncryptedDataFromDb(gId) {
  console.log("Fetching use details from DB");
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
    localStorage.setItem("encryptedGData", data);
    return decryptAndRetrieveData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
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

export const findCountryAndLanguage = (dataSet, array) => {
  const defaultCountry = "Global";
  const defaultLanguage = "English";

  const foundItem = array.find(
    (item) =>
      item.countryCode === dataSet.countryCode &&
      item.languageCode === dataSet.languageCode,
  );

  if (foundItem) {
    return {
      country: foundItem.country,
      language: foundItem.language,
    };
  } else {
    return {
      country: defaultCountry,
      language: defaultLanguage,
    };
  }
};

// Helper Functions
export const encryptAndStoreData = (data) => {
  console.log("Encrypting User Data", data);
  const secretKey = "+)()^77---<@#$>";
  const jsonData = JSON.stringify(data);
  const encryptedGData = CryptoJS.AES.encrypt(jsonData, secretKey).toString();
  localStorage.setItem("encryptedGData", encryptedGData);
  console.log("Saved User Data to localhost");
  return encryptedGData;
};

export const analyzeVideos = (videoData) => {
  let totalLength = 0;
  let totalAge = 0;
  let totalLikesComments = 0;
  let leastLikesComments = Infinity;
  let mostLikesComments = 0;

  // Convert date strings to Date objects
  const today = new Date();

  for (const video of videoData) {
    // Calculate video length in seconds
    const videoLength = parseInt(video.statistics.viewCount);
    const formattedLength = formatVideoLength(videoLength);

    // Calculate video age in days, weeks, and months
    const publishedAt = new Date(video.snippet.publishedAt);

    // Check if the publishedAt date is valid
    if (!isNaN(publishedAt)) {
      const videoAge = calculateVideoAge(publishedAt, today);

      // Calculate average likes & comments per 1,000 views
      const likesCommentsRatio =
        ((parseInt(video.statistics.likeCount) +
          parseInt(video.statistics.commentCount)) /
          parseInt(video.statistics.viewCount)) *
        1000;

      // Update total values
      totalLength += videoLength;
      totalAge += videoAge.days; // Use only days for simplicity in calculation
      totalLikesComments += likesCommentsRatio;

      // Update least and most likes & comments
      leastLikesComments = Math.min(leastLikesComments, likesCommentsRatio);
      mostLikesComments = Math.max(mostLikesComments, likesCommentsRatio);
    }
  }

  // Calculate averages
  const averageLength = formatVideoLength(totalLength / videoData.length);
  const averageAge = isNaN(totalAge)
    ? "undefined days"
    : formatVideoAge(totalAge / videoData.length);
  const averageLikesComments = totalLikesComments / videoData.length;

  return {
    averageVideoLength: averageLength,
    shortestVideoLength: formatVideoLength(
      Math.min(
        ...videoData.map((video) => parseInt(video.statistics.viewCount)),
      ),
    ),
    longestVideoLength: formatVideoLength(
      Math.max(
        ...videoData.map((video) => parseInt(video.statistics.viewCount)),
      ),
    ),
    averageVideoAge: averageAge,
    newestVideoAge: formatVideoAge(
      Math.min(
        ...videoData.map((video) => new Date(video.snippet.publishedAt)),
      ),
    ),
    oldestVideoAge: formatVideoAge(
      Math.max(
        ...videoData.map((video) => new Date(video.snippet.publishedAt)),
      ),
    ),
    averageLikesComments: averageLikesComments.toFixed(2),
    leastLikesComments: leastLikesComments.toFixed(2),
    mostLikesComments: mostLikesComments.toFixed(2),
  };
};

// Helper function to format video length
export const formatVideoLength = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.round(seconds % 60);

  const formattedLength = [];
  if (hours > 0) formattedLength.push(`${hours} hrs`);
  if (minutes > 0) formattedLength.push(`${minutes} min`);
  if (remainingSeconds > 0) formattedLength.push(`${remainingSeconds} sec`);

  return formattedLength.join(" ");
};

// Helper function to calculate video age in days, weeks, and months
export const calculateVideoAge = (publishedAt, today) => {
  const millisecondsInDay = 1000 * 60 * 60 * 24;
  const millisecondsInWeek = millisecondsInDay * 7;
  const millisecondsInMonth = millisecondsInDay * 30; // Assuming a month has 30 days for simplicity

  const ageInDays = Math.floor((today - publishedAt) / millisecondsInDay);
  const ageInWeeks = Math.floor(ageInDays / 7);
  const ageInMonths = Math.floor(ageInDays / 30);

  return { days: ageInDays, weeks: ageInWeeks, months: ageInMonths };
};

// Helper function to format video age
export const formatVideoAge = (videoAge) => {
  if (videoAge.months > 0) return `${videoAge.months} months`;
  if (videoAge.weeks > 0) return `${videoAge.weeks} weeks`;
  return `${videoAge.days} days`;
};

export const mergedVideosChannelsData = (
  videos,
  videoDetails,
  channelDetails,
) => {
  // Create a map to store analyzed_video_details objects by video id
  const analyzedVideoDetailsMap = new Map();

  videoDetails.forEach((video) => {
    const videoId = video.id;
    analyzedVideoDetailsMap.set(videoId, video);
  });

  // Merge objects based on video id
  const mergedData = videos.map((video) => {
    const videoId = extractVideoId(video.link);
    const analyzedDetails = analyzedVideoDetailsMap.get(videoId);

    if (analyzedDetails) {
      return { ...video, ...analyzedDetails };
    } else {
      return video;
    }
  });

  // Independent merge with channel_details based on channel ID
  const finalMergedData = mergedData.map((video) => {
    const channelId = video.snippet.channelId;
    const channelDetail = channelDetails.find(
      (detail) => detail.channel_id === channelId,
    );

    if (channelDetail) {
      // // Log relevant information before returning
      // console.log("channelId:", channelId);
      // console.log("channelDetail:", channelDetail);

      return { ...video, channel_details: channelDetail };
    } else {
      return video;
    }
  });

  const keywordVideosInfoWithIndex = finalMergedData.map((item, index) => ({
    ...item,
    index: index + 1,
  }));

  return keywordVideosInfoWithIndex;
};

// Function to extract video id from YouTube link
export const extractVideoId = (link) => {
  const regex = /[?&]v=([^&#]*)/;
  const match = link.match(regex);
  return match ? match[1] : null;
};

export const analyzeCompetitionInsights = (videos) => {
  // Function to convert duration string to seconds
  const durationToSeconds = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Calculate average, shortest, and longest video lengths
  const videoLengths = videos.map((video) =>
    durationToSeconds(video.contentDetails.duration),
  );
  const averageVideoLength = Math.round(
    videoLengths.reduce((a, b) => a + b, 0) / videos.length,
  );
  const shortestVideoLength = Math.min(...videoLengths);
  const longestVideoLength = Math.max(...videoLengths);

  // Calculate average, newest, and oldest video ages in days
  const currentDate = new Date("2023-11-14");
  const videoAges = videos.map((video) => {
    const publishedDate = new Date(video.snippet.publishedAt);
    return Math.floor((currentDate - publishedDate) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  });
  const averageVideoAge = Math.round(
    videoAges.reduce((a, b) => a + b, 0) / videos.length,
  );
  const newestVideoAge = Math.min(...videoAges);
  const oldestVideoAge = Math.max(...videoAges);

  // Calculate average, least, and most likes and comments
  const likes = videos.map((video) => parseInt(video.statistics.likeCount));
  const comments = videos.map((video) =>
    parseInt(video.statistics.commentCount),
  );
  const combinedLikesComments = likes.map(
    (like, index) => like + comments[index],
  );
  const averageLikesComments = Math.round(
    combinedLikesComments.reduce((a, b) => a + b, 0) / videos.length,
  );
  const leastLikesComments = Math.min(...combinedLikesComments);
  const mostLikesComments = Math.max(...combinedLikesComments);
  const topTags = analyzePopularTags(videos);

  return {
    averageVideoLength,
    shortestVideoLength,
    longestVideoLength,
    averageVideoAge,
    newestVideoAge,
    oldestVideoAge,
    averageLikesComments,
    leastLikesComments,
    mostLikesComments,
    topTags,
  };
};

const analyzePopularTags = (videos) => {
  // Create an object to store tag occurrences
  const tagOccurrences = {};

  // Iterate through each video and count tag occurrences
  videos.forEach((video) => {
    const tags = video.snippet.tags || [];

    tags.forEach((tag) => {
      // Increment tag occurrence count
      tagOccurrences[tag] = (tagOccurrences[tag] || 0) + 1;
    });
  });

  // Convert tag occurrences to an array of objects for sorting
  const tagArray = Object.keys(tagOccurrences).map((tag) => ({
    tag,
    count: tagOccurrences[tag],
  }));

  // Sort tags by occurrence count in descending order
  const sortedTags = tagArray.sort((a, b) => b.count - a.count);

  // Get the top 10 tags
  const topTags = sortedTags.slice(0, 10).map((tagObj) => tagObj.tag);

  return topTags;
};

export const calculateChancesOfSuccess = (difficulty, ageOfVideos, channel) => {
  // Validate input values
  const validLevels = ["Low", "Medium", "High"];
  if (!validLevels.includes(difficulty) || !validLevels.includes(ageOfVideos)) {
    return { error: "Invalid input for Difficulty or Competition." };
  }

  const validChannels = ["Small", "Medium", "Large"];
  if (!validChannels.includes(channel)) {
    return { error: "Invalid input for Channel." };
  }

  // Assign weightage to each metric
  const weights = {
    difficulty: 0.4,
    ageOfVideos: 0.3,
    channel: 0.3,
  };

  // Assign scores to each level
  const scores = {
    Low: 0.2,
    Medium: 0.5,
    High: 0.8,
    Small: 0.2,
    Medium: 0.5,
    Large: 0.8,
  };

  // Calculate total score
  const totalScore =
    scores[difficulty] * weights.difficulty +
    scores[ageOfVideos] * weights.ageOfVideos +
    scores[channel] * weights.channel;

  // Assign a level based on the total score
  let level;
  if (totalScore >= scores.High) {
    level = "High";
  } else if (totalScore >= scores.Medium) {
    level = "Medium";
  } else {
    level = "Low";
  }

  // Calculate percentage (normalize totalScore to a percentage)
  const percentage = Math.round((totalScore / scores.High) * 100);

  return {
    level,
    percentage: `${percentage}/100`,
  };
};

export const secondsToTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${Math.round(hours + minutes / 60)} hrs`;
  } else {
    return `${minutes} mins`;
  }
};

export const daysToTime = (days) => {
  if (days >= 365) {
    const years = Math.round(days / 365);
    return `${years} ${years === 1 ? "year" : "years"}`;
  } else if (days >= 30) {
    const months = Math.round(days / 30);
    return `${months} ${months === 1 ? "month" : "months"}`;
  } else if (days >= 7) {
    const weeks = Math.round(days / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
  } else if (days >= 1) {
    return `${days} ${days === 1 ? "day" : "days"}`;
  } else if (days === 0) {
    return "1 day";
  } else {
    return "N/A";
  }
};

export const saveYoutubePost = async (
  videoId,
  title,
  description,
  tags,
  thumbnails,
  likeCount,
  commentCount,
  viewCount,
) => {
  console.log("data to save", {
    video_id: videoId,
    video_title: title,
    video_description: description,
    video_tags: tags,
    video_thumbnail: thumbnails,
    email: userFullDataDecrypted()?.email,
    likeCount,
    commentCount,
    viewCount,
  });
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/saveYoutubePost`,
      {
        video_id: videoId,
        video_title: title,
        video_description: description,
        video_tags: tags,
        video_thumbnail: thumbnails,
        email: userFullDataDecrypted()?.email,
        likeCount,
        commentCount,
        viewCount,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          Authorization: `Bearer ${userFullDataDecrypted()?.token}`,
        },
      },
    );

    console.log("response", response);

    if (response.data.success) {
      console.log("SUCCESS: Youtube Video saved successfully");
      // showToast("success", "Youtube Video saved successfully", 2000);
      // localStorage.setItem(`${videoId}-preserved`, "true");
    } else {
      console.log("ERROR: Couldn't save youtube Video");
      // showToast("error", "Youtube Video wasn't saved. Try again", 2000);
    }
  } catch (error) {
    console.error("Error saving YouTube Video:", error);
  }
};

export const getYoutubePost = async (videoId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/getYoutubePosts`,
      {
        params: {
          email: userFullDataDecrypted()?.email,
          video_id: videoId,
        },
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          Authorization: `Bearer ${userFullDataDecrypted()?.token}`,
        },
      },
    );

    console.log("response", response);

    if (response.data.success) {
      console.log("gottenYoutubePost", response.data.data);
      return response.data.data;
    } else {
      showToast(
        "error",
        "Original Youtube post werent retrieved. Try again",
        2000,
      );
    }
  } catch (error) {
    console.error("Error fetching Original YouTube post:", error);
    showToast(
      "error",
      "An error occurred fetching video. Please try again later.",
      2000,
    );
  }
};

export const getAllYoutubePosts = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/getAllYoutubePosts`,
      {
        params: {
          email: userFullDataDecrypted()?.email,
        },
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          Authorization: `Bearer ${userFullDataDecrypted()?.token}`,
        },
      },
    );

    console.log("response", response);

    if (response.data.success) {
      return response.data.data;
    } else {
      showToast("error", "Youtube videos werent retrieved. Try again", 2000);
      return [];
    }
  } catch (error) {
    console.error("Error fetching YouTube Video:", error);
    return [];
  }
};

// DRAFT POSTS
export const checkDraftExistence = async (videoId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/checkDraftExistence`,
      {
        params: {
          video_id: videoId,
        },
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          Authorization: `Bearer ${userFullDataDecrypted()?.token}`,
        },
      },
    );

    return response.data.exists;
  } catch (error) {
    console.error("Error confirming if draft post exists", error);
  }
};

export const deleteDraftPost = async (videoId) => {
  try {
    const responseDelete = await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/deleteDraftPost`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          Authorization: `Bearer ${decryptedFullData.token}`,
        },
        params: {
          video_id: videoId,
        },
      },
    );
    console.log("Draft removed successfully");
    if (responseDelete.data.success) {
      showToast("success", "Draft post removed from Search Terms", 2000);
    } else {
      showToast("error", "Draft post wasn't removed. Try again", 2000);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getDraftPost = async (videoId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/getDraftPost`,
      {
        params: {
          email: userFullDataDecrypted()?.email,
          video_id: videoId,
        },
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          Authorization: `Bearer ${userFullDataDecrypted()?.token}`,
        },
      },
    );

    console.log("response", response);

    if (response.data.success) {
      console.log("gottenDraftPost", response.data.data);
      return response.data.data;
    } else {
      showToast("error", "Draft post wasn't retrieved. Try again", 2000);
      return [];
    }
  } catch (error) {
    console.error("Error fetching Original YouTube post:", error);
    showToast(
      "error",
      "An error occurred fetching video. Please try again later.",
      2000,
    );
  }
};

// console.log("getDraftPost", await getDraftPost("BdG8R9pqHA0"));

// console.log("checkDraftExistence()", checkDraftExistence("BdG8R9pqHA0"));

// AI
export async function getVideoTemplates() {
  console.log("Loading video Templates");

  // Check if data exists in local storage
  const localData = localStorage.getItem("videoTemplates");

  if (localData) {
    // Parse the data from local storage
    const localVideoTemplates = JSON.parse(localData);
    console.log("videoTemplates from localstorage:", localVideoTemplates);
    return localVideoTemplates;

    // Make the API call
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/getAllVideoTemplates`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            Authorization: `Bearer ${userFullDataDecrypted()?.token}`,
          },
        },
      );

      if (response.data.success) {
        const newData = response.data.data.videos;

        // Check if the new data length is longer than that in local storage
        if (newData.length > localVideoTemplates.length) {
          console.log("Updating local storage with new data");
          localStorage.setItem("videoTemplates", JSON.stringify(newData));
        }

        console.log("getVideoTemplates", newData);
        return newData;
      } else {
        console.error("Error fetching data:", response.data.error);
        return localVideoTemplates;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return localVideoTemplates;
    }
  } else {
    // If data doesn't exist in local storage, go ahead with the API call
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/getAllVideoTemplates`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            Authorization: `Bearer ${userFullDataDecrypted()?.token}`,
          },
        },
      );

      if (response.data.success) {
        const newData = response.data.data.videos;
        console.log("getVideoTemplates", newData);
        localStorage.setItem("videoTemplates", JSON.stringify(newData));
        return newData;
      } else {
        console.error("Error fetching data:", response.data.error);
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }
}

// export const generateVideo = async (source, prompt, templateId) => {
//   if (!source) {
//     return null;
//   }

//   console.log("Generating video, please hold", source);

//   const endpoint =
//     source === "text" ? "generateVideoFromText" : "generateVideoFromUrl";

//   try {
//     const response = await axios.post(
//       `${process.env.REACT_APP_API_BASE_URL}/${endpoint}`,
//       {
//         prompt,
//         templateId,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": process.env.REACT_APP_X_API_KEY,
//           Authorization: `Bearer ${userFullDataDecrypted()?.token}`,
//         },
//       },
//     );

//     if (response.data.success) {
//       console.log("VIDEO CREATED SUCCESSFULLY: ", response.data.data);
//       return response.data.data;
//       // const renderingVideo = renderVideo(response.data.data._id);
//       // return renderingVideo.data.data.accepted;
//     } else {
//       console.error("Error creating Video:", response.data.error);
//       return null;
//     }
//   } catch (error) {
//     console.error("Error creating Video:", error);
//     return null;
//   }
// };

export const generateVideo = async (source, prompt, templateId) => {
  if (!source) {
    return null;
  }

  console.log("Generating video, please hold", source);

  const endpoint = source === "text" ? "text" : "html";

  try {
    const response = await axios.post(
      `https://apis.elai.io/api/v1/story/${endpoint}`,
      {
        from: prompt,
        templateId: "642e88ff081e30cae04420a4",
        folderId: "6565c5e36ea56bc610eb2138",
      },
      {
        headers: {
          "Content-Type": "application/json",
          // "x-api-key": process.env.REACT_APP_X_API_KEY,
          Authorization: `Bearer AY9rruDSr9obNYh1ip7palwlli0LaN7H`,
        },
      },
    );

    if (response) {
      console.log("VIDEO CREATED SUCCESSFULLY: ", response.data);
      return response.data;
      // const renderingVideo = renderVideo(response.data.data._id);
      // return renderingVideo.data.data.accepted;
    } else {
      console.error("Error creating Video:", response);
      return null;
    }
  } catch (error) {
    console.error("Error creating Video:", error);
    return null;
  }
};

export const generateVideoSlides = async (video_id) => {
  if (!video_id) {
    console.error("Video Id wasn't passed to rendering engine");
    return null;
  }

  try {
    const response = await axios.post(
      `https://apis.elai.io/api/v1/story/generate-slides/${video_id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          Authorization: `Bearer AY9rruDSr9obNYh1ip7palwlli0LaN7H`,
        },
      },
    );

    if (response) {
      console.log("VIDEO SLIDES GENERATED SUCCESSFULLY", response.data);
      return response.data;
    } else {
      console.error("Error Generating Video slides:", response);
      return null;
    }
  } catch (error) {
    console.error("Error Generating Video slides:", error);
    return null;
  }
};

export const renderVideo = async (video_id) => {
  if (!video_id) {
    console.error("Video Id wasn't passed to rendering engine");
    return null;
  }

  try {
    const response = await axios.post(
      `https://apis.elai.io/api/v1/videos/render/${video_id}`,
      {}, // Request data goes here
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          Authorization: `Bearer AY9rruDSr9obNYh1ip7palwlli0LaN7H`,
        },
      },
    );

    if (response) {
      console.log("VIDEO RENDERED SUCCESSFULLY", response.data);
      return response.data;
    } else {
      console.error("Error creating Video:", response);
      return null;
    }
  } catch (error) {
    console.error("Error creating Video:", error);
    return null;
  }
};

export const retrieveVideo = async (video_id) => {
  if (!video_id) {
    console.error("Video Id wasn't passed to Video retrieval engine");
    return null;
  }

  try {
    const response = await axios.get(
      `https://apis.elai.io/api/v1/videos/${video_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          Authorization: `Bearer AY9rruDSr9obNYh1ip7palwlli0LaN7H`,
        },
      },
    );

    console.log("VIDEO RETRIEVED SUCCESSFULLY", response.data);
    return response.data;
  } catch (error) {
    console.error("Error Retrieving Video:", error);
    return null;
  }
};

// generateVideo("text", "\n\nTitle: \"The Email Marketing Guide for Beginners: Tips and Tricks\"\n\nKeywords: email marketing, beginners, guide, tips, tricks\n\nTags: email, marketing strategy, email list, email campaign, email software, email automation\n\nHashtags: #emailmarketing #beginnersguide #emailtips #emailtricks #emailstrategy #emailsoftware #emailautomation\n\nWelcome to our Youtube channel where we provide valuable tips and tricks for beginners in the world of email marketing! In today's video, we will be discussing everything you need to know to get started with your email marketing journey. From building an email list to creating successful email campaigns, we've got you covered.\n\nEmail marketing is a powerful tool that can help businesses reach their target audience and convert them into loyal customers. However, it can be overwhelming for beginners. That's why we have created this comprehensive guide to help you understand the basics and excel in your email marketing efforts.\n\nFirstly, let's talk about the importance of building an email list. Your email list is a valuable asset as it consists of people who have willingly given you their contact information, showing interest in your brand. We'll share some effective strategies to grow your email list and keep your subscribers engaged.\n\nNext, we'll dive into creating a successful email campaign. From subject lines to email design, we'll provide tips to ensure your emails stand out and drive conversions. We'll also discuss email automation and how it can save you time while still providing personalized communication with your audience.\n\nNo email marketing guide is complete without discussing the best email marketing software available. We'll provide an overview of popular email marketing platforms and help you choose the best one for your business.\n\nSo, whether you're a small business owner or a marketing newbie, this video has something for everyone. Don't forget to like and subscribe to our channel for more helpful tips on email marketing. Also, comment down below with any questions or topics you would like us to cover in our upcoming videos.\n\nThank you for watching and happy email marketing! #emailmarketingforbeginners #emailstrategy #emaillistgrowth", "642e88ff081e30cae04420a4")

// export const saveYoutubePost = async (
//   videoId,
//   title,
//   description,
//   tags,
//   thumbnails,
//   likeCount,
//   commentCount,
//   viewCount,
// ) => {
//   console.log("data to save", {
//     video_id: videoId,
//     video_title: title,
//     video_description: description,
//     video_tags: tags,
//     video_thumbnail: thumbnails,
//     email: userFullDataDecrypted()?.email,
//     likeCount,
//     commentCount,
//     viewCount,
//   });
//   try {
//     const response = await axios.post(
//       `${process.env.REACT_APP_API_BASE_URL}/saveYoutubePost`,
//       {
//         video_id: videoId,
//         video_title: title,
//         video_description: description,
//         video_tags: tags,
//         video_thumbnail: thumbnails,
//         email: userFullDataDecrypted()?.email,
//         likeCount,
//         commentCount,
//         viewCount,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": process.env.REACT_APP_X_API_KEY,
//           Authorization: `Bearer ${userFullDataDecrypted()?.token}`,
//         },
//       },
//     );

//     console.log("response", response);

//     if (response.data.success) {
//       showToast("success", "Youtube Video saved successfully", 2000);
//       // localStorage.setItem(`${videoId}-preserved`, "true");
//     } else {
//       showToast("error", "Youtube Video wasn't saved. Try again", 2000);
//     }
//   } catch (error) {
//     console.error("Error saving YouTube Video:", error);
//     showToast(
//       "error",
//       "An error occurred saving video. Please try again later.",
//       2000,
//     );
//   }
// };

// getVideoTemplates();
