/* eslint-disable */
import React, { useEffect, useState } from "react";
import "../index.css";
import axios from "axios";
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
import { Header } from "../components";
import IdeasCategoryView from "../components/IdeasCategoryView";
import {
  useUserYoutubeInfo,
  useKeywordStore,
  useSavedIdeasData,
  useUserAuthToken,
  useUserLoggedin,
  useAllUserDeets,
} from "../state/state";
import { useStateContext } from "../contexts/ContextProvider";
import { useUser } from "@clerk/clerk-react";
import showToast from "../utils/toastUtils";
// import { getUserEncryptedData } from "../data/api/calls";
import CryptoJS from "crypto-js";
import { getSavedIdeas, userFullDataDecrypted } from "../data/api/calls";
import countriesWithLanguages from "../data/countries";
import {
  HiOutlineChevronDown,
  HiOutlineTrendingDown,
  HiOutlineTrendingUp,
  HiSearch,
} from "react-icons/hi";
import { HiOutlineRefresh } from "react-icons/hi";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import {
  FaYoutube,
  FaGoogle,
  FaPlus,
  FaVideo,
  FaFolderPlus,
} from "react-icons/fa";
import { BiSearch, BiWorld, BiStar, BiLoaderCircle } from "react-icons/bi";
import { FiEye, FiSearch, FiTrendingUp } from "react-icons/fi";
import {
  BsArrowDownShort,
  BsArrowUpShort,
  BsDot,
  BsLightningChargeFill,
} from "react-icons/bs";
import { RiKey2Fill } from "react-icons/ri";
import { formatNumberToKMBPlus } from "../data/helper-funtions/helper";
import Insights from "./keywords/Insights";
import Competition from "./keywords/Competition";
import Loader from "../components/Loader";
import GenerateIdeasPanel from "../components/GenerateIdeasPanel";
import ThemeContext from "../themes/ThemeContext";
// import { PotentialViewsTitleTemplate, TrendsTitleTemplate, VideoIconTitleTemplate, VolumeTitleTemplate, keywordDiffTitleTemplate } from "../data/api/tableHelper";

