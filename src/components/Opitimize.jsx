/* eslint-disable */
import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaYoutube } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { BiArrowBack, BiCopy, BiEdit, BiLoaderCircle } from "react-icons/bi";
import { thingsToFix, itemsFixed } from "../data/optimizeData";
import { useEffect } from "react";
import {
  useKeywordStore,
  useShowSearchTermPanel,
  useUserSavedSearchTerm,
  useUserYoutubeInfo,
} from "../state/state";
import {
  getYoutubePost,
  saveYoutubePost,
  userFullDataDecrypted,
  deleteDraftPost,
  checkDraftExistence,
  getDraftPost,
} from "../data/api/calls";
import axios from "axios";
import { FiCamera, FiLoader, FiSearch } from "react-icons/fi";
import { BiSearch } from "react-icons/bi";
import {
  AiFillCheckCircle,
  AiFillWarning,
  AiOutlineCopy,
  AiOutlineRollback,
} from "react-icons/ai";
import {
  BsFillBookmarkCheckFill,
  BsBookmark,
  BsFillPlusCircleFill,
} from "react-icons/bs";
import showToast from "../utils/toastUtils";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  ContextMenu,
  Filter,
  Page,
  ExcelExport,
  PdfExport,
  Edit,
  Inject,
} from "@syncfusion/ej2-react-grids";
import { Tooltip } from "react-tippy";
import SearchTerm from "./SearchTerm";
import { useNavigate } from "react-router-dom";
import { IoPencil } from "react-icons/io5";
import { MdDeleteSweep } from "react-icons/md";
import countriesWithLanguages from "../data/countries";
import { useLocation } from "react-router-dom";
import Loader from "./Loader";
import LoaderPanel from "./LoaderPanel";
// const exactKeywordData = useKeywordStore((state) => state.exactKeywordData);
// const setExactKeywordData = useKeywordStore(
//   (state) => state.setExactKeywordData,
// );

