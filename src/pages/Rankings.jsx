/* eslint-disable */
import React, { useEffect, useState } from "react";
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
import { HiOutlineChevronDown, HiSearch } from "react-icons/hi";
import { Header } from "../components";
import { HiOutlineRefresh } from "react-icons/hi";
import {
  useUserYoutubeInfo,
  useKeywordStore,
  useSavedIdeasData,
  useUserChannelKeywords,
  useDisplayPreviewKeyword,
} from "../state/state";
import {
  AiOutlineStar,
  AiFillStar,
  AiOutlineArrowUp,
  AiOutlineArrowDown,
  AiOutlineArrowRight,
} from "react-icons/ai";
import {
  FaYoutube,
  FaGoogle,
  FaPlus,
  FaVideo,
  FaDownload,
} from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { BiSearch, BiWorld, BiStar, BiLoaderCircle } from "react-icons/bi";
import { IoWarningOutline } from "react-icons/io5";
import { userFullDataDecrypted } from "../data/api/calls";
import showToast from "../utils/toastUtils";
import { useStateContext } from "../contexts/ContextProvider";
import PreviewKeyword from "../components/PreviewKeyword";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { MdCancel } from "react-icons/md";
import { BsFillSquareFill } from "react-icons/bs";
import donought from "../data/donought2.png";
import { formatNumberToKMBPlus } from "../data/helper-funtions/helper";
import Loader from "../components/Loader";