const Ideation = () => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const decryptAndRetrieveData = (data) => {
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

  const userAuthToken = useUserAuthToken((state) => state.userAuthToken);
  const setUserAuthToken = useUserAuthToken((state) => state.setUserAuthToken);
  // const { user } = useUser();
  const userYoutubeData = useUserYoutubeInfo((state) => state.userYoutubeData);
  const setUserYoutubeData = useUserYoutubeInfo(
    (state) => state.setUserYoutubeData,
  );
  const { savedIdeasData, setSavedIdeasData, fetchSavedIdeasData } =
    useSavedIdeasData();

  const exactKeywordData = useKeywordStore((state) => state.exactKeywordData);
  const setExactKeywordData = useKeywordStore(
    (state) => state.setExactKeywordData,
  );
  const relatedKeywordData = useKeywordStore(
    (state) => state.relatedKeywordData,
  );
  const setRelatedKeywordData = useKeywordStore(
    (state) => state.setRelatedKeywordData,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(null);
  const [loadedLocalStorage, setLoadedLocalStorage] = useState(false);
  const [ideasDataSet, setIdeasDataSet] = useState(false);
  const [showSavedIdeaCategoryPanel, setShowSavedIdeaCategoryPanel] =
    useState(false);
  const [savingKeywordIdea, setSavingKeywordIdea] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const userLoggedIn = useUserLoggedin((state) => state.userLoggedIn);
  const setUserLoggedIn = useUserLoggedin((state) => state.setUserLoggedIn);
  const allUserDeets = useAllUserDeets((state) => state.allUserDeets);
  const setAllUserDeets = useAllUserDeets((state) => state.setAllUserDeets);
  const encryptedGData = localStorage.getItem("encryptedGData");
  // const decryptedFullData = userFullDataDecrypted();
  const [keywordSuggestionRemark, setKeywordSuggestionRemark] = useState("");
  const [showCompetition, setShowCompetition] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [searchQueryComplete, setSearchQueryComplete] = useState("");
  const initialCountry = {
    countryCode: "GLB",
    languageCode: "en",
  };
  const [postData, setPostData] = useState({
    keyword: "",
    countryCode: "",
    languageCode: "",
  });
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [selectedOption, setSelectedOption] = useState("all");
  // console.log(decryptedFullData);

  useEffect(() => {
    // Get saved data from localStorage
    const savedDataString = localStorage.getItem("lastVideoIdeas");

    // Check if there is any saved data
    if (!savedDataString) {
      console.log("No saved data found in localStorage");
      // Handle the case when there is no saved data
      return;
    }

    try {
      // Parse the JSON data from localStorage
      const savedData = JSON.parse(savedDataString);
      console.log("Decrypted full data", savedData);

      // Set the user as logged in
      setUserLoggedIn(true);

      // Set the state with the data from localStorage
      setLoadedLocalStorage(true);
      setRelatedKeywordData(savedData.related_keywords);
      setExactKeywordData(savedData.exact_keyword);

      console.log("Now serving from local storage", savedData);
    } catch (error) {
      console.error("Error parsing JSON from localStorage", error);
      // Handle the error, e.g., show an error message or fallback behavior
    }
  }, []);

  // useEffect(() => {
  //   const userLevel = localStorage.getItem("accessLevel");
  //   if (userLevel === "L1") {
  //     alert(
  //       "Connect your Youtube Account now to enjoy the cool features of Tubedominator",
  //     );
  //   }
  // }, []);

  // useEffect(() => {
  //   const handleGetIdeas = async () => {
  //     if (!searchQuery.trim()) {
  //       console.log("I got here and cant rn the second time")
  //       return;
  //     }

  //     const postData = {
  //       keyword: searchQuery,
  //       countryCode: selectedCountry.countryCode,
  //       languageCode: selectedCountry.languageCode,
  //     };

  //     console.log("postData", postData);

  //     try {
  //       setIsLoading(true);
  //       console.log("handleGetIdeas", decryptedFullData.token);

  //       const response = await axios.post(
  //         `${process.env.REACT_APP_API_BASE_URL}/fetchKeywordStat`,
  //         postData,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             "x-api-key": process.env.REACT_APP_X_API_KEY,
  //             Authorization: `Bearer ${decryptedFullData.token}`,
  //           },
  //         },
  //       );

  //       const data = response.data;
  //       console.log("response.data", response.data);
  //       console.log("response", response);
  //       setIsLoading(false);

  //       // Update state with the API response
  //       setExactKeywordData(data.response.exact_keyword);
  //       setRelatedKeywordData(data.response.related_keywords);
  //       localStorage.setItem("lastVideoIdeas", JSON.stringify(data.response));
  //       setLoadedLocalStorage(false);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       showToast(
  //         "error",
  //         `Couldn't fetch results for your search "${searchQuery}"`,
  //         5000,
  //       );
  //       setIsLoading(false);
  //     }
  //   };

  //   if (searchQueryComplete) {
  //     handleGetIdeas();
  //   }
  // }, []);

  // useEffect(() => {
  //   console.log("userAuthToken 1 decryptedFullData", decryptedFullData);
  //   const user_id = decryptedFullData.user_id;
  //   if (!userAuthToken) {
  //     const grabUserToken = async () => {
  //       try {
  //         const response = await axios.get(
  //           `  /getSavedUserToken?user_id=${user_id}`,
  //           {
  //             headers: {
  //               "Content-Type": "application/json",
  //               "x-api-key": process.env.REACT_APP_X_API_KEY,
  //             },
  //           },
  //         );
  //         console.log("response.data", response.data);
  //         setUserAuthToken(response.data.token);
  //         console.log("userAuthToken 2", response.data.token);
  //       } catch (error) {
  //         console.error("Error fetching user token:", error);
  //       }
  //     };

  //     grabUserToken();
  //   }
  // }, []);

  // setUserLoggedIn(true);

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

  function removeUndefinedOrNull(arr) {
    return arr.filter((item) => item !== undefined && item !== null);
  }

  const toggleSave = async (keyword, save) => {
    setSavingKeywordIdea(true);
    // fetchSavedIdeasData()
    console.log("relatedKeywordData", keyword, relatedKeywordData);
    console.log("exactKeywordData", exactKeywordData);
    console.log("related_keywords", savedData.related_keywords, savedData);
    let foundObject;
    try {
      if (savedData.exact_keyword[0].keyword === keyword) {
        foundObject = savedData.exact_keyword.find(
          (item) => item.keyword === keyword,
        );
        // console.log("Yo Bro. I am about to delete the exact Keyword. You sure about this bro?. This shit is irreversible bro. You gotta be sure bro. Click okay if you sure, but think hard bro!!");
        alert("Are you sure you want to delete?");
      } else {
        foundObject = savedData.related_keywords.find(
          (item) => item.keyword === keyword,
        );
      }

      console.log("savedIdeasData", savedIdeasData);
      console.log("foundObject.monthlysearch", foundObject);

      if (save) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/addToSavedIdeas`,
          {
            video_ideas: foundObject.keyword,
            search_volume: foundObject.monthlysearch,
            keyword_diff: foundObject.difficulty,
            trends: foundObject.trends,
            potential_views: foundObject.estimated_views,
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

        console.log("Data saved successfully and response:", foundObject);
        if (response.data.success) {
          setSavingKeywordIdea(false);
          showToast("success", "Idea saved successfully", 2000);
        } else {
          setSavingKeywordIdea(false);
          showToast("error", "Idea wasn't saved. Try again", 2000);
        }
      } else {
        try {
          const response = await axios.get(
            `${
              process.env.REACT_APP_API_BASE_URL
            }/getAllSavedIdeas?email=${localStorage.getItem("userRegEmail")}`,
            {
              headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.REACT_APP_X_API_KEY,
                // Authorization: `Bearer ${decryptedFullData.token}`,
              },
            },
          );
          // return response.data;
          console.log("to delete response.data", response.data.data);
          const data = response.data.data;
          const findFoundObjectInSaved = data.find(
            (item) => item.video_ideas === foundObject.keyword,
          );

          console.log("to delete response.data 2", findFoundObjectInSaved);
          // console.log("decryptedFullData.email", decryptedFullData.email);

          const responseDelete = await axios.delete(
            `${process.env.REACT_APP_API_BASE_URL}/deleteSavedIdea/${findFoundObjectInSaved.id}`,
            {
              headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.REACT_APP_X_API_KEY,
                // Authorization: `Bearer ${decryptedFullData.token}`,
              },
              params: {
                email: localStorage.getItem("userRegEmail"),
              },
            },
          );
          console.log("Data removed successfully", findFoundObjectInSaved);
          if (responseDelete.data.success) {
            setSavingKeywordIdea(false);
            showToast("success", "Idea removed from Saved Ideas", 2000);
          } else {
            showToast("error", "Idea wasn't removed. Try again", 2000);
          }
        } catch (error) {
          setSavingKeywordIdea(false);
          console.error("Error fetching data:", error);
          throw error; // Rethrow the error to handle it in the component if needed
        }
      }
    } catch (error) {
      setSavingKeywordIdea(false);
      console.error("Error saving/removing data:", error);
      showToast("error", "Error saving/removing data", 2000);
    }
  };

  const formatDate = (props) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return (
      <div>
        {new Date(props.publishedAt).toLocaleDateString("en-US", options)}
      </div>
    );
  };

  const handleRowSelected = async (args) => {
    try {
      console.log("saved");
      // Use selectedRowData here instead of selectedRows
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/addToSavedIdeas`,
        {
          video_ideas: args.data.keyword,
          search_volume: args.data.monthlysearch,
          keyword_diff: args.data.difficulty,
          potential_views: args.data.estimated_views,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            Authorization: `Bearer ${userAuthToken}`,
          },
        },
      );

      console.log("yyyyyyyyyyyyyy");
      // console.log('selectedRowData', selectedRowData);
    } catch (error) {
      console.error("Error saving data:", error);
      // console.log('selectedRowData', selectedRowData);
    }
    // }
  };

  const editing = { allowDeleting: true, allowEditing: true };
  const keywordDiffTemplate = (props) => {
    return (
      <button
        type="button"
        style={{
          backgroundColor:
            props.difficulty === "High"
              ? "#FBDBC8"
              : props.difficulty === "Low"
              ? "#D2E7D0"
              : props.difficulty === "Medium"
              ? "#FCECBB"
              : "transparent",
          // width: "20px !important",
        }}
        className="py-1 px-2 capitalize rounded-2xl text-md KwDiffButtonSize"
      >
        {props.difficulty}
      </button>
    );
  };

  function gridOrderStars2(props) {
    const [isFavorite, setIsFavorite] = useState(false);

    const makeFavorite = () => {
      setIsFavorite(!isFavorite);
    };

    return (
      <div className="flex items-center justify-center" onClick={makeFavorite}>
        {isFavorite ? <AiFillStar /> : <AiOutlineStar />}
      </div>
    );
  }

  const gridOrderStars = (props) => {
    // const { keyword, toggleSave, savingKeywordIdea } = props;
    const { keyword } = props;
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = () => {
      setIsFavorite((prevIsFavorite) => !prevIsFavorite);
      // toggleSave(keyword, !isFavorite);
    };

    const starIcon = savingKeywordIdea ? (
      <BiLoaderCircle color="#7352FF" size={15} />
    ) : isFavorite ? (
      <AiFillStar className="cursor-pointer" color="#7352FF" />
    ) : (
      <AiOutlineStar className="cursor-pointer" color="#7352FF" />
    );

    return (
      <div
        className="flex items-center justify-center"
        onClick={() => {
          setShowSavedIdeaCategoryPanel(true);
          setIdeasDataSet(props);
        }}
      >
        {starIcon}
      </div>
    );
  };

  const IdeaCategoryPanel = async (props) => {
    // setShowSavedIdeaCategoryPanel(true);
    console.log("props", props);
    return <IdeasCategoryView dataSet={props} />;
  };

  function formatNumberToKPlus(number) {
    if (number >= 1000) {
      const formattedNumber = Math.floor(number / 1000);
      return formattedNumber + "k+";
    } else {
      return number.toString();
    }
  }

  const formatViews = (props) => {
    const estimatedViews = parseInt(props.estimated_views);
    const formatedNumber = formatNumberToKMBPlus(estimatedViews);

    return (
      <span className="flex items-center justify-center">{formatedNumber}</span>
    );
  };

  const searchVolumeDataRowTemplate = (props) => {
    const formatedNumber = formatNumberToKMBPlus(props.monthlysearch);
    return (
      <span className="flex items-center justify-center">{formatedNumber}</span>
    );
  };

  const TrendsDataRowTemplate = (props) => {
    const renderTrend = () => {
      const trend = Math.ceil(parseFloat(props.trend));

      if (trend > 0) {
        return (
          <span className="flex items-center justify-center">
            <span className="mr-1">
              <HiOutlineTrendingUp color="green" size={15} />
            </span>{" "}
            {trend}% {/* Up arrow */}
          </span>
        );
      } else if (trend < 0) {
        return (
          <span className="flex items-center justify-center">
            <span className="mr-1">
              <HiOutlineTrendingDown color="red" size={15} />
            </span>{" "}
            {trend}% {/* Down arrow */}
          </span>
        );
      } else {
        return (
          <span className="flex items-center justify-center">
            <span className="mr-1">
              <BsDot size={15} />
            </span>{" "}
            {props.trend}% {/* Circle or Zero */}
          </span>
        );
      }
    };

    return <div>{renderTrend()}</div>;
  };

  const youtubeGooglePlusIcons = [FiSearch];
  const videoIcon = [FaYoutube];

  function IconsWithTitle({ title, icons, color }) {
    return (
      <div className="flex items-center">
        {title}
        {icons.map((Icon, index) => (
          <span key={index} style={{ marginLeft: "5px", display: "flex" }}>
            <Icon color={`${color && color}`} />
          </span>
        ))}
      </div>
    );
  }

  const VolumeTitleTemplate = (props) => {
    return (
      <div className="flex items-center justify-center">
        <IconsWithTitle
          title={props.headerText}
          icons={youtubeGooglePlusIcons}
          color={"#9967FF"}
        />
      </div>
    );
  };

  const TrendsTitleTemplate = (props) => {
    const trendIcon = <FiTrendingUp size={15} color="green" />;
    return (
      <div className="flex items-center justify-center">
        {props.headerText}
        <div className="ml-2">{trendIcon}</div>
      </div>
    );
  };

  const keywordDiffTitleTemplate = (props) => {
    const diffIcon = <RiKey2Fill size={15} color="grey" />;
    return (
      <div className="flex items-center justify-center">
        {props.headerText}
        <div className="ml-2">{diffIcon}</div>
      </div>
    );
  };

  const PotentialViewsTitleTemplate = (props) => {
    const icon = <FiEye size={15} color="#E87A00" />;
    return (
      <div className="flex items-center justify-center">
        {props.headerText}
        <div className="ml-2">{icon}</div>
      </div>
    );
  };

  const VideoIconTitleTemplate = (props) => {
    return (
      <div className="tooltip-container flex items-center justify-center break-words">
        <IconsWithTitle
          title={props.headerText}
          icons={videoIcon}
          color={"red"}
        />
        <div className="tooltip-text text-black">
          Information about potential views
        </div>
      </div>
    );
  };

  const VideoIconTemplate = (props) => {
    // console.log("props", props);
    return (
      <div
        className="flex flex-col break-words"
        onClick={() => {
          setShowInsights(true);
          setIdeasDataSet(props);
        }}
      >
        <span className="text-md capitalize">{props.keyword}</span>
        <span
          className="text-xs text cursor-pointer"
          style={{ color: "#7352FF" }}
        >
          More Insights
        </span>
      </div>
    );
  };

  const gridInstance = React.createRef();

  const exportToExcel = () => {
    if (gridInstance.current) {
      gridInstance.current.excelExport();
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleGetIdeas = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    console.log("postData", postData);

    try {
      setIsLoading(true);
      // console.log("handleGetIdeas", decryptedFullData.token);

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
      console.log("response", response);
      setIsLoading(false);

      // Update state with the API response
      setExactKeywordData(data.response.exact_keyword);
      setRelatedKeywordData(data.response.related_keywords);
      localStorage.setItem("lastVideoIdeas", JSON.stringify(data.response));
      setLoadedLocalStorage(false);
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

  const isQuestion = (str) => {
    const questionKeywords = [
      "what",
      "when",
      "where",
      "who",
      "why",
      "how",
      "is",
      "are",
      "can",
      "could",
      "should",
    ];
    const words = str.toLowerCase().split(" ");

    for (const keyword of questionKeywords) {
      if (words.includes(keyword)) {
        return true;
      }
    }

    return false;
  };

  const findQuestions = (keywordsArray) => {
    // setKeywordSuggestionRemark("that are Question based");
    const questions = [];

    for (const keywordObj of keywordsArray) {
      if (isQuestion(keywordObj.keyword)) {
        questions.push(keywordObj);
      }
    }

    // questions.map(item => {
    //   it
    // })

    console.log(questions);
    // return questions;
    setRelatedKeywordData(questions);
  };

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    // Perform actions based on the selected option
    if (value === "all") {
      serveAllVideoIdeas();
    } else if (value === "questions") {
      findQuestions(relatedKeywordData);
    } else if (value === "keywords") {
      filterBySearchQuery(relatedKeywordData, searchQuery);
    }
  };

  // const findQuestions = (keywordsArray) => {
  //   setKeywordSuggestionRemark('that are Question based');
  //   const questions = [];

  //   for (const keywordObj of keywordsArray) {
  //     if (isQuestion(keywordObj.keyword)) {
  //       const keywordWithQuestionMark = keywordObj.keyword + "?";
  //       questions.push(keywordWithQuestionMark);
  //     }
  //   }

  //   console.log(questions);
  //   setRelatedKeywordData(questions);
  // };

  const filterBySearchQuery = (keywordsArray, searchQuery) => {
    const filteredKeywords = keywordsArray.filter((keywordObj) => {
      const lowerSearchQuery = searchQuery.toLowerCase();
      const lowerKeyword = keywordObj.keyword.toLowerCase();

      return lowerKeyword.includes(lowerSearchQuery);
    });

    setRelatedKeywordData(filteredKeywords);
  };

  const serveAllVideoIdeas = () => {
    let savedData = JSON.parse(localStorage.getItem("lastVideoIdeas"));

    setRelatedKeywordData(savedData.related_keywords);
    setExactKeywordData(savedData.exact_keyword);
  };

  const isSearchEmpty = searchQuery.trim() === "";

  const theme = React.useContext(ThemeContext);

  return (
    <section>
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          (showInsights || showCompetition) && "hidden"
        }`}
      >
        <div className="flex items-center justify-between h-full mb-5 relative">
          <div className="">
            <div className="pageTitle text-3xl font-semibold">Ideation</div>
            <div className="tag text-md mt-2 text-xs font-thin">
              Search and generate ideas for your next video!
            </div>
          </div>

          <button
            className={`text-white rounded-md px-4 py-2 ml-4 flex items-center text-xs getIdeasBtn`}
            onClick={() => {
              setShowSearchPanel(true);
            }}
            // disabled={isSearchEmpty}
            style={{
              background: theme.colors.buttonBg,
            }}
          >
            <BsLightningChargeFill className="mr-2" color="white" />
            Get Ideas
          </button>
          {showSearchPanel && (
            <GenerateIdeasPanel
              onSearchChange={handleSearchChange}
              setPostData={setPostData}
              postData={postData}
              setShowSearchPanel={setShowSearchPanel}
              setSearchQueryComplete={setSearchQueryComplete}
              handleGetIdeas={handleGetIdeas}
              handleGetIdeasOnEnter={handleGetIdeasOnEnter}
            />
          )}
        </div>
        {isLoading ? (
          <Loader message={"Gathering Insights for your Keyword."} />
        ) : (
          <div className=""></div>
        )}
        <div>
          <div className="bg-white px-5 pb-5 rounded-md">
            <div className="flex justify-start items-center">
              <Header title="Keyword you provided" size="text-1xl" />
              <span className="mt-5 ml-4 text-xs">
                {loadedLocalStorage && "(Results loaded from your last query)"}
              </span>
            </div>
            <GridComponent
              dataSource={exactKeywordData}
              allowExcelExport
              allowPdfExport
              allowPaging
              allowSorting
            >
              <ColumnsDirective>
                <ColumnDirective
                  field="isFavorite"
                  headerText=""
                  width="80"
                  template={gridOrderStars}
                />
                <ColumnDirective
                  field="keyword"
                  headerText="Video ideas"
                  headerTemplate={VideoIconTitleTemplate}
                  template={VideoIconTemplate}
                />
                <ColumnDirective
                  field="monthlysearch"
                  headerText="Search Volume on youtube"
                  headerTemplate={VolumeTitleTemplate}
                  template={searchVolumeDataRowTemplate}
                />
                <ColumnDirective
                  field="trend"
                  headerText="Trends"
                  headerTemplate={TrendsTitleTemplate}
                  template={TrendsDataRowTemplate}
                />
                <ColumnDirective
                  field="difficulty"
                  headerText="Keyword Difficulty"
                  headerTemplate={keywordDiffTitleTemplate}
                  template={keywordDiffTemplate}
                />
                <ColumnDirective
                  field="estimated_views"
                  headerText="Potential views on youtube"
                  headerTemplate={PotentialViewsTitleTemplate}
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
          </div>
          <br />
          <br />
          <div className="bg-white px-5 py-5 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <Header
                  title="Keyword Suggestions"
                  size="text-1xl"
                  className="mt-4"
                />
                <div className="mt-[-3]">
                  <span className="text-xs">{`${relatedKeywordData.length} video ideas found ${keywordSuggestionRemark}`}</span>
                </div>
              </div>
              <div className="flex">
                <div className="flex py-2">
                  <div className="flex justify-start items-center">
                    {/* <span className="text-xs">Filter:</span>

                    <div className="relative ml-4">
                      <select
                        className="rounded-sm py-2 pl-4 pr-8 border border-gray-300 bg-white text-xs"
                        value={selectedOption}
                        onChange={handleSelectChange}
                      >
                        <option value="all">All</option>
                        <option value="questions">Questions Only</option>
                        <option value="keywords">Keywords Only</option>
                      </select>
                    </div> */}

                    {/* <div
                      className="bg-white rounded-tl-full rounded-bl-full border border-gray-300 px-4 py-2 flex items-center w-24"
                      onClick={serveAllVideoIdeas}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="mr-2 text-xs">All</span>
                    </div>
                    <div
                      className="bg-white border border-gray-300 px-4 py-2 flex items-center"
                      onClick={() => findQuestions(relatedKeywordData)}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="mr-2 text-xs">Questions Only</span>
                    </div>
                    <div
                      className="bg-white rounded-tr-full rounded-br-full border border-gray-300 px-4 py-2 flex items-center"
                      onClick={() =>
                        filterBySearchQuery(relatedKeywordData, searchQuery)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <span className="mr-2 text-xs">Keywords Only</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            <GridComponent
              dataSource={relatedKeywordData}
              allowExcelExport
              allowPdfExport
              allowPaging
              allowSorting
            >
              <ColumnsDirective>
                <ColumnDirective
                  field="isFavorite"
                  headerText=""
                  width="80"
                  template={gridOrderStars}
                />
                <ColumnDirective
                  field="keyword"
                  headerText="Video ideas"
                  headerTemplate={VideoIconTitleTemplate}
                  template={VideoIconTemplate}
                />
                <ColumnDirective
                  field="monthlysearch"
                  headerText="Search Volume on youtube"
                  headerTemplate={VolumeTitleTemplate}
                  template={searchVolumeDataRowTemplate}
                />
                <ColumnDirective
                  field="trend"
                  headerText="Trends"
                  headerTemplate={TrendsTitleTemplate}
                  template={TrendsDataRowTemplate}
                />
                <ColumnDirective
                  field="difficulty"
                  headerText="Keyword Difficulty"
                  headerTemplate={keywordDiffTitleTemplate}
                  template={keywordDiffTemplate}
                />
                <ColumnDirective
                  field="estimated_views"
                  headerText="Potential views on youtube"
                  headerTemplate={PotentialViewsTitleTemplate}
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
          </div>
          {showSavedIdeaCategoryPanel && (
            <IdeasCategoryView
              dataSet={ideasDataSet}
              setShowSavedIdeaCategoryPanel={setShowSavedIdeaCategoryPanel}
            />
          )}
          {/* {showSavedIdeaCategoryPanel && IdeaCategoryPanel()} */}
        </div>
      </div>
      {showInsights && (
        <Insights
          dataSet={ideasDataSet}
          setShowInsights={setShowInsights}
          setShowCompetition={setShowCompetition}
          showCompetition={showCompetition}
        />
      )}
      {showCompetition && (
        <Competition
          dataSet={ideasDataSet}
          setShowInsights={setShowInsights}
          setShowCompetition={setShowCompetition}
        />
      )}
    </section>
  );
};

export default Ideation;
