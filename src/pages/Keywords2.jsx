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
} from "../state/state";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import {
  FaYoutube,
  FaGoogle,
  FaPlus,
  FaVideo,
  FaDownload,
} from "react-icons/fa";
import Spinner from "../components/Spinner";
import { BiSearch, BiWorld, BiStar, BiLoaderCircle } from "react-icons/bi";
import { useUser } from "@clerk/clerk-react";
import { Link, NavLink } from "react-router-dom";
import PreviewKeyword from "../components/PreviewKeyword";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../contexts/ContextProvider";
import showToast from "../utils/toastUtils";
import { userFullDataDecrypted } from "../data/api/calls";
import { TiDelete } from "react-icons/ti";
import { formatNumberToKMBPlus } from "../data/helper-funtions/helper";
import { MdCancel } from "react-icons/md";
import Loader from "../components/Loader";
import exportIcon from "../data/icons/export.png";
// import deleteChannelKeyword from "../data/api/calls";

const Keyword2 = () => {
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
  const userChannelKeywords = useUserChannelKeywords(
    (state) => state.userChannelKeywords,
  );
  const setUserChannelKeywords = useUserChannelKeywords(
    (state) => state.setUserChannelKeywords,
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
  const [userKeyword, setUserKeyword] = useState("");
  const [isAddKeyword, setIsAddKeyword] = useState(false);
  const [isShowPreviewKw, setIsShowPreviewKw] = useState(false);
  const [processingDeleteKeyword, setProcessingDeleteKeyword] = useState(false);
  const [addingKeyword, setAddingKeyword] = useState(false);
  const [loadingUserChannelKeyword, setLoadingUserChannelKeyword] =
    useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [unconventionalKeywordd, setUnconventionalKeywordd] = useState("");
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();
  function removeUndefinedOrNull(arr) {
    return arr.filter((item) => item !== undefined && item !== null);
  }
  const decryptedFullData = userFullDataDecrypted();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const toolbarOptions = [
    "Add",
    "Edit",
    "Delete",
    "Update",
    "Cancel",
    "Search",
  ];
  const filterOptions = { type: "CheckBox" };
  const editSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: "Normal",
  };
  const settings = { persistSelection: true };
  let unconventionalKeyword = "God";
  const [displayPreviewKeyword, setDisplayPreviewKeyword] = useState(false);

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
            `${process.env.REACT_APP_API_BASE_URL}/getAllSavedIdeas`,
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

  function Example2() {
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded || !isSignedIn) {
      console.log("NOT SIGNED IN");
      return null;
    }
    console.log("SIGNED IN", user);

    return <div>Hello, {user} welcome to Clerk</div>;
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
        console.log("keyword data", response);

        console.log("response", response.data.success === "trueNut");
        if (response.data.success === "trueNut") {
          showToast("error", "No saved Keywords", 2000);
          setLoadingUserChannelKeyword(false);
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
  }, [saveSuccess]);

  const formatViews = (props) => {
    const estimatedViews = parseInt(props.search_volume);
    const formatedNumber = formatNumberToKMBPlus(estimatedViews);

    // const formattedViews = estimatedViews.toLocaleString() + "+";
    return <span className="">{formatedNumber}</span>;
  };

  const actionTemplate = (props) => {
    return (
      <span
        className="text-center flex justify-center cursor-pointer"
        onClick={() => deleteChannelKeyword(props)}
      >
        <MdCancel color="red" />{" "}
        <div>
          {processingDeleteKeyword && (
            <BiLoaderCircle
              color="#7438FF"
              size={30}
              className="animate-spin ml-2"
            />
          )}
        </div>
      </span>
    );
  };

  const actionTitleTemplate = (props) => {
    return (
      <div className="flex items-center justify-center">
        <div>
          {processingDeleteKeyword && (
            <BiLoaderCircle color="red" size={20} className="animate-spin" />
          )}
        </div>
      </div>
    );
  };

  const deleteChannelKeyword = async (props) => {
    setProcessingDeleteKeyword(true);

    try {
      const headers = {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_X_API_KEY,
        Authorization: `Bearer ${decryptedFullData.token}`,
      };

      const responseDelete = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/deleteUserKeyword/${props.id}`,
        { headers },
      );

      if (responseDelete.data.success) {
        console.log("responseDelete.data", responseDelete.data.data);
        setProcessingDeleteKeyword(false);
        setUserChannelKeywords(responseDelete.data.data);
        showToast("success", "Keyword removed from saved keywords", 2000);
        console.log("Data removed successfully", props.keyword);
      } else {
        showToast("error", "Saved keyword wasn't removed. Try again", 2000);
        setProcessingDeleteKeyword(false);
      }
    } catch (error) {
      setProcessingDeleteKeyword(false);
      console.error("Error deleting keyword:", error);
      throw error;
    }
  };

  const recordCtrlTemplate = (props) => {
    return (
      <span className="flex items-center justify-center">
        <TiDelete color="#7352FF" onClick={() => deleteChannelKeyword(props)} />
      </span>
    );
  };

  const keywordTemplate = (props) => {
    setUnconventionalKeywordd(props.keyword);
    unconventionalKeyword = props.keyword;
    console.log("setSelectedKeyword(props.keyword)", props.keyword);
    // console.log("selectedKeyword", selectedKeyword);
    return (
      // <span className="flex items-center justify-start">{props.keyword}</span>
      <span className="flex items-center justify-start">
        <TiDelete
          color="#7352FF"
          onClick={() => deleteChannelKeyword(props)}
          size={20}
        />{" "}
        <span className="ml-3">{props.keyword}</span>
      </span>
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

  const handleChange = (e) => {
    setUserKeyword(e.target.value);
  };

  const submitUserKeyword = async () => {
    setAddingKeyword(true);
    console.log("decryptedFullData", decryptedFullData);
    if (userKeyword === "") {
      console.log("Keyword is empty. Please provide a keyword.");
      showToast("error", "Keyword is empty. Please provide a keyword.", 2000);
      setAddingKeyword(false);
      return;
    }
    console.log("userKeyword", userKeyword);

    const postData = {
      keyword: userKeyword,
      countryCode: "GLB",
      languageCode: "en",
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/fetchKeywordStat`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            Authorization: `Bearer ${decryptedFullData.token}`,
          },
        },
      );

      const data = response.data;
      console.log("response.data", data);

      const searchVolume = data.response.exact_keyword[0].monthlysearch;
      if (searchVolume) {
        const saveKeywordResponse = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/saveUserKeyword`,
          {
            keyword: userKeyword,
            email: decryptedFullData.email,
            user_id: decryptedFullData.user_id,
            search_volume: searchVolume,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.REACT_APP_X_API_KEY,
              Authorization: `Bearer ${decryptedFullData.token}`,
            },
          },
        );

        console.log("API response:", saveKeywordResponse.data);
        console.log(saveKeywordResponse.data);
        if (saveKeywordResponse.data.success) {
          setAddingKeyword(false);
          setSaveSuccess(true);
          setIsAddKeyword(false);
          showToast("success", "Keyword Added Successfully", 2000);
        }
      } else {
        setAddingKeyword(true);
        console.error("Error occured");
        showToast(
          "error",
          "could not add keyword. Please try again. Dont refresh so information isn't lost",
          5000,
        );
      }
    } catch (error) {
      setAddingKeyword(true);
      console.error("Error while making API call:", error);
      showToast(
        "error",
        "could not add keyword. Please try again. Dont refresh so information isn't lost",
        5000,
      );
    }

    setUserKeyword(""); // Clear the userKeyword after successful submission
  };

  const addUserKeyword = () => {
    setIsAddKeyword(true);
  };

  const isSearchEmpty = searchQuery.trim() === "";

  const showPreviewKeyword = (keyword) => {
    unconventionalKeyword = keyword;
    setUnconventionalKeywordd(keyword);
    showToast("success", unconventionalKeywordd, 2000);
    setIsShowPreviewKw(!isShowPreviewKw);
    handleClick("previewKw");
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

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 min-h-screen">
      {isLoading ? (
        <div className="loading-container">
          <Spinner />
        </div>
      ) : (
        <div className=""></div>
      )}
      <div>
        <div className="">
          <div className="pageTitle text-3xl font-semibold">Keywords</div>
          <div className="tag text-md mt-2 text-xs font-thin">
            Set up and manage your channel keywords
          </div>
        </div>
        <div className="flex items-center justify-start">
          <div className="w-1/2 flex items-center justify-start">
            <div className="flex items-center">
              {/* <div
              className="flex mt-10 rounded-md"
              style={{ border: "solid 1px #9999FF" }}
            >
              <NavLink
                className="mr-3 pb-3 px-3 cursor-pointer rounded-md m-auto pt-2"
                to="/rankings"
              >
                Rankings
              </NavLink>
              <NavLink
                className="pb-3 px-7 pr-5 cursor-pointer pt-2 rounded-tl-md rounded-bl-md rounded-br-sm rounded-tr-sm m-auto"
                to="/keywords"
                style={{
                  border: "#9999FF 1px solid",
                  color: "white",
                  backgroundColor: "#9999FF",
                }}
              >
                Keywords
              </NavLink>
            </div> */}
            </div>
            <div className="flex items-center mt-10">
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

          <div className="w-1/2 flex justify-end py-2">
            <div>
              <div className="flex justify-start items-center">
                <div
                  className="text-white rounded-full border border-gray-300 px-4 py-2 flex items-center mr-4 cursor-pointer"
                  style={{
                    border: "0.5px solid #9999FF",
                  }}
                  onClick={addUserKeyword}
                >
                  <span className="mr-2 text-xs flex justify-between items-center">
                    {" "}
                    <FaPlus color="#9999FF" />{" "}
                    <span className="ml-2" style={{ color: "#9999FF" }}>
                      Add Keyword
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    background:
                      "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                  }}
                  className="rounded-full border border-gray-300 px-4 py-2 flex items-center mr-4"
                >
                  <span className="mr-2 text-xs flex justify-between items-center">
                    <img src={exportIcon} alt="" className="h-4" />
                    <span className="ml-2 text-white">Export</span>
                  </span>
                </div>
              </div>
              {isAddKeyword ? (
                <div>
                  <input
                    type="text"
                    id="keywords"
                    name="keywords"
                    value={userKeyword}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded-full w-full mr-2"
                    placeholder="keywords your channel focuses on"
                  />
                  <button
                    onClick={submitUserKeyword}
                    style={{
                      border: "0.5px solid #9999FF",
                      background:
                        "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                    }}
                    className="w-full text-white p-2 rounded mt-2 flex justify-center items-center"
                  >
                    Add Keyword{" "}
                    {addingKeyword && (
                      <BiLoaderCircle
                        color="white"
                        size={20}
                        className="animate-spin ml-2"
                      />
                    )}
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>

        <div className="rounded-md bg-white px-5 pb-5 mt-10">
          <div className="w-full flex">
            <div className="w-1/2">
              <Header title="Keywords" size="text-1xl" />
              <span className="text-xs">From 18 Aug - 25 Aug 2023</span>
            </div>
            <div className="w-1/2 flex justify-end py-2"></div>
          </div>
          {loadingUserChannelKeyword && (
            <Loader
              message={"Loading your saved Keywords. Hold Tight"}
              marginBottom={20}
            />
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
                field=""
                headerText="#"
                template={actionTemplate}
                width={100}
                headerTemplate={actionTitleTemplate}
              />
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
              />
              <ColumnDirective field="" headerText="Change" />
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
        </div>
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
