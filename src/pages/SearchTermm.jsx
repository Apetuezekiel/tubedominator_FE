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
import { BiSearch, BiWorld, BiStar } from "react-icons/bi";
import { useUser } from "@clerk/clerk-react";
import { Link, NavLink } from "react-router-dom";
import PreviewKeyword from "../components/PreviewKeyword";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../contexts/ContextProvider";
import showToast from "../utils/toastUtils";
import { userFullDataDecrypted } from "../data/api/calls";

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
  const [selectedKeyword, setSelectedKeyword] = useState("");
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
        console.log("data", response);

        console.log("response", response.data.success === "trueNut");
        if (response.data.success === "trueNut") {
          showToast("error", "No saved Keywords", 2000);
        } else if (response.data.success == true) {
          setUserChannelKeywords(data.data);
        } else {
          showToast(
            "error",
            "An error occured with fetching your saved keywords",
            2000,
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("error", "No saved Keywords", 2000);
      }
    };

    fetchUserKeywords(); // Call the async function
  }, [saveSuccess]);

  const editing = { allowDeleting: true, allowEditing: true };
  const showPreviewKeyword = () => {
    setIsShowPreviewKw(!isShowPreviewKw);
    handleClick("previewKw");
  };
  const previewYoutubeKwSearch = (props) => {
    return (
      <TooltipComponent>
        <div
          className="flex justify-center items-center"
          onClick={showPreviewKeyword}
        >
          <span className="mr-2 cursor-pointer">Preview</span>
          <FaYoutube />
        </div>
      </TooltipComponent>
    );
  };

  const formatViews = (props) => {
    const estimatedViews = parseInt(props.search_volume);
    // const formattedViews = estimatedViews.toLocaleString() + "+";
    return (
      <span className="flex items-center justify-center">
        {estimatedViews}+
      </span>
    );
  };

  const keywordTemplate = (props) => {
    setSelectedKeyword(props.keyword);
    return (
      <span className="flex items-center justify-center">{props.keyword}</span>
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
    console.log("decryptedFullData", decryptedFullData);
    if (userKeyword === "") {
      console.log("Keyword is empty. Please provide a keyword."); // You can replace this with a toast message
      showToast("error", "Keyword is empty. Please provide a keyword.", 2000);
      return;
    }
    showToast("success", `userKeyword ${userKeyword}`, 2000);
    console.log("userKeyword", userKeyword);

    setIsAddKeyword(false);

    try {
      const fetchKeywordResponse = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/fetchKeywordStat?keyword=${userKeyword}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            Authorization: `Bearer ${decryptedFullData.token}`,
          },
        },
      );

      const searchData = fetchKeywordResponse.data;
      if (searchData) {
        const saveKeywordResponse = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/saveUserKeyword`,
          {
            keyword: userKeyword,
            email: decryptedFullData.email,
            user_id: decryptedFullData.user_id,
            search_volume: searchData.response.exact_keyword[0].monthlysearch,
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
        if (saveKeywordResponse.data.success) {
          setSaveSuccess(true);
        }
      } else {
        console.error("Error occured");
        showToast(
          "error",
          "could not add keyword. Please try again. Dont refresh so information isn't lost",
          5000,
        );
      }
    } catch (error) {
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

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      {isShowPreviewKw && isClicked.previewKw && (
        <PreviewKeyword keyword={selectedKeyword} />
      )}
      {isLoading ? (
        <div className="loading-container">
          <Spinner />
        </div>
      ) : (
        <div className=""></div>
      )}
      <div>
        <div className="flex items-center mb-5 w-full border-b border-solid border-gray-300">
          <NavLink to="/rankings">
            <div className="flex justify-between items-center mr-5 pr-5">
              Rankings
            </div>
          </NavLink>
          <NavLink to="/keywords">
            <div className="flex justify-between items-center selectedMenuKwPg">
              Keywords
            </div>
          </NavLink>
        </div>
        <div className="flex items-center mb-5">
          <div className="flex justify-between items-center mr-5 pr-5 border-r border-solid border-gray-300">
            <span className="mr-2">Source:</span>{" "}
            <span className="mr-2">
              <FaYoutube style={{ color: "red" }} />
            </span>{" "}
            <span>Youtube</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="mr-2">location:</span>{" "}
            <span className="mr-2">
              <BiWorld style={{ color: "blue" }} />
            </span>{" "}
            <span>Global</span>
          </div>
        </div>
        <div className="w-full flex">
          <div className="w-1/2 py-2">
            <Header title="Keywords" size="text-1xl" />
            <span className="text-xs">From 18 Aug - 25 Aug 2023</span>
          </div>
          <div className="w-1/2 flex justify-end py-2">
            <div>
              <div className="flex justify-start items-center">
                <div
                  className="text-white rounded-full border border-gray-300 px-4 py-2 flex items-center mr-4 cursor-pointer"
                  style={{ backgroundColor: "#7352FF" }}
                  onClick={addUserKeyword}
                >
                  <span className="mr-2 text-xs flex justify-between items-center">
                    {" "}
                    <FaPlus /> <span className="ml-2">ADD KEYWORDS</span>
                  </span>
                </div>
                <div className="bg-white rounded-full border border-gray-300 px-4 py-2 flex items-center mr-4">
                  <span className="mr-2 text-xs flex justify-between items-center">
                    <FaDownload />
                    <span className="ml-2">Export</span>
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
                    style={{ backgroundColor: "#7352FF" }}
                    className="w-full text-white p-2 rounded mt-2"
                  >
                    Add Keyword
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <GridComponent
          // id="gridcomp"
          dataSource={userChannelKeywords}
          allowExcelExport
          allowPdfExport
          allowPaging
          allowSorting
          // selectionSettings={{ type: "Multiple" }}
          // toolbar={["Delete"]}
          // contextMenuItems={contextMenuItems}
          // editSettings={editing}
          // rowSelected={handleRowSelected}
          toolbar={toolbarOptions}
          editSettings={editSettings}
          selectionSettings={settings}
          filterSettings={filterOptions}
        >
          <ColumnsDirective>
            <ColumnDirective type="checkbox" width="50" />
            <ColumnDirective
              field="keyword"
              headerText="Keywords"
              template={keywordTemplate}
            />
            <ColumnDirective
              field=""
              headerText="Youtube Results"
              headerTemplate={VideoIconTitleTemplate}
              template={previewYoutubeKwSearch}
            />
            <ColumnDirective
              field=""
              headerText="Rank"
              headerTemplate={VolumeTitleTemplate}
              // template={searchVolumeDataRowTemplate}
            />
            <ColumnDirective field="" headerText="Change" />
            <ColumnDirective
              field=""
              headerText="Video Result"
              headerTemplate={VideoIconTitleTemplate}
              // template={formatViews}
            />
            <ColumnDirective
              field="search_volume"
              headerText="Volume"
              template={formatViews}
            />
            <ColumnDirective
              field="created_at_formatted"
              headerText="Date added"
              // template={formatViews}
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
    </div>
  );
};

export default Keyword2;