const Keyword2 = () => {
  const decryptedFullData = userFullDataDecrypted();
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
  // const displayPreviewKeyword = useDisplayPreviewKeyword(
  //   (state) => state.displayPreviewKeyword,
  // );
  // const setDisplayPreviewKeyword = useDisplayPreviewKeyword(
  //   (state) => state.setDisplayPreviewKeyword,
  // );
  const relatedKeywordData = useKeywordStore(
    (state) => state.relatedKeywordData,
  );
  const setRelatedKeywordData = useKeywordStore(
    (state) => state.setRelatedKeywordData,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(null);
  const [loadedLocalStorage, setLoadedLocalStorage] = useState(false);
  const [displayPreviewKeyword, setDisplayPreviewKeyword] = useState(false);

  const userChannelKeywords = useUserChannelKeywords(
    (state) => state.userChannelKeywords,
  );
  const setUserChannelKeywords = useUserChannelKeywords(
    (state) => state.setUserChannelKeywords,
  );
  const [loadingUserChannelKeyword, setLoadingUserChannelKeyword] =
    useState(false);

  const { handleClick, isClicked } = useStateContext();
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [isShowPreviewKw, setIsShowPreviewKw] = useState(false);
  let unconventionalKeyword = "";
  const [unconventionalKeywordd, setUnconventionalKeywordd] = useState("Holy");
  const [rankedResults, setRankedResults] = useState([]);
  // const [displayPreviewKeyword, setDisplayPreviewKeyword] = useState(false);

  function removeUndefinedOrNull(arr) {
    return arr.filter((item) => item !== undefined && item !== null);
  }

  function splitObjectsBySearchVolume(arrayOfObjects) {
    const sortedArray = arrayOfObjects.sort(
      (a, b) => b.search_volume - a.search_volume,
    );

    const top3 = sortedArray.slice(0, 3);
    const top10 = sortedArray.slice(0, 10);
    const top20 = sortedArray.slice(0, 20);

    return {
      top3,
      top10,
      top20,
    };
  }

  useEffect(() => {
    setLoadingUserChannelKeyword(true);
    console.log("decryptedFullData", decryptedFullData);
    const fetchUserKeywords = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/getUserKeyword`,
          {
            params: {
              email: decryptedFullData.email,
            },
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.REACT_APP_X_API_KEY,
              Authorization: `Bearer ${decryptedFullData.token}`,
            },
          },
        );

        const data = response.data;
        console.log("data", data.data);

        console.log("response", response.data.success === "trueNut");
        if (response.data.success === "trueNut") {
          showToast("error", "No saved Keywords", 2000);
        } else if (response.data.success == true) {
          setUserChannelKeywords(data.data);
          setLoadingUserChannelKeyword(false);
        } else {
          showToast(
            "error",
            "An error occured with fetching your saved keywords",
            2000,
          );
          setLoadingUserChannelKeyword(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("error", "No saved Keywords", 2000);
      }
    };

    fetchUserKeywords(); // Call the async function
  }, []);

  const toggleSave = async (keyword, save) => {
    // fetchSavedIdeasData()

    try {
      const foundObject = relatedKeywordData.find(
        (item) => item.keyword === keyword,
      );

      console.log("savedIdeasData", savedIdeasData);
      console.log("foundObject.monthlysearch", foundObject.monthlysearch);

      if (save) {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/addToSavedIdeas`,
          {
            video_ideas: foundObject.keyword,
            search_volume: foundObject.monthlysearch,
            keyword_diff: foundObject.difficulty,
            potential_views: foundObject.estimated_views,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        // fetchSavedIdeasData()

        console.log("Data saved successfully", foundObject);
      } else {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/getAllSavedIdeas?email=${decryptedFullData.email}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
          // return response.data;
          const data = response.data;
          const findFoundObjectInSaved = data.find(
            (item) => item.video_ideas === foundObject.keyword,
          );

          await axios.delete(
            `${process.env.REACT_APP_API_BASE_URL}/deleteSavedIdea/${findFoundObjectInSaved.id}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
          console.log("Data removed successfully", findFoundObjectInSaved);
        } catch (error) {
          console.error("Error fetching data:", error);
          throw error; // Rethrow the error to handle it in the component if needed
        }
      }
    } catch (error) {
      console.error("Error saving/removing data:", error);
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
          },
        },
      );

      console.log("Data saved successfully");
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
    const keyword = props.keyword;
    // if (!rowData || typeof rowData.isFavorite === 'undefined') {
    //   return null; // Handle cases where rowData is missing or isFavorite is undefined
    // }
    const [isFavorite, setIsFavorite] = useState(false);
    const makeFavorite = () => {
      setIsFavorite(!isFavorite);
      isFavorite ? toggleSave(keyword, false) : toggleSave(keyword, true);
    };

    const starIcon = isFavorite ? <AiFillStar /> : <AiOutlineStar />;

    return <div onClick={makeFavorite}>{starIcon}</div>;
  };

  const formatViews = (props) => {
    const estimatedViews = parseInt(props.search_volume);
    const formatedNumber = formatNumberToKMBPlus(estimatedViews);
    // const formattedViews = estimatedViews.toLocaleString() + "+";
    return (
      <span className="flex items-center justify-start">{formatedNumber}</span>
    );
  };

  const searchVolumeDataRowTemplate = (props) => {
    return (
      <span className="flex items-center justify-center">
        {props.monthlysearch}+
      </span>
    );
  };

  const youtubeGooglePlusIcons = [FaYoutube, FaGoogle, FaPlus];
  const videoIcon = [FaYoutube];

  function IconsWithTitle({ title, icons }) {
    return (
      <div className="flex items-center">
        {title}
        {icons.map((Icon, index) => (
          <span key={index} style={{ marginLeft: "5px", display: "flex" }}>
            <Icon />
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
        />
      </div>
    );
  };

  const VideoIconTitleTemplate = (props) => {
    return (
      <div className="tooltip-container flex items-center justify-center">
        <IconsWithTitle title={props.headerText} icons={videoIcon} />
        <div className="tooltip-text text-black">
          Information about potential views
        </div>
      </div>
    );
  };

  const gridInstance = React.createRef();

  const exportToExcel = () => {
    if (gridInstance.current) {
      gridInstance.current.excelExport();
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleGetIdeasClick = () => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsLoading(true);

    // Make the API call here
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/fetchKeywordStat?keywords=${searchQuery}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      .then((response) => response.data)
      .then((data) => {
        setIsLoading(false);

        // Update the keywordData state with the API response
        setExactKeywordData(data.response.exact_keyword);
        setRelatedKeywordData(data.response.related_keywords);
        localStorage.setItem("lastVideoIdeas", JSON.stringify(data.response));
        setLoadedLocalStorage(false);

        // console.log(keywordData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
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
    const questions = [];

    for (const keywordObj of keywordsArray) {
      if (isQuestion(keywordObj.keyword)) {
        questions.push(keywordObj);
      }
    }

    console.log(questions);
    // return questions;
    setRelatedKeywordData(questions);
  };

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

  const keywordTemplate = (props) => {
    setSelectedKeyword(props.keyword);
    // unconventionalKeyword = props.keyword;

    return (
      <span className="flex items-center justify-start">{props.keyword}</span>
    );
  };

  const previewYoutubeKwSearch = (props) => {
    return (
      <TooltipComponent>
        <div
          className="flex justify-start items-center"
          onClick={() => {
            setUnconventionalKeywordd(props.keyword);
            setDisplayPreviewKeyword(true);
          }}
        >
          <span className="mr-2 cursor-pointer">Preview</span>
          <FaYoutube color="red" />
        </div>
      </TooltipComponent>
    );
  };

  const RankTemplate = (props) => {
    // Array of valid values
    const validValues = [20, 30, 40];

    // Choose a random value from the validValues array
    const randomNumber =
      validValues[Math.floor(Math.random() * validValues.length)];

    return (
      <span className="cursor-pointer underline flex justify-start">
        &gt;{randomNumber}
      </span>
    );
  };

  const RankChangeTemplate = (props) => {
    // Generate a random number between -3 and 3
    const randomNumber = Math.floor(Math.random() * 7) - 3;

    return (
      <span className="cursor-pointer underline flex justify-center">
        {randomNumber} <AiOutlineArrowRight className="ml-1" color="gray" />
      </span>
    );
  };

  const callEM = (props) => {
    console.log("got the props", props);
    setUnconventionalKeywordd(props.keyword);
    setDisplayPreviewKeyword(true);
  };

  const renderPreviewKeyword = (props) => {
    console.log("props", props);
    return <PreviewKeyword keywordd={props.keyword} />;
  };

  const showPreviewKeyword = (props) => {
    setDisplayPreviewKeyword(true);

    console.log("/////////////////////////", props);
    showToast("warning", "/////////////////////////", 2000);
    setUnconventionalKeywordd(props.keyword);
    renderPreviewKeyword(props);
    unconventionalKeyword = props.keyword;
    setIsShowPreviewKw(!isShowPreviewKw);
    handleClick("previewKw");
    console.log("unconventionalKeywordd", unconventionalKeywordd);
    console.log("unconventionalKeyword", unconventionalKeyword);
  };

  const isSearchEmpty = searchQuery.trim() === "";

  const getOneMonthDateRange = () => {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const fromDate = oneMonthAgo.getDate();
    const fromMonth = oneMonthAgo.toLocaleString("default", { month: "short" });
    const fromYear = oneMonthAgo.getFullYear();

    const toDate = today.getDate();
    const toMonth = today.toLocaleString("default", { month: "short" });
    const toYear = today.getFullYear();

    return `From ${fromDate} ${fromMonth} - ${toDate} ${toMonth} ${toYear}`;
  };

  const getOneWeekDateRange = () => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const fromDate = oneWeekAgo.getDate();
    const fromMonth = oneWeekAgo.toLocaleString("default", { month: "short" });
    const fromYear = oneWeekAgo.getFullYear();

    const toDate = today.getDate();
    const toMonth = today.toLocaleString("default", { month: "short" });
    const toYear = today.getFullYear();

    return `From ${fromDate} ${fromMonth} - ${toDate} ${toMonth} ${toYear}`;
  };

  const dateRange = getOneWeekDateRange();

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      {isLoading ? (
        <div className="loading-container">
          <Loader />
        </div>
      ) : (
        <div className=""></div>
      )}
      <div>
        <div className="flex items-center justify-start">
          <div className="flex items-center">
            <div
              className="flex mt-10 rounded-md"
              style={{ border: "solid 1px #9999FF" }}
            >
              <NavLink
                className="mr-3 pb-3 px-7 cursor-pointer rounded-tl-sm rounded-bl-sm rounded-br-md rounded-tr-md m-auto pt-2"
                style={{
                  border: "#9999FF 1px solid",
                  color: "white",
                  backgroundColor: "#9999FF",
                }}
                to="/rankings"
              >
                Rankings
              </NavLink>
              <NavLink
                className="mr-3 pb-3 pr-5 cursor-pointer pt-2 rounded-md m-auto"
                to="/keywords"
              >
                Keywords
              </NavLink>
            </div>
          </div>
          <div className="flex items-center mt-10 ml-10">
            <div className="flex justify-between items-center mr-5 pr-5 border-r border-solid border-gray-300">
              <span className="mr-1">Source:</span>{" "}
              <span className="mr-1">
                <FaYoutube style={{ color: "red" }} />
              </span>{" "}
              <span>Youtube</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="mr-1">location:</span>{" "}
              <span className="mr-1">
                <BiWorld style={{ color: "#9999FF" }} />
              </span>{" "}
              <span>Global</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center w-full mt-10">
          {/* <div className="h-30 flex flex-col justify-start items-center rankingStatBoxes border-1 w-1/3 py-20 px-5 mr-8 border-gray-300 rounded">
            <div>Average Position</div>
            <div className="text-gray-500 text-xs">{dateRange}</div>
            <div>n/a</div>
            <div className="w-full bg-gray-300 h-5 mt-3">
              <input
              type="range"
              min="0"
              max="100"
              step="1"
              className="w-full bg-gray-300"
            />
            </div>
          </div> */}
          {/* <div className="h-64 flex flex-col justify-start items-center rankingStatBoxes border-1 w-full  py-8 mr-8 border-gray-300 rounded">
            <div>Keyword Distribution</div>
            <div className="flex items-center mt-5">
              <div className="mr-10">
                <img src={donought} alt="" />
              </div>
              <div className="mr-10 text-xs">
                <div className="flex items-center mb-3">
                  <BsFillSquareFill className="mr-2" color="Purple" />
                  <span>Top 3</span>
                </div>
                <div className="flex items-center mb-3">
                  <BsFillSquareFill className="mr-2" color="blue" />
                  <span>Top 10</span>
                </div>
                <div className="flex items-center mb-3">
                  <BsFillSquareFill className="mr-2" color="yellow" />
                  <span>Top 20</span>
                </div>
                <div className="flex items-center mb-3">
                  <BsFillSquareFill className="mr-2" color="gray" />
                  <span>No Rank</span>
                </div>
              </div>
              <div className="text-xs">
                <div className="flex items-center mb-3">
                  <span className="mr-2">{userChannelKeywords && splitObjectsBySearchVolume(userChannelKeywords).top3.length}</span>
                  <AiOutlineArrowRight />
                  <span className="ml-1">0</span>
                </div>
                <div className="flex items-center mb-3">
                  <span className="mr-2">0</span>
                  <AiOutlineArrowRight />
                  <span className="ml-1">0</span>
                </div>
                <div className="flex items-center mb-3">
                  <span className="mr-2">0</span>
                  <AiOutlineArrowRight />
                  <span className="ml-1">0</span>
                </div>
                <div className="flex items-center mb-3">
                  <span className="mr-2">0</span>
                  <AiOutlineArrowRight />
                  <span className="ml-1">0</span>
                </div>
              </div>
            </div>
          </div> */}
        </div>
        <div className="w-full flex mb-5">
          <div className="w-1/2 py-2">
            <div className="flex justify-start items-center">
              <Header title="Keywords" size="text-1xl" />
              <span className="text-xs font-thin italic ml-2 mt-5">
                {userChannelKeywords.length < 1 && (
                  <span className="flex gap-1 justify-start items-center">
                    <IoWarningOutline color="#F49C0E" /> (You haven't added any
                    major keyword for your Channel)
                  </span>
                )}
              </span>
            </div>
            {/* <span className="text-xs">From 18 Aug - 25 Aug 2023</span> */}
          </div>
          <div className="w-1/2 flex justify-end py-2"></div>
        </div>
        {loadingUserChannelKeyword && (
          <Loader message={"Loading your saved Keywords. Hold Tight"} />
        )}
        <br />
        <GridComponent
          dataSource={userChannelKeywords}
          allowExcelExport
          allowPdfExport
          allowPaging
          allowSorting
        >
          <ColumnsDirective>
            <ColumnDirective
              field="keyword"
              headerText="Keywords"
              // template={keywordTemplate}
            />
            <ColumnDirective
              field=""
              headerText="Youtube Results"
              headerTemplate={VideoIconTitleTemplate}
              template={previewYoutubeKwSearch}
            />
            {/* <ColumnDirective
              field=""
              headerText="Rank"
              headerTemplate={VolumeTitleTemplate}
              template={RankTemplate}
            />
            <ColumnDirective field="" headerText="Change" template={RankChangeTemplate}/>
            <ColumnDirective
              field=""
              headerText="Video Result"
              headerTemplate={VideoIconTitleTemplate}
            /> */}
            <ColumnDirective
              field="search_volume"
              headerText="Volume"
              template={formatViews}
            />
            <ColumnDirective
              field="created_at_formatted"
              headerText="Date added"
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
        <Link
          className="flex justify-center items-center w-full mt-3 underline"
          to="/keywords"
        >
          <span>
            {userChannelKeywords.length < 1
              ? "Add to Keywords"
              : "View All Keywords"}
          </span>
        </Link>
        {displayPreviewKeyword && (
          <PreviewKeyword
            keywordd={unconventionalKeywordd}
            setDisplayPreviewKeyword={setDisplayPreviewKeyword}
          />
        )}
      </div>
    </div>
  );
};

export default Keyword2;
