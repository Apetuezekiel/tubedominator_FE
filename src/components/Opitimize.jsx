/* eslint-disable */
import { useState } from "react";
import heroImage from "../data/avatar3.png";
import { FaChevronDown, FaChevronUp, FaYoutube } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { BiEdit } from "react-icons/bi";
import { thingsToFix, itemsFixed } from "../data/optimizeData";
import { useEffect } from "react";
import {
  useKeywordStore,
  useShowSearchTermPanel,
  useUserSavedSearchTerm,
  useUserYoutubeInfo,
} from "../state/state";
import Spinner from "./Spinner";
import { userFullDataDecrypted } from "../data/api/calls";
import axios from "axios";
import { FiCamera } from "react-icons/fi";
import { BiSearch } from "react-icons/bi";
import { AiOutlineCopy, AiOutlineRollback } from "react-icons/ai";
import { BsFillBookmarkCheckFill, BsBookmark } from "react-icons/bs";
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
// const exactKeywordData = useKeywordStore((state) => state.exactKeywordData);
// const setExactKeywordData = useKeywordStore(
//   (state) => state.setExactKeywordData,
// );
// import Spinner from "../components/Spinner";

function Opitimize({ videoId }) {
  const decryptedFullData = userFullDataDecrypted();
  const [isUserDataLoaded, setIsuserDataLoaded] = useState(false);
  const userYoutubeData = useUserYoutubeInfo((state) => state.userYoutubeData);
  const setUserYoutubeData = useUserYoutubeInfo(
    (state) => state.setUserYoutubeData,
  );
  const showSearchTermPanel = useShowSearchTermPanel((state) => state.showSearchTermPanel);
  const setShowSearchTermPanel = useShowSearchTermPanel(
    (state) => state.setShowSearchTermPanel,
  );
  const [formData, setFormData] = useState({
    title:
      userYoutubeData[0]?.title !== undefined
        ? String(userYoutubeData[0].title)
        : "",
    description:
      userYoutubeData[0]?.description !== undefined
        ? String(userYoutubeData[0].description)
        : "",
    tags:
      userYoutubeData[0]?.tags !== undefined
        ? String(userYoutubeData[0].tags)
        : "",
    thumbnail: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [unfixed, setUnfixed] = useState([]);
  const [fixed, setFixed] = useState([]);
  const searchTerm = "church";
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
  const [processedUserSearchTerms, setProcessedUserSearchTerms] = useState([]);
  const userSavedSearchTerm = useUserSavedSearchTerm(
    (state) => state.userSavedSearchTerm,
  );

  let savedData;

  const goBack = () => {
    window.history.goBack();
  };

  const staticData = [
    { keyword: "Keyword 1", source: "Source 1", monthlysearch: 1000 },
    { keyword: "Keyword 2", source: "Source 2", monthlysearch: 1500 },
    { keyword: "Keyword 3", source: "Source 3", monthlysearch: 800 },
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchMyYoutubeVideos = async () => {
      try {
        axios
          .get(`http://localhost:8080/api/fetchMyYoutubeVideos`, {
            params: {
              channel_id: decryptedFullData.channelId,
              videoIds: videoId,
            },
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
              Authorization: `Bearer ${decryptedFullData.token}`,
              gToken: decryptedFullData.gToken,
            },
          })
          .then((response) => {
            if (isMounted) {
              setUserYoutubeData(response.data);
              setIsuserDataLoaded(true);
              console.log(response);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMyYoutubeVideos();
  }, []);

  // Loading searchTerms from localstorage
  useEffect(() => {
    const fetchUserKeywords = async () => {
      const savedDataJSON = localStorage.getItem("searchedItems");
      if (!savedDataJSON) {
        showToast("success", "nothing in local storage", 2000);
        return;
      }

      try {
        savedData = JSON.parse(savedDataJSON);
        console.log("now serving from local storage", savedData);

        try {
          const response = await axios.get(
            "http://localhost:8080/api/allBookmarkSearchTerms",
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

          const data = response.data;
          console.log("data", response);

          if (response.data.success === "trueNut") {
            showToast("error", "No saved search terms", 2000);
          } else if (response.data.success == true) {
            setUserSearchTerms(data.data);

            if (savedDataJSON) {
              const updatedArray1 = savedData.map((obj1) => {
                const matchingObj2 = data.data.find(
                  (obj2) => obj2.keyword === obj1.keyword,
                );

                if (matchingObj2) {
                  return { ...obj1, bookmarked: true };
                }
                return obj1;
              });

              setProcessedUserSearchTerms(updatedArray1);
              console.log("updatedArray1", updatedArray1);
            }
          } else {
            showToast(
              "error",
              "An error occured with fetching your saved search terms",
              2000,
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          showToast("error", "No saved search terms", 2000);
        }
      } catch (error) {
        console.error("Error parsing data from local storage", error);
      }
    };

    fetchUserKeywords();
  }, [saveSuccess]);

  const handleGetIdeas = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    try {
      // setIsLoading(true);
      // console.log("handleGetIdeas   ", decryptedFullData.token);

      // const response = await axios.get(
      //   `http://localhost:8080/api/fetchKeywordStat?keyword=${searchQuery}`,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
      //       Authorization: `Bearer ${decryptedFullData.token}`,
      //     },
      //   },
      // );

      // const data = response.data;
      // console.log("response.data", response.data);
      setIsLoading(false);

      // const exactKeyword = data.response.exact_keyword[0];
      // const relatedKeywords = data.response.related_keywords;
      // const mergedData = relatedKeywords.unshift({
      //   competition_score: exactKeyword.competition_score,
      //   difficulty: exactKeyword.difficulty,
      //   estimated_views: exactKeyword.estimated_views,
      //   keyword: exactKeyword.keyword,
      //   monthlysearch: exactKeyword.monthlysearch,
      //   overallscore: exactKeyword.overallscore,
      // });

      // console.log('relatedKeywords', relatedKeywords);
      localStorage.setItem("searchedItems", JSON.stringify(staticData));
      const updatedArray1 = staticData.map((obj1) => {
        const matchingObj2 = userSearchTerms.find(
          (obj2) => obj2.keyword === obj1.keyword,
        );

        if (matchingObj2) {
          return { ...obj1, bookmarked: true };
        }
        return obj1;
      });

      setProcessedUserSearchTerms(updatedArray1);
      console.log("updatedArray1", updatedArray1);

      // console.log(keywordData);
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

  // const bookmarkSearchTerm = (props) => {
  //   console.log("propssssss", props);
  // }

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
      "http://localhost:8080/api/bookmarkSearchTerm",
      {
        keyword: props.keyword,
        search_volume: props.monthlysearch,
        email: decryptedFullData.email,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
          Authorization: `Bearer ${decryptedFullData.token}`,
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

  const toggleSave = async (props, save) => {
    console.log("props", props);
    setProcessingBookmarked(true);
    // let foundObject;
    // try {
    //   if (savedData.exact_keyword[0].keyword === keyword) {
    //     foundObject = savedData.exact_keyword.find(
    //       (item) => item.keyword === keyword,
    //     );
    //     alert(
    //       "Yo Bro. I am about to delete the exact Keyword. You sure about this bro?. This shit is irreversible bro. You gotta be sure bro. Click okay if you sure, but think hard bro!!",
    //     );
    //   } else {
    //     foundObject = savedData.related_keywords.find(
    //       (item) => item.keyword === keyword,
    //     );
    //   }

    //   console.log("savedIdeasData", savedIdeasData);
    //   console.log("foundObject.monthlysearch", foundObject);

    if (save) {
      showToast("success", "I WAN SAVE", 2000);
      const response = await axios.post(
        "http://localhost:8080/api/bookmarkSearchTerm",
        {
          keyword: props.keyword,
          search_volume: props.monthlysearch,
          email: decryptedFullData.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
            Authorization: `Bearer ${decryptedFullData.token}`,
          },
        },
      );
      // fetchSavedIdeasData()

      setProcessingBookmarked(false);
      // console.log("Data saved successfully and response:", foundObject);
      if (response.data.success) {
        setUserSearchTerms([...userSearchTerms, props]);
        setProcessedUserSearchTerms((prevState) => {
          return prevState.map((obj) => {
            if (obj.keyword === props.keyword) {
              return { ...obj, bookmarked: true };
            }
            return obj;
          });
        });
        setSaveSuccess(true);
        showToast("success", "Search Term saved successfully", 2000);
      } else {
        showToast("error", "Search Term wasn't saved. Try again", 2000);
      }
    } else {
      showToast("success", "I WAN DELETE", 2000);
      try {
        const responseDelete = await axios.delete(
          `http://localhost:8080/api/deleteSavedIdeaBookmarkSearchTerm`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
              Authorization: `Bearer ${decryptedFullData.token}`,
            },
            params: {
              keyword: props.keyword,
            },
          },
        );
        console.log("Data removed successfully", props.keyword);
        if (responseDelete.data.success) {
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
          showToast("success", "Search Term removed from Search Terms", 2000);
        } else {
          showToast("error", "Search Term wasn't removed. Try again", 2000);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    }
    // } catch (error) {
    //   console.error("Error saving/removing data:", error);
    //   showToast("error", "Error saving/removing data", 2000);
    // }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchMyYoutubeVideos = async () => {
      try {
        axios
          .get(`http://localhost:8080/api/fetchMyYoutubeVideos`, {
            params: {
              channel_id: decryptedFullData.channelId,
              videoIds: videoId,
            },
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
              Authorization: `Bearer ${decryptedFullData.token}`,
              gToken: decryptedFullData.gToken,
            },
          })
          .then((response) => {
            if (isMounted) {
              setUserYoutubeData(response.data);
              setIsuserDataLoaded(true);
              console.log(response);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMyYoutubeVideos();
  }, []);

  // urban metro -- Island
  // board room -- Mainland
  // Orange -- Mainland
  // Dj COnsequence club -- Mainland
  // face scrub, body oil, soap, perfume, Sneakers

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
      return prevUnfixed; // Return the unchanged array if no changes were made
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
      return prevFixed; // Return the unchanged array if no changes were made
    });
  };

  const AICheck = () => {
    const urlRegex =
      /(https?:\/\/[^\s]*|www\.[^\s]*|[^@]+\.[^\s]+\.com[^\s]*)/g;
    const hashtagRegex = /#[A-Za-z0-9_-]+/g;
    const timestampRegex = /0:00/; // Check for the pattern "0:00"

    // Validation and checks for title
    const titleHasSearchTerm = formData.title.includes(userSavedSearchTerm);
    const titleLengthOkay =
      formData.title.length > 0 && formData.title.length <= 70;
    validateAndAddToFixed(0, titleHasSearchTerm, "Invalid title");
    validateAndAddToFixed(1, titleLengthOkay, "Invalid title");

    // Validation and checks for description
    const descriptionHasSearchTerm = formData.description.includes(userSavedSearchTerm);
    const descriptionHasUrl = formData.description.match(urlRegex);
    const descriptionHasHashtag = formData.description.match(hashtagRegex);
    const descriptionHasTimestamps = formData.description.match(timestampRegex);

    validateAndAddToFixed(2, descriptionHasSearchTerm, "Invalid description");
    validateAndAddToFixed(3, descriptionHasTimestamps, "Invalid hashtag");
    validateAndAddToFixed(4, descriptionHasUrl, "Invalid URL");
    validateAndAddToFixed(5, descriptionHasHashtag, "Invalid hashtag");

    // Validation and checks for tags
    const tagsArray = formData.tags.split(",");
    const tagsLengthOkay = tagsArray.length >= 5;
    console.log("tagsArray", tagsArray, tagsLengthOkay);
    const tagsHasSearchTerm = formData.tags.includes(userSavedSearchTerm);

    validateAndAddToFixed(7, formData.tags, "Tags are required");
    validateAndAddToFixed(8, tagsLengthOkay, "Too few tags");
    validateAndAddToFixed(9, tagsHasSearchTerm, "Invalid tag search");
  };

  useEffect(() => {
    AICheck();
  }, [formData, userSavedSearchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFormData({ ...formData, ["thumbnail"]: file });
  };

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
    const requestData = {
      videoId: userYoutubeData.videoId,
      categoryId: userYoutubeData.categoryId,
      videoTitle: formData.title,
      videoDescription: formData.description,
      videoTags: formData.tags,
      // videoThumbnailUrl: 'https://example.com/thumbnail.jpg',
      // videoThumbnailHeight: 120,
      // videoThumbnailWidth: 160,
    };

    const requestHeaders = {
      "Content-Type": "application/json",
      "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
      Authorization: `Bearer ${decryptedFullData.token}`,
      gToken: decryptedFullData.gToken,
    };

    try {
      axios
        .put(`http://localhost:8080/api/updateMyYoutubeVideos`, requestData, {
          headers: requestHeaders,
        })
        .then((response) => {
          if (isMounted) {
            console.log("Success:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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

      // Reset the "Copied" state after a brief delay
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    };

    // const makeFavorite = () => {
    //   isSearchTermFavorite ? toggleSave(props, false) : toggleSave(props, true);
    // };
    // showToast('warning', "Format views was rendered")
    // const bookmarkIcon = isSearchTermFavorite ? (
    //   <BsFillBookmarkCheckFill color="#7352FF" />
    // ) : (
    //   <BsBookmark color="#7352FF" />
    // );

    // const bookmarkIcon = isSearchTermFavorite ? (
    //   <BsFillBookmarkCheckFill
    //     color="#7352FF"
    //     onClick={() => toggleSave(props, false)}
    //   />
    // ) : (
    //   <BsBookmark color="#7352FF" onClick={() => toggleSave(props, true)} />
    // );

    const bookmarkIcon = props.bookmarked ? (
      <BsFillBookmarkCheckFill
        color="#7352FF"
        onClick={() => toggleSave(props, false)}
      />
    ) : (
      <BsBookmark color="#7352FF" onClick={() => toggleSave(props, true)} />
    );

    return (
      <div className="grid grid-cols-3 items-center">
        <span className="mr-3">{formatedNumber}</span>
        <span className="mr-3 cursor-pointer text-sm flex items-center">
          <span className="mr-2">{bookmarkIcon}</span>
          <span>{processingBookmarked && <Spinner width={3} />}</span>
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
    const monthlysearch = parseInt(props.search_volume);
    const formatedNumber = formatNumberToKMBPlus(monthlysearch);

    const copyToClipboard = () => {
      const textField = document.createElement("textarea");
      textField.innerText = props.keyword;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand("copy");
      textField.remove();
      setIsCopied(true);

      // Reset the "Copied" state after a brief delay
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
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
            <TiDelete
              color="#7352FF"
              onClick={() => toggleSave(props, false)}
            />
          </span>
          {/* <span>{processingBookmarked && <Spinner width={3} />}</span> */}
        </span>
      </div>
    );
  };

  const sourceTemplate = (props) => {
    return (
      <span>
        <FaYoutube color="red" />
      </span>
    );
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

  // ?VIEWS
  const handleViewChange = (viewName) => {
    setActiveView(viewName);
  };

  const ThingsToFixView = () => {
    return (
      <div className="w-1/2 h-full overflow-y-auto p-4">
        <div className="p-4">
          <div className="mb-4">
            <h4 className="font-semibold">
              Things to Fix{" "}
              <span className="ml-3 text-xs px-5 py-1 rounded-full bg-red-600 text-white">
                {unfixed.length}
              </span>
            </h4>

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
                      dangerouslySetInnerHTML={{ __html: String(section.content).replace(
                        "search_term",
                        userSavedSearchTerm,
                      ) }}
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
  const [isOpen2, setIsOpen2] = useState(false);

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
                      <p>
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
                      </p>
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
                          <div className="flex flex-col w-4/6">
                            <span className="mb-2">
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
                              />
                              <BiSearch
                                className="text-gray-500 text-lg cursor-pointer"
                                onClick={handleGetIdeas}
                              />
                            </div>
                          </div>

                          <div className="relative ml-4 w-2/6">
                            <select className="rounded-full py-2 pl-4 border border-gray-300 bg-white text-xs">
                              <option value="en">Global (English)</option>
                              <option value="es">Español </option>
                              <option value="fr">Français</option>
                              <option value="de">Deutsch</option>
                            </select>
                          </div>
                        </div>
                        <br />

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
                              width="250"
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
                              template={formatViews}
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

                        <div>
                          {isLoading ? (
                            <div className="loading-container">
                              <Spinner />
                            </div>
                          ) : (
                            <div className=""></div>
                          )}
                        </div>
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

  return (
    <div className="flex h-screen flex-col px-10 py-5">
      <div className="flex pl-5 pb-5 pt-5">
        <div className="w-1/2 items-center flex">
          <AiOutlineRollback
            onClick={goBack}
            className="mr-3"
            color="#7352FF"
            size={20}
          />
          <img
            src={userYoutubeData[0]?.thumbnails.url}
            alt=""
            height="20"
            width="50"
            className="mr-3"
          />
          <div className="underline">{userYoutubeData[0]?.title}</div>
          <span
            className="ml-3 text-xs px-5 py-1 rounded-lg text-white"
            style={{ backgroundColor: "#7438FF" }}
          >
            Draft
          </span>
        </div>
        <div className="w-1/2 flex justify-end items-center">
          <button
            onClick={updateUserVideo}
            style={{ backgroundColor: "#7438FF" }}
            className="text-md text-white py-2 px-5 rounded"
          >
            Update on Youtube
          </button>
        </div>
      </div>
      <div className="flex pl-5 pb-5 border-b border-t pt-5">
        <div className="w-1/2 items-center flex">
          Search Term:
          {userSavedSearchTerm ? (
            <span className="flex justify-center items-center ml-2">
              <span className="underline">{userSavedSearchTerm}</span>{" "}
              <div className="relative">
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
              </div>
            </span>
          ) : (
            <div className="relative">
              <Tooltip
                title="Set a search term  for your video"
                position="top"
                trigger="mouseenter"
                animation="fade"
                theme="translucent"
              >
                <BiEdit
                  className="ml-3"
                  color="#7352FF"
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
          <button className="text-center px-7 h-full">AI</button>
          <button
            className={`text-center px-7 h-full ${
              activeView === "KeywordsView" && "chosenView"
            }`}
            onClick={() => handleViewChange("KeywordsView")}
          >
            Keywords
          </button>
          <button className="text-center px-7 h-full">Templates</button>
        </div>
      </div>
      {showSearchTermPanel ? (
        <SearchTerm />
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
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={maxTitleCharacters}
                  className="mt-1 p-2 border rounded w-full"
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
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={maxDescriptionCharacters}
                  className="mt-1 p-2 border rounded w-full"
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
                  value={formData.tags}
                  onChange={handleChange}
                  maxLength={maxTagsCharacters}
                  className="mt-1 p-2 border rounded w-full"
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
                      : userYoutubeData[0]?.thumbnails.url
                  }
                  alt="Video Thumbnail"
                />
              </div>
              <div class="relative px-5 py-2 border-2 w-2/4 border-gray-400 rounded-md">
                <label class="cursor-pointer flex items-center">
                  <FiCamera className="camera-icon mr-3" />
                  Update your thumbnail
                  <input
                    type="file"
                    accept="image/*"
                    class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </form>
          </div>
          {activeView === "thingsToFix" && ThingsToFixView()}
          {activeView === "KeywordsView" && KeywordsView()}
        </div>
      )}
    </div>
  );
}

export default Opitimize;