function Opitimize() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { videoId, likeCount, commentCount, viewCount } =
    state && state.customData ? state.customData : {};

  if (
    typeof videoId === "undefined" ||
    typeof likeCount === "undefined" ||
    typeof commentCount === "undefined" ||
    typeof viewCount === "undefined"
  ) {
    navigate("/optimization");
  }

  // console.log("videoId, likeCount, commentCount, viewCount", videoId, likeCount, commentCount, viewCount);
  const initialCountry = {
    countryCode: "US",
    languageCode: "en",
  };
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const decryptedFullData = userFullDataDecrypted();
  const userYoutubeData = useUserYoutubeInfo((state) => state.userYoutubeData);
  const setUserYoutubeData = useUserYoutubeInfo(
    (state) => state.setUserYoutubeData,
  );
  const showSearchTermPanel = useShowSearchTermPanel(
    (state) => state.showSearchTermPanel,
  );
  const setShowSearchTermPanel = useShowSearchTermPanel(
    (state) => state.setShowSearchTermPanel,
  );
  const [revertToOriginalPost, setRevertToOriginalPost] = useState(false);
  const [newTemplateData, setNewTemplateData] = useState({
    title: "",
    content: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [unfixed, setUnfixed] = useState([]);
  const [fixed, setFixed] = useState([]);
  const [activeView, setActiveView] = useState("thingsToFix");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [exactKeywordData, setExactKeywordData] = useState(false);
  const [relatedKeywordData, setRelatedKeywordData] = useState(false);
  const [isSavedSearchTerm, setIsSavedSearchTerm] = useState(false);
  const [processingBookmarked, setProcessingBookmarked] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [userSearchTerms, setUserSearchTerms] = useState([]);
  const [isSearchTermFavorite, setIsSearchTermFavorite] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [addTemplateBox, setAddTemplateBox] = useState(false);
  const [updatingYtPost, setUpdatingYtPost] = useState(false);
  const [saveUserTemplateSuccess, setSaveUserTemplateSuccess] = useState(false);
  const [updateUserTemplate, setUpdateUserTemplate] = useState(false);
  const [updateUserTemplateSuccess, setUpdateUserTemplateSuccess] =
    useState(false);
  const [deleteUserTemplate, setDeleteUserTemplate] = useState(-1);
  const [deleteUserTemplateSuccess, setDeleteUserTemplateSuccess] =
    useState(false);
  const [saveUserTemplatesSuccess, setSaveUserTemplatesSuccess] =
    useState(false);
  const [fetchingUserTemplates, setFetchingUserTemplates] = useState(false);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [editUserTemplate, setEditUserTemplate] = useState(-1);
  const [userChannelTemplates, setUserChannelTemplates] = useState([]);
  const [selectedYoutubePost, setSelectedYoutubePost] = useState({
    title: "",
    thumbnail: "",
  });
  const [processedUserSearchTerms, setProcessedUserSearchTerms] = useState([]);
  const userSavedSearchTerm = useUserSavedSearchTerm(
    (state) => state.userSavedSearchTerm,
  );
  const setUserSavedSearchTerm = useUserSavedSearchTerm(
    (state) => state.setUserSavedSearchTerm,
  );
  const [draftExists, setDraftExists] = useState(false);
  const [savingToBookmark, setSavingToBookmark] = useState(false);
  const [removingFromBookmark, setRemovingFromBookmark] = useState(false);
  const [youtubeDraftPost, setYoutubeDraftPost] = useState([]);

  const targetVideoData = userYoutubeData.find(
    (videoData) => videoData.videoId === videoId,
  );

  // const [formData, setFormData] = useState({
  //   title: targetVideoData?.title !== undefined ? String(targetVideoData.title) : "",
  //   description: targetVideoData?.description !== undefined
  //     ? String(targetVideoData.description)
  //     : "",
  //   tags: targetVideoData?.tags !== undefined ? String(targetVideoData.tags) : "",
  //   thumbnail: targetVideoData?.thumbnails?.url !== undefined
  //     ? String(targetVideoData.thumbnails.url)
  //     : "",
  // });
  // const [formData, setFormData] = useState({
  //   title:
  //     userYoutubeData[0]?.title !== undefined
  //       ? String(userYoutubeData[0].title)
  //       : "",
  //   description:
  //     userYoutubeData[0]?.description !== undefined
  //       ? String(userYoutubeData[0].description)
  //       : "",
  //   tags:
  //     userYoutubeData[0]?.tags !== undefined
  //       ? String(userYoutubeData[0].tags)
  //       : "",
  //   thumbnail: userYoutubeData[0]?.thumbnails.url !== undefined
  //     ? String(userYoutubeData[0].thumbnails.url)
  //     : "",
  // });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    thumbnail: "",
  });
  // const [formData, setFormData] = useState({
  //   title: String(youtubeDraftPost[0]?.video_title)
  //     ? userYoutubeData[0]?.title !== undefined
  //       ? String(userYoutubeData[0].title)
  //       : ""
  //     : "",
  //   description: String(youtubeDraftPost[0]?.video_description)
  //     ? userYoutubeData[0]?.description !== undefined
  //       ? String(userYoutubeData[0].description)
  //       : ""
  //     : "",
  //   tags: String(youtubeDraftPost[0]?.video_tags)
  //     ? userYoutubeData[0]?.tags !== undefined
  //       ? String(userYoutubeData[0].tags)
  //       : ""
  //     : "",
  //   thumbnail: String(youtubeDraftPost[0]?.video_thumbnail)
  //     ? userYoutubeData[0]?.thumbnails.url !== undefined
  //       ? String(userYoutubeData[0].thumbnails.url)
  //       : ""
  //     : "",
  // });

  let savedData;

  const goBack = () => {
    navigate("/optimization");
  };

  const staticData = [
    { keyword: "Keyword 1", source: "Source 1", monthlysearch: 1000 },
    { keyword: "Keyword 2", source: "Source 2", monthlysearch: 1500 },
    { keyword: "Keyword 3", source: "Source 3", monthlysearch: 800 },
  ];

  // useEffect(() => {
  // saveYoutubePost(videoId, userYoutubeData[0]?.title, userYoutubeData[0]?.description, userYoutubeData[0]?.tags, userYoutubeData[0]?.thumbnails.url);
  // }, []);

  let savedSearchTermData;
  useEffect(() => {
    let isMounted = true;

    const savedSearchTermData = JSON.parse(
      localStorage.getItem(`${videoId}searchTermData`),
    );
    const savedSearchTerm = JSON.parse(
      localStorage.getItem(`${videoId}searchTerm`),
    );

    if (isMounted) {
      setSearchQuery(savedSearchTerm);
      setProcessedUserSearchTerms(savedSearchTermData);

      if (savedSearchTermData) {
        console.log(
          "now serving search term in keyword Tab from local storage",
          savedSearchTermData,
        );
      }
    }

    return () => {
      // Set the flag to false when the component is unmounted
      isMounted = false;
    };
  }, [videoId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const youtubePostDraft = await getDraftPost(videoId);

        if (youtubePostDraft && youtubePostDraft.length >= 1) {
          const draftData = youtubePostDraft[0];
          setDraftExists(true);
          setYoutubeDraftPost(youtubePostDraft);
          setFormData({
            title: String(draftData.video_title) || "",
            description: String(draftData.video_description) || "",
            tags: String(draftData.video_tags) || "",
            thumbnail: String(draftData.video_thumbnail) || "",
          });
          setSelectedYoutubePost((prev) => ({
            ...prev,
            title: String(draftData.video_title) || "",
            thumbnail: String(draftData.video_thumbnail) || "",
          }));
          setIsUserDataLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching draft data:", error);
        // Handle errors as needed
      }
    };

    const fetchMyYoutubeVideo = async () => {
      try {
        // const response = await axios.get(
        //   `${process.env.REACT_APP_API_BASE_URL}/fetchMyYoutubeVideo`,
        //   {
        //     params: {
        //       channel_id: decryptedFullData.channelId,
        //       video_id: videoId,
        //     },
        //     headers: {
        //       "Content-Type": "application/json",
        //       "x-api-key": process.env.REACT_APP_X_API_KEY,
        //       Authorization: `Bearer ${decryptedFullData.token}`,
        //       gToken: decryptedFullData.gToken,
        //     },
        //   },
        // );

        // localStorage.setItem("testVideoData", JSON.stringify(response.data));
        const targetVideoData = userYoutubeData.find(
          (videoData) => videoData.videoId === videoId,
        );

        setFormData({
          title: String(targetVideoData.title) || "",
          description: String(targetVideoData.description) || "",
          tags: String(targetVideoData.tags) || "",
          thumbnail: String(targetVideoData.thumbnails?.url) || "",
        });
        setSelectedYoutubePost((prev) => ({
          ...prev,
          title: String(targetVideoData.title) || "",
          thumbnail: String(targetVideoData.thumbnails?.url) || "",
        }));
        // setUserYoutubeData(response.data);
        saveYoutubePost(
          videoId,
          targetVideoData?.title,
          targetVideoData?.description,
          targetVideoData?.tags,
          targetVideoData?.thumbnails?.url,
          likeCount,
          commentCount,
          viewCount,
        );
        setIsUserDataLoaded(true);
        // console.log(response);
      } catch (error) {
        console.error("Error fetching YouTube data:", error);
        // Handle errors as needed
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    if (youtubeDraftPost.length < 1) {
      if (!userSavedSearchTerm) {
        setShowSearchTermPanel(true);
      }

      let isMounted = true;

      fetchMyYoutubeVideo();

      console.log("Got to calling the YouTube post API");

      return () => {
        isMounted = false;
      };
    }
  }, []);

  useEffect(() => {
    // setFetchingSearchTerms(true);
    const fetchUserKeywords = async () => {
      try {
        // Fetch data from localStorage
        const savedDataJSON = localStorage.getItem("searchTermData");
        let savedData = [];

        if (savedDataJSON) {
          savedData = JSON.parse(savedDataJSON);
          console.log("Now serving bookmarks from localStorage", savedData);
        } else {
          console.log("No bookmarks in localStorage");
        }

        // Fetch data from the API
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/allBookmarkSearchTerms`,
            {
              params: {
                email: localStorage.getItem("userRegEmail"),
              },
              headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.REACT_APP_X_API_KEY,
              },
            },
          );

          const data = response.data;
          console.log("Bookmarked data", data);

          if (data.success) {
            setUserSearchTerms(data.data);

            // Update the processedUserSearchTerms based on the fetched data
            if (savedData.length > 0) {
              const updatedArray = savedData.map((obj1) => {
                const matchingObj2 = data.data.find(
                  (obj2) => obj2.keyword === obj1.keyword,
                );

                return matchingObj2 ? { ...obj1, bookmarked: true } : obj1;
              });

              setProcessedUserSearchTerms(updatedArray);
              console.log("Updated Array", updatedArray);
            }
          } else {
            showToast(
              "error",
              "An error occurred with fetching your saved search terms",
              2000,
            );
          }
        } catch (error) {
          console.error("Error fetching data from the API:", error);
          showToast("error", "No saved search terms", 2000);
        }
      } catch (error) {
        console.error("Error parsing data from localStorage:", error);
      }
    };

    fetchUserKeywords();
  }, [saveSuccess]);

  useEffect(() => {
    console.log("I ran omoiyami");
    setFetchingUserTemplates(true);
    const fetchUserTemplates = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/getUserTemplate`,
          {
            params: {
              email: localStorage.getItem("userRegEmail"),
            },
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.REACT_APP_X_API_KEY,
              // Authorization: `Bearer ${decryptedFullData.token}`,
            },
          },
        );

        const data = response.data;
        console.log("data", response);
        console.log("response", response.data.success === "trueNut");
        if (response.data.success === "trueNut") {
          setFetchingUserTemplates(false);
        } else if (response.data.success == true) {
          setUserChannelTemplates(data.data);
          setFetchingUserTemplates(false);
        } else {
          showToast(
            "error",
            "An error occured with fetching your saved Templates",
            2000,
          );
          setFetchingUserTemplates(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setFetchingUserTemplates(false);
      }
    };

    fetchUserTemplates(); // Call the async function
  }, [
    saveUserTemplateSuccess,
    updateUserTemplateSuccess,
    deleteUserTemplateSuccess,
  ]);

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

  const handleGetIdeas = async () => {
    if (!searchQuery.trim()) {
      showToast("warning", "Search box is empty", 2000);
      return;
    }

    const postData = {
      keyword: searchQuery,
      countryCode: selectedCountry.countryCode,
      languageCode: selectedCountry.languageCode,
    };

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/fetchKeywordStat`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            // Authorization: `Bearer ${decryptedFullData.token}`,
          },
        },
      );

      const data = response.data;
      console.log("response.data", response.data);
      setIsLoading(false);
      const allKeywords = data.response.all;
      const exactKeyword = data.response.exact_keyword[0];
      localStorage.setItem(
        `${videoId}searchTermData`,
        JSON.stringify(allKeywords),
      );
      localStorage.setItem(
        `${videoId}searchTerm`,
        JSON.stringify(exactKeyword.string),
      );
      setProcessedUserSearchTerms(allKeywords);
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast(
        "error",
        `Couldn't fetch results for your search "${searchQuery}"`,
        5000,
      );
      setIsLoading(false);
    }
  };

  const handleGetIdeasOnEnter = (event) => {
    if (event.key === "Enter") {
      handleGetIdeas();
    }
  };

  const handleCopyClick = () => {
    const { textToCopy } = this.props;

    copy(textToCopy)
      .then(() => {
        this.setState({ copied: true });
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  const bookmarkSearchTerm = async (props) => {
    // You can make an API call here to save the value
    // For example:
    // axios.post('/api/saveValue', { valueId })
    //   .then(() => {
    //     setIsSaved(true);
    //   })
    //   .catch((error) => {
    //     console.error('Error saving value:', error);
    //   });

    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/bookmarkSearchTerm`,
      {
        keyword: props.keyword,
        search_volume: props.monthlysearch,
        email: localStorage.getItem("userRegEmail"),
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          // Authorization: `Bearer ${decryptedFullData.token}`,
        },
      },
    );
    // fetchSavedIdeasData()

    console.log("Data saved successfully and response:", props);
    if (response.data.success) {
      showToast("success", "Idea saved successfully", 2000);
    } else {
      showToast("error", "Idea wasn't saved. Try again", 2000);
    }

    // For this example, we'll simulate saving by setting isSaved to true
    setIsSavedSearchTerm(true);
  };

  const handleDelete = () => {
    // You can make an API call here to delete the value
    // For example:
    // axios.delete(`/api/deleteValue/${valueId}`)
    //   .then(() => {
    //     setIsSaved(false);
    //   })
    //   .catch((error) => {
    //     console.error('Error deleting value:', error);
    //   });

    // For this example, we'll simulate deleting by setting isSaved to false
    setIsSavedSearchTerm(false);
  };

  // const toggleSave = async (props, save) => {
  //   console.log("props", props);
  //   setProcessingBookmarked(true);
  //   if (save) {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_API_BASE_URL}/bookmarkSearchTerm`,
  //       {
  //         keyword: props.keyword,
  //         search_volume: props.monthlysearch,
  //         email: localStorage.getItem("userRegEmail"),
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "x-api-key": process.env.REACT_APP_X_API_KEY,
  //           // Authorization: `Bearer ${decryptedFullData.token}`,
  //         },
  //       },
  //     );

  //     setProcessingBookmarked(false);
  //     // console.log("Data saved successfully and response:", foundObject);
  //     if (response.data.success) {
  //       setUserSearchTerms([...userSearchTerms, props]);
  //       setProcessedUserSearchTerms((prevState) => {
  //         return prevState.map((obj) => {
  //           if (obj.keyword === props.keyword) {
  //             return { ...obj, bookmarked: true };
  //           }
  //           return obj;
  //         });
  //       });
  //       setSaveSuccess(true);
  //       showToast("success", "Search Term saved successfully", 2000);
  //     } else {
  //       showToast("error", "Search Term wasn't saved. Try again", 2000);
  //     }
  //   } else {
  //     try {
  //       const responseDelete = await axios.delete(
  //         `${process.env.REACT_APP_API_BASE_URL}/deleteSavedIdeaBookmarkSearchTerm`,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             "x-api-key": process.env.REACT_APP_X_API_KEY,
  //             // Authorization: `Bearer ${decryptedFullData.token}`,
  //           },
  //           params: {
  //             keyword: props.keyword,
  //           },
  //         },
  //       );
  //       console.log("Data removed successfully", props.keyword);
  //       if (responseDelete.data.success) {
  //         setSaveSuccess(true);
  //         setUserSearchTerms((prevData) =>
  //           prevData.filter((d) => d.keyword !== props.keyword),
  //         );
  //         setProcessedUserSearchTerms((prevState) => {
  //           return prevState.map((obj) => {
  //             if (obj.keyword === props.keyword) {
  //               return { ...obj, bookmarked: false };
  //             }
  //             return obj;
  //           });
  //         });
  //         showToast("success", "Search Term removed from Search Terms", 2000);
  //       } else {
  //         showToast("error", "Search Term wasn't removed. Try again", 2000);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       throw error;
  //     }
  //   }
  //   // } catch (error) {
  //   //   console.error("Error saving/removing data:", error);
  //   //   showToast("error", "Error saving/removing data", 2000);
  //   // }
  // };

  const saveSearchTerm = async (props) => {
    setSavingToBookmark(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/bookmarkSearchTerm`,
        {
          keyword: props.keyword,
          search_volume: props.monthlysearch,
          email: localStorage.getItem("userRegEmail"),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
          },
        },
      );

      if (response.data.success) {
        console.log("userSearchTerms", userSearchTerms, "props", props);
        setUserSearchTerms([...userSearchTerms, props]);
        setProcessedUserSearchTerms((prevState) =>
          prevState.map((obj) =>
            obj.keyword === props.keyword ? { ...obj, bookmarked: true } : obj,
          ),
        );
        setSaveSuccess(true);
        setSavingToBookmark(false);

        showToast("success", "Search Term saved successfully", 2000);
      } else {
        setSavingToBookmark(false);

        showToast("error", "Search Term wasn't saved. Try again", 2000);
      }
    } catch (error) {
      setSavingToBookmark(false);

      console.error("Error saving data:", error);
      throw error;
    }
  };

  const removeSearchTerm = async (props) => {
    setRemovingFromBookmark(true);

    try {
      const responseDelete = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/deleteSavedIdeaBookmarkSearchTerm`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
          },
          params: {
            keyword: props.keyword,
          },
        },
      );

      console.log("Data removed successfully", props.keyword);

      if (responseDelete.data.success) {
        setSaveSuccess(true);
        setUserSearchTerms((prevData) =>
          prevData.filter((d) => d.keyword !== props.keyword),
        );
        setProcessedUserSearchTerms((prevState) =>
          prevState.map((obj) =>
            obj.keyword === props.keyword ? { ...obj, bookmarked: false } : obj,
          ),
        );
        setRemovingFromBookmark(false);

        showToast("success", "Search Term removed from Search Terms", 2000);
      } else {
        setRemovingFromBookmark(false);

        showToast("error", "Search Term wasn't removed. Try again", 2000);
      }
    } catch (error) {
      setRemovingFromBookmark(false);

      console.error("Error removing data:", error);
      throw error;
    }
  };

  const deleteSavedIdeaBookmarkSearchTerm = async (props) => {
    setRemovingFromBookmark(true);
    try {
      const responseDelete = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/deleteSavedIdeaBookmarkSearchTerm`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
          },
          params: {
            keyword: props.keyword,
          },
        },
      );

      console.log("Data removed successfully", props.keyword);

      if (responseDelete.data.success) {
        setRemovingFromBookmark(false);

        setSaveSuccess(true);
        setUserSearchTerms((prevData) =>
          prevData.filter((d) => d.keyword !== props.keyword),
        );
        setProcessedUserSearchTerms((prevState) => {
          return prevState.map((obj) => {
            if (obj.keyword === props.keyword) {
              return { ...obj, bookmarked: false };
            }
            return obj;
          });
        });
        showToast("success", "Search Term removed from Bookmarks", 2000);
      } else {
        setRemovingFromBookmark(false);

        showToast("error", "Search Term wasn't removed. Try again", 2000);
        console.log("Search Term wasn't removed. Try again");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      throw error;
    }
  };

  const validateAndAddToFixed = (index, condition, errorMessage) => {
    setUnfixed((prevUnfixed) => {
      if (condition) {
        // Remove the item from unfixed if it exists
        return prevUnfixed.filter((item) => item.index !== index);
      } else {
        // Add the item to unfixed if it doesn't exist
        if (!prevUnfixed.some((item) => item.index === index)) {
          return [...prevUnfixed, thingsToFix[index]];
        }
      }
      return prevUnfixed;
    });

    setFixed((prevFixed) => {
      if (condition) {
        // Add the item to fixed if it doesn't exist
        if (!prevFixed.some((item) => item.index === index)) {
          return [...prevFixed, itemsFixed[index]];
        }
      } else {
        // Remove the item from fixed if it exists
        return prevFixed.filter((item) => item.index !== index);
      }
      return prevFixed;
    });
  };

  const AICheck = () => {
    const urlRegex =
      /(https?:\/\/[^\s]*|www\.[^\s]*|[^@]+\.[^\s]+\.com[^\s]*)/g;
    const hashtagRegex = /#[A-Za-z0-9_-]+/g;
    const timestampRegex = /0:00/; // Check for the pattern "0:00"

    // Validation and checks for title
    const titleHasSearchTerm =
      formData.title &&
      userSavedSearchTerm &&
      formData.title.toLowerCase().includes(userSavedSearchTerm.toLowerCase());
    const titleLengthOkay =
      formData.title &&
      formData.title.length > 0 &&
      formData.title.length <= 70;
    validateAndAddToFixed(0, titleHasSearchTerm, "Invalid title");
    validateAndAddToFixed(1, titleLengthOkay, "Invalid title");

    // Validation and checks for description
    const descriptionHasSearchTerm =
      formData.description &&
      userSavedSearchTerm &&
      formData.description
        .toLowerCase()
        .includes(userSavedSearchTerm.toLowerCase());
    const descriptionHasUrl =
      formData.description && formData.description.match(urlRegex);
    const descriptionHasHashtag =
      formData.description && formData.description.match(hashtagRegex);
    const descriptionHasTimestamps =
      formData.description && formData.description.match(timestampRegex);

    validateAndAddToFixed(2, descriptionHasSearchTerm, "Invalid description");
    validateAndAddToFixed(3, descriptionHasTimestamps, "Invalid hashtag");
    validateAndAddToFixed(4, descriptionHasUrl, "Invalid URL");
    validateAndAddToFixed(5, descriptionHasHashtag, "Invalid hashtag");

    // Validation and checks for tags
    const tagsArray = formData.tags
      ? formData.tags.split(",").map((tag) => tag.trim().toLowerCase())
      : null;
    const tagsLengthOkay = tagsArray && tagsArray.length >= 5;
    console.log("tagsArray", tagsArray, tagsLengthOkay);
    const tagsHasSearchTerm =
      tagsArray &&
      userSavedSearchTerm &&
      tagsArray.includes(userSavedSearchTerm.toLowerCase());

    validateAndAddToFixed(7, formData.tags, "Tags are required");
    validateAndAddToFixed(8, tagsLengthOkay, "Too few tags");
    validateAndAddToFixed(9, tagsHasSearchTerm, "Invalid tag search");
  };

  useEffect(() => {
    isUserDataLoaded && AICheck();
  }, [formData, userSavedSearchTerm, isUserDataLoaded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchTermChange = (e) => {
    const { name, value } = e.target;
    setUserSavedSearchTerm(value);
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   setSelectedFile(file);
  //   setFormData({ ...formData, ["thumbnail"]: file });
  // };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Read the image file and convert it to Base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target.result;
      setFormData({ ...formData, thumbnail: base64String });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   setSelectedFile(file);

  //   // Read the image file and convert it to Base64
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const base64String = e.target.result;
  //     setFormData({ ...formData, thumbnail: base64String });

  //     // Create an image element to get the image dimensions
  //     const image = new Image();
  //     image.src = base64String;

  //     // When the image is loaded, get the dimensions
  //     image.onload = () => {
  //       const width = image.width;
  //       const height = image.height;
  //       // Add the dimensions to the requestData object
  //       setRequestData((prevData) => ({
  //         ...prevData,
  //         videoThumbnailHeight: height,
  //         videoThumbnailWidth: width,
  //       }));
  //     };
  //   };

  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handlePostUpdate = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }

    try {
      // Create a form data object to send the file to the server
      const formData = new FormData();
      formData.append("thumbnail", selectedFile);

      // Send the file to the Laravel backend for processing
      const response = await axios.post("/api/upload-thumbnail", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Thumbnail uploaded successfully!");
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      alert("An error occurred while uploading the thumbnail.");
    }
  };

  const updateUserVideo = async () => {
    console.log("userYoutubeData", userYoutubeData);
    setUpdatingYtPost(true);

    const requestData = {
      videoId: videoId,
      videoTitle: formData.title,
    };

    if (userYoutubeData[0]?.categoryId != null) {
      requestData.categoryId = userYoutubeData[0].categoryId;
    } else {
      showToast(
        "error",
        "Cannot be updated due to technical issues. Kindly save draft and refresh page",
        2000,
      );
      return;
    }

    if (formData.description != null) {
      requestData.videoDescription = formData.description;
    }

    if (formData.tags != null) {
      requestData.videoTags = formData.tags;
    }

    if (/^data:image\/\w+;base64,/.test(formData.thumbnail)) {
      const image = new Image();
      image.onload = () => {
        const width = image.width;
        const height = image.height;

        requestData.videoThumbnailHeight = height;
        requestData.videoThumbnailWidth = width;

        console.log("Width:", width);
        console.log("Height:", height);
      };

      image.src = formData.thumbnail;
      requestData.videoThumbnail = formData.thumbnail;
    }

    console.log("requestData", requestData);

    const requestHeaders = {
      "Content-Type": "application/json",
      "x-api-key": process.env.REACT_APP_X_API_KEY,
      // Authorization: `Bearer ${decryptedFullData.token}`,
      gToken: decryptedFullData.gToken,
    };

    // try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/updateMyYoutubeVideos`,
      requestData,
      { headers: requestHeaders },
    );

    console.log("updateMyYoutubeVideos response", response);

    if (response.data.status === "success") {
      // await deleteDraftPost(videoId);
      showToast("success", "Post updated successfully", 2000);
      setUpdatingYtPost(false);
    } else {
      showToast("error", "Post updating failed", 2000);
      setUpdatingYtPost(false);
    }
    // } catch (error) {
    //   console.error("Error updating YouTube videos:", error);
    // } finally {
    //   setUpdatingYtPost(false);
    // }
  };

  const [ThingsToFixState, setThingsToFixAccordion] = useState(
    Array(thingsToFix.length).fill(false),
  );

  const [fixedState, setFixedAccordion] = useState(
    Array(thingsToFix.length).fill(false),
  );

  const toggleThingsToFixAccordion = (index) => {
    const newState = [...ThingsToFixState];
    newState[index] = !newState[index];
    setThingsToFixAccordion(newState);
  };

  const toggleFixedAccordion = (index) => {
    const newState = [...fixedState];
    newState[index] = !newState[index];
    setFixedAccordion(newState);
  };

  function formatNumberToKMBPlus(number) {
    if (number >= 1000000000) {
      const formattedNumber = Math.floor(number / 1000000000);
      return formattedNumber + "B+";
    } else if (number >= 1000000) {
      const formattedNumber = Math.floor(number / 1000000);
      return formattedNumber + "M+";
    } else if (number >= 1000) {
      const formattedNumber = Math.floor(number / 1000);
      return formattedNumber + "K+";
    } else {
      return number.toString() + "+";
    }
  }

  const formatViews = (props) => {
    const [isCopied, setIsCopied] = useState(false);
    const monthlysearch = parseInt(props.monthlysearch);
    const formatedNumber = formatNumberToKMBPlus(monthlysearch);

    const copyToClipboard = () => {
      const textField = document.createElement("textarea");
      textField.innerText = props.keyword;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand("copy");
      textField.remove();
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    };

    const bookmarkIcon = props.bookmarked ? (
      <BsFillBookmarkCheckFill
        color="#7352FF"
        onClick={() => removeSearchTerm(props)}
      />
    ) : (
      <BsBookmark color="#7352FF" onClick={() => saveSearchTerm(props)} />
    );

    return (
      <div className="grid grid-cols-3 items-center">
        <span className="mr-5">{formatedNumber}</span>
        <span className="mr-3 cursor-pointer text-sm flex items-center">
          <span className="mr-2">{bookmarkIcon}</span>
          {/* <span>{processingBookmarked && <BiLoaderCircle size={20} />}</span> */}
        </span>
        {/* <AiOutlineCopy color="#7352FF" className="cursor-pointer"/> */}
        <div className="relative">
          <Tooltip
            title="Copy keyword"
            position="top"
            trigger="mouseenter"
            animation="fade"
            theme="translucent"
          >
            <AiOutlineCopy
              color="#7352FF"
              className={`cursor-pointer ${isCopied ? "text-green-500" : ""}`}
              onClick={copyToClipboard}
            />
          </Tooltip>
          {isCopied && <span className="text-green-500 ml-1">Copied!</span>}
        </div>
      </div>
    );
  };

  const formatBookmarkedSearchVolumeViews = (props) => {
    const [isCopied, setIsCopied] = useState(false);
    const monthlysearch = parseInt(props.monthlysearch);
    const formatedNumber = formatNumberToKMBPlus(monthlysearch);

    const copyToClipboard = () => {
      try {
        // Create a temporary DOM element (input) to copy the text
        const textField = document.createElement("textarea");
        textField.value = props.keyword;
        document.body.appendChild(textField);

        // Select and copy the text using the Clipboard API
        textField.select();
        document.execCommand("copy");

        // Clean up: remove the temporary DOM element
        textField.remove();

        setIsCopied(true);

        // Reset the "Copied" state after a brief delay
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      } catch (error) {
        // Handle any errors that might occur during the copying process
        console.error("Unable to copy to clipboard:", error);
      }
    };

    return (
      <div className="grid grid-cols-3 items-center">
        <span className="mr-3">{formatedNumber}</span>
        <div className="relative">
          <Tooltip
            title="Copy keyword"
            position="top"
            trigger="mouseenter"
            animation="fade"
            theme="translucent"
          >
            <AiOutlineCopy
              color="#7352FF"
              className={`cursor-pointer ${isCopied ? "text-green-500" : ""}`}
              onClick={copyToClipboard}
            />
          </Tooltip>
          {isCopied && <span className="text-green-500 ml-1">Copied!</span>}
        </div>
        <span className="mr-3 cursor-pointer text-sm flex items-center">
          <span className="mr-2">
            <TiDelete color="#7352FF" onClick={() => removeSearchTerm(props)} />
          </span>
        </span>
      </div>
    );
  };

  const sourceTemplate = (props) => {
    return (
      <span className="text-center">
        <FaYoutube color="red" />
      </span>
    );
  };

  const keywordTemplate = (props) => {
    return <span className="whitespace-normal">{props.keyword}</span>;
  };

  const saveDraftPost = async () => {
    setSavingDraft(true);
    console.log("formData", formData);
    console.log("searchTerm", userSavedSearchTerm);
    console.log("userYoutubeData.videoId", videoId);
    console.log("formData.thumbnail", formData.thumbnail);
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/saveDraftPost`,
      {
        video_id: videoId,
        search_term: userSavedSearchTerm,
        video_title: formData.title,
        video_description: formData.description,
        video_tags: formData.tags,
        video_thumbnail: formData.thumbnail,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          // Authorization: `Bearer ${decryptedFullData.token}`,
        },
      },
    );

    console.log("response", response);
    if (response.data.success) {
      showToast("success", "post saved successfully", 2000);
      setSavingDraft(false);
    } else {
      showToast("error", "post wasn't saved. Try again", 2000);
    }
  };

  const revertBackToOriginalPost = async () => {
    const originalYoutubePost = await getYoutubePost(videoId);
    console.log("originalYoutubePost", originalYoutubePost);
    setUserYoutubeData(originalYoutubePost);
  };

  // const handleTagRemove = (tag) => {
  //   const updatedTags = formData.tags
  //     .split(',')
  //     .filter((t) => t.trim() !== tag)
  //     .join(',');
  //   setFormData({ tags: updatedTags });
  // };

  // const tags = formData.tags
  // .split(',')
  // .map((tag) => tag.trim())
  // .filter((tag) => tag !== '');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const maxTitleCharacters = 100;
  const maxDescriptionCharacters = 5000;
  const maxTagsCharacters = 500;

  // VIEWS SECTION
  const handleViewChange = (viewName) => {
    setActiveView(viewName);
  };

  const ThingsToFixView = () => {
    return (
      <div className="w-1/2 h-full overflow-y-auto p-4">
        <div className="p-4">
          <div className="mb-4">
            {unfixed.length < 1 ? (
              ""
            ) : (
              <h4 className="font-semibold">
                Things to Fix{" "}
                <span className="ml-3 text-xs px-5 py-1 rounded-full bg-red-600 text-white">
                  {unfixed.length}
                </span>
              </h4>
            )}

            {unfixed.map((section, index) => (
              <div key={index} className="border rounded shadow mt-5">
                <button
                  className="w-full text-sm text-left p-3 border-b flex items-center justify-between focus:outline-none"
                  onClick={() => toggleThingsToFixAccordion(index)}
                >
                  {section.headline}
                  {ThingsToFixState[index] ? (
                    <FaChevronUp size={10} />
                  ) : (
                    <FaChevronDown size={10} />
                  )}
                </button>
                {ThingsToFixState[index] && (
                  <div className="p-3 text-sm">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: String(section.content).replace(
                          "search_term",
                          userSavedSearchTerm,
                        ),
                      }}
                    ></p>
                    <div className="text-sm text-gray-500">
                      <div className="text-left flex items-center justify-between focus:outline-none border-b pb-3">
                        <div className="flex justify-center items-center">
                          <span className="mr-3 mt-5">
                            {section.tipHeadline}
                          </span>
                        </div>
                        <div className="underline mt-3">Ignore this</div>
                      </div>
                      {ThingsToFixState[index] && (
                        <div
                          className="mt-3"
                          dangerouslySetInnerHTML={{
                            __html: String(section.tipContent).replace(
                              "search_term",
                              userSavedSearchTerm,
                            ),
                          }}
                        ></div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mb-4">
            <h4 className="font-semibold">
              Fixed
              <span className="ml-3 text-xs px-5 py-1 rounded-full bg-green-600 text-white">
                {fixed.length}
              </span>
            </h4>

            {fixed.map((section, index) => (
              <div key={index} className="border rounded shadow mt-5">
                <button
                  className="w-full text-sm text-left p-3 border-b flex items-center justify-between focus:outline-none"
                  onClick={() => toggleFixedAccordion(index)}
                >
                  {section.headline}
                  {fixedState[index] ? (
                    <FaChevronUp size={10} />
                  ) : (
                    <FaChevronDown size={10} />
                  )}
                </button>
                {fixedState[index] && (
                  <div className="p-3 text-sm">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: String(section.content).replace(
                          "search_term",
                          userSavedSearchTerm,
                        ),
                      }}
                    ></p>
                    <div className="text-sm text-gray-500">
                      <div className="text-left flex items-center justify-between focus:outline-none border-b pb-3">
                        <div className="flex justify-center items-center">
                          <span className="mr-3 mt-5">
                            {section.tipHeadline}
                          </span>
                        </div>
                        <div className="underline mt-3">Ignore this</div>
                      </div>
                      {fixedState[index] && (
                        <div
                          className="mt-3"
                          dangerouslySetInnerHTML={{
                            __html: section.tipContent,
                          }}
                        ></div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(true);

  const toggleAccordion1 = () => {
    setIsOpen1(!isOpen1);
  };

  const toggleAccordion2 = () => {
    setIsOpen2(!isOpen2);
  };

  const KeywordsView = () => {
    return (
      <div className="w-1/2 h-full overflow-y-auto p-4">
        <div className="p-4">
          <div className="flex flex-col items-center justify-center h-full mb-5">
            <div className="p-4 w-full">
              <div className="mb-4">
                <div className="border rounded shadow mt-5">
                  <button
                    className="w-full text-sm text-left p-3 border-b flex items-center justify-between focus:outline-none"
                    onClick={toggleAccordion1}
                    style={{ backgroundColor: "#F4F6F8" }}
                  >
                    <span className="flex items-center justify-between">
                      <BsFillBookmarkCheckFill className="mr-3" /> Bookmarked
                      Keywords{" "}
                    </span>
                    {isOpen1 ? (
                      <FaChevronUp size={10} />
                    ) : (
                      <FaChevronDown size={10} />
                    )}
                  </button>
                  {isOpen1 && (
                    <div className="p-3 text-sm">
                      <div>
                        <GridComponent
                          // id="gridcomp"
                          dataSource={userSearchTerms}
                          allowExcelExport
                          allowPdfExport
                          allowPaging
                          allowSorting
                          // contextMenuItems={contextMenuItems}
                          // editSettings={editing}
                          // rowSelected={handleRowSelected}
                        >
                          <ColumnsDirective>
                            <ColumnDirective
                              field="keyword"
                              headerText="Keywords"
                              width="250"
                              template={keywordTemplate}
                            />
                            <ColumnDirective
                              field="source"
                              headerText="Source"
                              template={sourceTemplate}
                              width="100"
                            />
                            <ColumnDirective
                              field="monthlysearch"
                              headerText="SV"
                              template={formatBookmarkedSearchVolumeViews}
                            />
                          </ColumnsDirective>
                          <Inject
                            services={[
                              Resize,
                              Sort,
                              ContextMenu,
                              Filter,
                              Page,
                              ExcelExport,
                              Edit,
                              PdfExport,
                            ]}
                          />
                        </GridComponent>
                      </div>
                      <div className="text-sm text-gray-500">
                        <div className="text-left flex items-center justify-between focus:outline-none border-b pb-3"></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="border rounded shadow mt-5">
                  <button
                    className="w-full text-sm text-left p-3 border-b flex items-center justify-between focus:outline-none"
                    onClick={toggleAccordion2}
                    style={{ backgroundColor: "#F4F6F8" }}
                  >
                    <span className="flex items-center justify-between">
                      <BiSearch className="mr-3" /> Search Keywords
                    </span>
                    {isOpen2 ? (
                      <FaChevronUp size={10} />
                    ) : (
                      <FaChevronDown size={10} />
                    )}
                  </button>
                  {isOpen2 && (
                    <div className="p-3 text-sm">
                      <div>
                        <div className="flex w-full items-end">
                          <div className="flex flex-col w-3/6">
                            <span className="mb-2 text-xs">
                              Enter topics closely related to your video.
                            </span>
                            <div
                              div
                              className="w-full max-w-xs flex items-center p-2 pl-4 pr-4 border border-gray-300 bg-white rounded-full"
                            >
                              <input
                                type="text"
                                placeholder="Enter a topic, brand, or product"
                                className="flex-grow bg-transparent outline-none pr-2 text-xs"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={handleGetIdeasOnEnter}
                              />
                              <BiSearch
                                className="text-gray-500 text-lg cursor-pointer"
                                onClick={handleGetIdeas}
                              />
                            </div>
                          </div>

                          <div className="relative ml-4 w-3/6">
                            <select
                              id="countrySelect"
                              className="rounded-full py-2 pl-4 pr-8 border border-gray-300 bg-white text-xs"
                              value={`${selectedCountry.countryCode}:${selectedCountry.languageCode}`}
                              onChange={handleCountryChange}
                            >
                              <option value="US:en">
                                United States (English)
                              </option>

                              {countriesWithLanguages.map((item, index) => (
                                <option
                                  key={index}
                                  value={`${item.countryCode}:${item.languageCode}`}
                                >
                                  {`${item.country} (${item.language})`}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <br />
                        <div>
                          {isLoading ? (
                            // <div className="flex flex-col justify-center items-center w-full mt-20">
                            //   <BiLoaderCircle
                            //     className="animate-spin text-center"
                            //     color="#7352FF"
                            //     size={30}
                            //   />
                            //   <div>Gathering Insights for your Keyword.</div>
                            // </div>
                            <Loader
                              message={"Gathering Insights for your Keyword."}
                            />
                          ) : (
                            <div className=""></div>
                          )}
                        </div>
                        <GridComponent
                          // id="gridcomp"
                          dataSource={processedUserSearchTerms}
                          allowExcelExport
                          allowPdfExport
                          allowPaging
                          allowSorting
                          // contextMenuItems={contextMenuItems}
                          // editSettings={editing}
                          // rowSelected={handleRowSelected}
                        >
                          <ColumnsDirective>
                            <ColumnDirective
                              field="keyword"
                              headerText="Keywords"
                              template={keywordTemplate}
                              // width="250"
                            />
                            <ColumnDirective
                              field="source"
                              headerText="Source"
                              template={sourceTemplate}
                              // width="100"
                            />
                            <ColumnDirective
                              field="monthlysearch"
                              headerText="SV"
                              template={formatViews}
                              width={200}
                            />
                          </ColumnsDirective>
                          <Inject
                            services={[
                              Resize,
                              Sort,
                              ContextMenu,
                              Filter,
                              Page,
                              ExcelExport,
                              Edit,
                              PdfExport,
                            ]}
                          />
                        </GridComponent>
                      </div>
                      <div className="text-sm text-gray-500">
                        <div className="text-left flex items-center justify-between focus:outline-none border-b pb-3"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleTemplateTitleChange = (index, value) => {
    const updatedTemplates = [...userChannelTemplates];
    updatedTemplates[index].title = value;
    setUserChannelTemplates(updatedTemplates);
  };

  const handleTemplateContentChange = (index, value) => {
    const updatedTemplates = [...userChannelTemplates];
    updatedTemplates[index].content = value;
    setUserChannelTemplates(updatedTemplates);
  };

  const handleNewTemplateChange = (e) => {
    const { name, value } = e.target;
    setNewTemplateData({ ...newTemplateData, [name]: value });
  };

  const clearNewTemplateData = () => {
    setNewTemplateData({
      title: "",
      content: "",
    });
  };

  const addNewUserTemplate = async () => {
    setSaveUserTemplateSuccess(true);
    if (newTemplateData.title === "" || newTemplateData.content === "") {
      console.log("Template is empty. Please provide a Template.");
      showToast("error", "Template title and content must not be empty", 2000);
      return;
    }
    // showToast("success", `newTemplateData ${newTemplateData.title}`, 2000);
    console.log("newTemplateData", newTemplateData);

    // setIsAddKeyword(false);

    try {
      const saveUserTemplateResponse = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/saveUserTemplate`,
        {
          title: newTemplateData.title,
          content: newTemplateData.content,
          email: localStorage.getItem("userRegEmail"),
          // user_id: decryptedFullData.user_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            // Authorization: `Bearer ${decryptedFullData.token}`,
          },
        },
      );

      console.log("API response:", saveUserTemplateResponse.data);
      if (saveUserTemplateResponse.data.success) {
        setSaveUserTemplateSuccess(false);
        setAddTemplateBox(false);
        showToast("success", "Template saved successfully", 2000);
      }
    } catch (error) {
      setSaveUserTemplateSuccess(false);
      console.error("Error while making API call:", error);
      showToast(
        "error",
        "could not add keyword. Please try again. Dont refresh so information isn't lost",
        5000,
      );
    }

    // setUserKeyword(""); // Clear the userKeyword after successful submission
  };

  const updateUserTemplateFunc = async (index) => {
    setUpdateUserTemplate(true);
    if (
      userChannelTemplates[index].title === "" ||
      userChannelTemplates[index].content === ""
    ) {
      console.log("Template is empty. Please provide a Template.");
      showToast("error", "Template title and content must not be empty", 2000);
      return;
    }
    // showToast(
    //   "success",
    //   `newTemplateData ${userChannelTemplates[index].title}`,
    //   2000,
    // );
    console.log("userChannelTemplates[index]", userChannelTemplates[index]);

    try {
      const templateId = userChannelTemplates[index].id;
      const updateUserTemplateResponse = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/updateUserTemplate`,
        {
          title: userChannelTemplates[index].title,
          content: userChannelTemplates[index].content,
          email: localStorage.getItem("userRegEmail"),
          template_id: templateId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            // Authorization: `Bearer ${decryptedFullData.token}`,
          },
        },
      );

      console.log("API response:", updateUserTemplateResponse.data);

      if (updateUserTemplateResponse.data.success) {
        setUpdateUserTemplate(false);
        setUpdateUserTemplateSuccess((prevValue) => !prevValue);
        setEditUserTemplate(-1);
        setAddTemplateBox(false);
        showToast("success", "Template updated successfully", 2000);
      }
    } catch (error) {
      setUpdateUserTemplate(false);
      console.error("Error while making API call:", error);
      showToast(
        "error",
        "Could not update Template. Please try again. Don't refresh so information isn't lost",
        5000,
      );
    }
  };

  const deleteUserTemplateFunc = async (index) => {
    setDeleteUserTemplate(index);

    const templateId = userChannelTemplates[index].id;

    try {
      const deleteUserTemplateResponse = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/deleteUserTemplate`,
        {
          email: localStorage.getItem("userRegEmail"),
          template_id: templateId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            // Authorization: `Bearer ${decryptedFullData.token}`,
          },
        },
      );

      console.log("API response:", deleteUserTemplateResponse.data);

      if (deleteUserTemplateResponse.data.success) {
        setDeleteUserTemplate(-1);
        setDeleteUserTemplateSuccess((prevValue) => !prevValue);
        showToast("success", "Template deleted successfully", 2000);
      }
    } catch (error) {
      setDeleteUserTemplate(-1);
      console.error("Error while making API call:", error);
      showToast(
        "error",
        "Could not delete Template. Please try again. Don't refresh so information isn't lost",
        5000,
      );
    }
  };

  const TemplatesView = () => {
    return (
      <div className="w-1/2 h-full overflow-y-auto p-4">
        <div className="p-4">
          <div className="flex flex-col items-center justify-center h-full mb-5">
            <div className="p-4 w-full">
              <div className="mb-4 flex items-center justify-between">
                <span>Template</span>
                {addTemplateBox === false && (
                  <button
                    onClick={() => {
                      clearNewTemplateData();
                      setAddTemplateBox(true);
                    }}
                    style={{
                      backgroundColor: "transparent",
                      border: "1px #4F4EB1 solid",
                    }}
                    className="text-md py-2 px-5 rounded-full ml-10 mr-3 flex items-center"
                  >
                    <BsFillPlusCircleFill
                      color="#7438FF"
                      className="mr-2"
                      size={20}
                    />{" "}
                    New Template
                  </button>
                )}
              </div>
              {addTemplateBox === true && (
                <div className="new_template bg-white mt-5 border border-gray-300 py-5 px-4 rounded-md">
                  <div className="mb-4 flex items-center justify-between">
                    <span> New Template</span>
                    <div className="flex gap-1 items-center">
                      <span
                        className="cursor-pointer"
                        style={{ color: "#7438FF" }}
                        onClick={() => setAddTemplateBox(false)}
                      >
                        CANCEL
                      </span>
                      <button
                        onClick={addNewUserTemplate}
                        style={{
                          background:
                            "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                          color: "white",
                        }}
                        className="text-md text-white py-2 px-5 rounded-full ml-10 mr-3"
                      >
                        {/* <span className="flex items-center" onClick={addNewUserTemplate}>Save <AiFillCheckCircle color="white" className="ml-2"/> {saveUserTemplateSuccess === false && <FiLoader/>}</span> */}
                        <span className={`flex items-center rounded-full`}>
                          Save{" "}
                          <AiFillCheckCircle color="white" className="ml-2" />
                          {saveUserTemplateSuccess && (
                            <span className={"animate-spin ml-2"}>
                              <BiLoaderCircle color="white" size={20} />
                            </span>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    className="border-b border-gray-300 outline-none focus:border-purple-600 w-full py-1 mb-8"
                    placeholder="Add title for your template"
                    name="title"
                    value={newTemplateData.title}
                    onChange={handleNewTemplateChange}
                  />
                  <textarea
                    className="border-b border-gray-300 outline-none focus:border-purple-600 w-full py-1"
                    placeholder="Add template content here"
                    rows="5"
                    name="content"
                    value={newTemplateData.content}
                    onChange={handleNewTemplateChange}
                  />
                </div>
              )}
              {fetchingUserTemplates ? (
                <div className="w-full flex justify-center">
                  <BiLoaderCircle
                    className="animate-spin"
                    color="#7438FF"
                    size={30}
                  />
                </div>
              ) : userChannelTemplates.length >= 1 ? (
                userChannelTemplates.map((item, index) => (
                  <div key={index}>
                    {editUserTemplate === index ? (
                      <div className="edit_template bg-white mt-5 border border-gray-300 py-5 px-4 rounded-md">
                        <div className="mb-4 flex items-center justify-between">
                          <span>Edit Template</span>
                          <div className="flex gap-1 items-center">
                            <span style={{ color: "#7438FF" }}>CANCEL</span>
                            <button
                              onClick={updateUserTemplate}
                              style={{
                                background:
                                  "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                                color: "white",
                              }}
                              className="text-md text-white py-2 px-5 rounded-full ml-10 mr-3"
                            >
                              <span
                                className={`flex items-center`}
                                onClick={() => updateUserTemplateFunc(index)}
                              >
                                Save{" "}
                                <AiFillCheckCircle
                                  color="white"
                                  className="ml-2"
                                />
                                {updateUserTemplate && (
                                  <span className={"animate-spin ml-2"}>
                                    <BiLoaderCircle color="white" size={20} />
                                  </span>
                                )}
                              </span>
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          className="border-b border-gray-300 outline-none focus:border-purple-600 w-full py-1 mb-8"
                          placeholder="Add title for your template"
                          value={item.title}
                          onChange={(e) =>
                            handleTemplateTitleChange(index, e.target.value)
                          }
                        />
                        <textarea
                          className="border-b border-gray-300 outline-none focus-border-purple-600 w-full py-1"
                          placeholder="Add template content here"
                          rows="5"
                          value={item.content}
                          onChange={(e) =>
                            handleTemplateContentChange(index, e.target.value)
                          }
                        />
                      </div>
                    ) : (
                      <div className="saved_template bg-white mt-5 border border-gray-300 py-5 px-4 rounded-md">
                        <div className="mt-2 mb-4 flex items-center justify-between">
                          <span>{item.title}</span>
                          <span className="flex items-center mr-3">
                            {deleteUserTemplate === index ? (
                              <span className="animate-spin ml-2">
                                <BiLoaderCircle color="#7438FF" size={20} />
                              </span>
                            ) : (
                              <MdDeleteSweep
                                onClick={() => deleteUserTemplateFunc(index)}
                                color="#7438FF"
                                size={25}
                                className="cursor-pointer"
                              />
                            )}
                            <IoPencil
                              onClick={() => setEditUserTemplate(index)}
                              color="#7438FF"
                              className="ml-2"
                              size={25}
                            />
                          </span>
                        </div>
                        <hr />
                        <div className="mt-2 mb-4 flex items-center justify-between">
                          <span>{item.content}</span>
                          <span className="flex items-center mr-3">
                            <BiCopy color="#7438FF" size={25} />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full flex justify-center">
                  You have no Templates. Add one
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  localStorage.setItem("connectionEntry", "google_auth");
  const connectionEntry = localStorage.getItem("connectionEntry");

  return (
    <div className="flex flex-col px-10 py-5">
      <span className="my-3 flex items-center cursor-pointer" onClick={goBack}>
        <BiArrowBack color="#7472C2" className="mr-2" /> Back to list
      </span>
      {isUserDataLoaded ? (
        <div>
          <div className="flex pl-5 pb-5 pt-5">
            <div className="w-1/2 items-center flex">
              {/* <AiOutlineRollback
                onClick={goBack}
                className="mr-3"
                color="#7352FF"
                size={20}
              /> */}

              <img
                src={selectedYoutubePost && selectedYoutubePost.thumbnail}
                alt=""
                height="20"
                width="50"
                className="mr-3"
              />
              <div className="underline">
                {selectedYoutubePost && selectedYoutubePost.title}
              </div>
              {draftExists && (
                <span
                  className="ml-3 text-xs px-5 py-1 rounded-lg text-white"
                  style={{ backgroundColor: "#9D88FF" }}
                >
                  Draft
                </span>
              )}
              {/* <span
                className="ml-3 text-xs px-5 py-1 rounded-full text-white cursor-pointer"
                style={{
                  background:
                    "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                  color: "white",
                }}
                onClick={() => {
                  setRevertToOriginalPost(!revertToOriginalPost); 
                  revertBackToOriginalPost();
                }}
              >
                Revert to original
              </span> */}
            </div>
            <div className="w-1/2 flex justify-end items-center">
              <button
                onClick={saveDraftPost}
                style={{
                  background:
                    "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                  color: "white",
                }}
                className="text-md text-white py-2 px-5 rounded-full mr-3"
              >
                Save to Draft
              </button>
              {savingDraft ? (
                <BiLoaderCircle
                  className="animate-spin"
                  color="#7438FF"
                  size={20}
                />
              ) : (
                ""
              )}
              <Tooltip
                title={
                  connectionEntry === "manual"
                    ? "To unlock this feature reconnect your youtube account from Settings page"
                    : "Directly update your youtube video after editing"
                }
                position="top"
                trigger="mouseenter"
                animation="fade"
                theme="translucent"
              >
                <button
                  onClick={updateUserVideo}
                  style={{
                    background:
                      connectionEntry === "manual"
                        ? "grey"
                        : "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                    color: connectionEntry === "manual" ? "black" : "white",
                    cursor:
                      connectionEntry === "manual" ? "not-allowed" : "pointer",
                  }}
                  disabled={connectionEntry === "manual"}
                  className="text-md text-white py-2 px-5 rounded-full ml-10 mr-3 flex items-center justify-center"
                >
                  <div className="mr-3">
                    <FaYoutube size={20} />
                  </div>
                  Update on Youtube
                </button>
              </Tooltip>

              {updatingYtPost && (
                <BiLoaderCircle
                  className="animate-spin"
                  color="#7438FF"
                  size={20}
                />
              )}
            </div>
          </div>
          <div className="flex pl-5 pb-5 border-b border-t pt-5">
            <div className="w-1/2 items-center flex">
              Search Term:
              {userSavedSearchTerm ? (
                <span className="flex justify-center items-center ml-3">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={userSavedSearchTerm ?? ""}
                    onChange={handleSearchTermChange}
                    className="mt-1 p-2 border rounded w-full text-xs"
                    placeholder="Enter a search term"
                  />
                  <AiFillCheckCircle
                    onClick={() => setShowSearchTermPanel(false)}
                    color="#7438FF"
                    size={30}
                    className="mt-2 cursor-pointer w-1/5 ml-2"
                  />
                  <FiSearch
                    onClick={() => setShowSearchTermPanel(true)}
                    color="#7438FF"
                    size={30}
                    className="mt-2 cursor-pointer w-1/5 ml-2"
                  />
                  {/* <span className="underline">{userSavedSearchTerm}</span>{" "} */}
                  {/* <div className="relative+">
                    <Tooltip
                      title="Edit the search term  for your video"
                      position="top"
                      trigger="mouseenter"
                      animation="fade"
                      theme="translucent"
                    >
                      <BiEdit
                        color="#7352FF"
                        onClick={() => setShowSearchTermPanel(true)}
                      />
                    </Tooltip>
                  </div> */}
                </span>
              ) : (
                <div className="relative flex items-center ml-3">
                  <div className="flex items-center">
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={userSavedSearchTerm ?? ""}
                      onChange={handleSearchTermChange}
                      className="mt-1 p-2 border rounded w-full text-xs"
                      placeholder="Enter a search term"
                    />
                    <AiFillCheckCircle
                      onClick={() => setShowSearchTermPanel(false)}
                      color="#7438FF"
                      size={30}
                      className="mt-2 cursor-pointer w-1/5 ml-2"
                    />
                    <FiSearch
                      onClick={() => setShowSearchTermPanel(true)}
                      color="#7438FF"
                      size={30}
                      className="mt-2 cursor-pointer w-1/5 ml-2"
                    />
                  </div>
                  <Tooltip
                    title="Set a search term  for your video"
                    position="top"
                    trigger="mouseenter"
                    animation="fade"
                    theme="translucent"
                  >
                    <AiFillWarning
                      className="ml-3 mt-2"
                      color="#F49C0E"
                      size={30}
                      onClick={() => setShowSearchTermPanel(true)}
                    />
                  </Tooltip>
                </div>
              )}
            </div>
            <div className="w-1/2 flex justify-around items-center">
              <button
                className={`text-center px-7 h-full ${
                  activeView === "thingsToFix" && "chosenView"
                }`}
                onClick={() => handleViewChange("thingsToFix")}
              >
                Things to fix
              </button>
              {/* <button className="text-center px-7 h-full">AI</button> */}
              <button
                className={`text-center px-7 h-full ${
                  activeView === "KeywordsView" && "chosenView"
                }`}
                onClick={() => handleViewChange("KeywordsView")}
              >
                Keywords
              </button>
              <button
                className={`text-center px-7 h-full ${
                  activeView === "TemplatesView" && "chosenView"
                }`}
                onClick={() => handleViewChange("TemplatesView")}
              >
                Templates
              </button>
            </div>
          </div>
          {showSearchTermPanel ? (
            <SearchTerm videoId={videoId} />
          ) : (
            <div className="flex h-screen">
              <div className="w-1/2 h-full overflow-y-auto p-4 pr-8 mt-7">
                <form>
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Video Title ({formData.title.length}/{maxTitleCharacters})
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title ?? ""}
                      onChange={handleChange}
                      maxLength={maxTitleCharacters}
                      className="mt-1 p-2 border rounded w-full text-xs"
                      placeholder="Enter a Title for your Video"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Video Description ({formData.description.length}/
                      {maxDescriptionCharacters})
                    </label>
                    <textarea
                      type="text"
                      id="description"
                      name="description"
                      rows="10"
                      value={formData.description ?? ""}
                      onChange={handleChange}
                      maxLength={maxDescriptionCharacters}
                      className="mt-1 p-2 border rounded w-full text-xs"
                      placeholder="Enter a Description for your Video"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="tags"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Video Tags ({formData.tags.length}/{maxTagsCharacters})
                    </label>
                    <textarea
                      type="text"
                      id="tags"
                      name="tags"
                      rows="5"
                      value={
                        formData.tags !== "undefined" &&
                        formData.tags !== "null"
                          ? formData.tags
                          : ""
                      }
                      onChange={handleChange}
                      maxLength={maxTagsCharacters}
                      className="mt-1 p-2 border rounded w-full text-xs"
                      placeholder="Enter a comma after each tag"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="tags"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Thumbnail
                    </label>
                    <img
                      className="mt-4"
                      src={
                        selectedFile
                          ? URL.createObjectURL(selectedFile)
                          : selectedYoutubePost.thumbnail
                      }
                      alt="Video Thumbnail"
                    />
                  </div>
                  <div
                    className="relative px-5 py-2 border-2 w-2/4 rounded-md"
                    style={{
                      background:
                        "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                      color: "white",
                    }}
                  >
                    <label className="cursor-pointer flex items-center">
                      <FiCamera className="camera-icon mr-3" />
                      Update your thumbnail
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </form>
              </div>
              {activeView === "thingsToFix" && ThingsToFixView()}
              {activeView === "KeywordsView" && KeywordsView()}
              {activeView === "TemplatesView" && TemplatesView()}
              {savingToBookmark && (
                <LoaderPanel message={"Saving to Bookmark"} />
              )}
              {removingFromBookmark && (
                <LoaderPanel message={"Removing from Bookmark"} />
              )}
            </div>
          )}
        </div>
      ) : (
        <Loader message={"Fetching your youtube post"} />
      )}
    </div>
  );
}

export default Opitimize;
