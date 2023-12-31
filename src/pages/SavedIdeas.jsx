/* eslint-disable */

import React from "react";
import { useState, useEffect } from "react";

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
import {
  HiOutlineRefresh,
  HiOutlineTrendingDown,
  HiOutlineTrendingUp,
} from "react-icons/hi";

import { HiOutlineChevronDown, HiSearch } from "react-icons/hi";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { Header } from "../components";
import axios from "axios";
import {
  useUserYoutubeInfo,
  useKeywordStore,
  useSavedIdeasData,
} from "../state/state";
import { FaYoutube, FaGoogle, FaPlus, FaVideo, FaHeart } from "react-icons/fa";
import CryptoJS from "crypto-js";
import showToast from "../utils/toastUtils";
import {
  getCategorySavedIdeas,
  getSavedIdeas,
  userFullDataDecrypted,
} from "../data/api/calls";
import { BiArrowBack, BiLoaderCircle } from "react-icons/bi";
import { FiTrendingUp } from "react-icons/fi";
import { BsArrowDownShort, BsArrowUpShort, BsDot } from "react-icons/bs";
import { formatNumberToKMBPlus } from "../data/helper-funtions/helper";
import IdeasCategoryDelete from "../components/IdeasCategoryDelete";
import Loader from "../components/Loader";
import CubeLoader from "../components/CubeLoader";
import Insights from "./keywords/Insights";
import Competition from "./keywords/Competition";
import { useLocation, useNavigate } from "react-router-dom";

const SavedIdeas = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const customData = location.state?.customData;
  if (!customData) {
    navigate("/saved-ideas-cat");
  }
  console.log("customDatacustomDatacustomDatacustomDatacustomData", customData);

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
  // const [savedIdeasData, setSavedIdeasData] = useState([]);
  // const {
  //   savedIdeasData,
  //   setSavedIdeasData,
  // } = useSavedIdeasData();
  const savedIdeasData = useSavedIdeasData((state) => state.savedIdeasData);
  const setSavedIdeasData = useSavedIdeasData(
    (state) => state.setSavedIdeasData,
  );
  const [filterableSavedIdeasData, setFilterableSavedIdeasData] = useState({});

  const [favorites, setFavorites] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedSavedIdeas, setFetchedSavedIdeas] = useState("");
  const [processingDeleteSavedIdea, setProcessingDeleteSavedIdea] =
    useState(false);
  const [filteredData, setFilteredData] = useState(savedIdeasData);
  const userEncryptedData = localStorage.getItem("encryptedFullData");
  // const decryptedFullData = userFullDataDecrypted();
  const relatedKeywordData = useKeywordStore(
    (state) => state.relatedKeywordData,
  );
  const setRelatedKeywordData = useKeywordStore(
    (state) => state.setRelatedKeywordData,
  );
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showSavedIdeaCategoryPanel, setShowSavedIdeaCategoryPanel] =
    useState(false);
  const [ideasDataSet, setIdeasDataSet] = useState(false);
  const [updatedSavedIdea, setUpdatedSavedIdea] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showCompetition, setShowCompetition] = useState(false);

  useEffect(() => {
    setFetchedSavedIdeas(true);
    const fetchSavedIdeas = async () => {
      try {
        const userSavedIdeas = await getCategorySavedIdeas(customData);
        console.log("userSavedIdeas", userSavedIdeas);
        setSavedIdeasData(userSavedIdeas);
        setFilterableSavedIdeasData(userSavedIdeas);
        setFetchedSavedIdeas(false);
        // Create a Set to store unique categories
        const uniqueCategories = new Set();

        // Process the fetched data and add categories to the Set
        // userSavedIdeas.forEach((item) => {
        //   // Check if item.category is null or undefined
        //   if (item.category === null || item.category === undefined) {
        //     uniqueCategories.add("Uncategorized Ideas");
        //   } else {
        //     uniqueCategories.add(item.category);
        //   }
        // });
        userSavedIdeas.forEach((item) => {
          uniqueCategories.add(item.category);
        });

        // Convert the Set back to an array (if needed)
        const uniqueCategoriesArray = Array.from(uniqueCategories);

        // Set the unique categories in the state
        setCategories(uniqueCategoriesArray);
        console.log("uniqueCategoriesArrayyyyyyyyyyy", uniqueCategoriesArray);
      } catch (error) {
        setFetchedSavedIdeas(false);
        console.error("Error fetching saved ideas:", error);
      }
    };

    fetchSavedIdeas();
  }, [updatedSavedIdea]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userSavedIdeas = await getSavedIdeas();
        console.log("userSavedIdeas from ideas category view", userSavedIdeas);
        const uniqueCategories = new Set();
        userSavedIdeas.forEach((item) => {
          uniqueCategories.add(item.category);
        });
        const uniqueCategoriesArray = Array.from(uniqueCategories);
        setCategories(uniqueCategoriesArray);
        setFetchedSavedIdeas(false);
        console.log("categories, categories", categories);
      } catch (error) {
        setFetchedSavedIdeas(false);
        console.error("Error fetching saved ideas:", error);
      }
    };

    fetchData();
  }, [updatedSavedIdea]);

  const handleCategoryChange = (event) => {
    console.log("savedIdeasData from saved Ideas", savedIdeasData);
    const selectedValue = event.target.value;
    setSelectedCategory(selectedValue);

    if (selectedValue === "all") {
      setFilterableSavedIdeasData(savedIdeasData);
    } else {
      const filteredIdeas = savedIdeasData.filter(
        (item) => item.category === selectedValue,
      );
      setFilterableSavedIdeasData(filteredIdeas);
    }
  };

  const contextMenuItems = [
    "AutoFit",
    "AutoFitAll",
    "SortAscending",
    "SortDescending",
    "Copy",
    "Edit",
    "Delete",
    "Save",
    "Cancel",
    "PdfExport",
    "ExcelExport",
  ];
  const isSearchEmpty = searchQuery.trim() === "";

  const searchFilter = (data, searchString) => {
    const lowerCaseSearch = searchString.toLowerCase();

    if (!lowerCaseSearch) {
      return data; // Return original data if search string is empty
    }

    const filteredData = data.filter((item) => {
      return item.video_ideas.toLowerCase().includes(lowerCaseSearch);
    });

    return filteredData;
  };

  const handleSearchChange = (event) => {
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);

    if (!newSearchQuery) {
      const originalData = JSON.parse(
        localStorage.getItem("savedCatIdeasData"),
      );
      setFilterableSavedIdeasData(originalData);
    } else {
      // Filter the data based on the new search query
      const filteredResults = searchFilter(
        filterableSavedIdeasData,
        newSearchQuery,
      );
      setFilterableSavedIdeasData(filteredResults);
    }
  };

  const handleRowSelected = async (args) => {
    const selectedRowData = args.data;
    try {
      const responseDelete = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/deleteSavedIdea/${selectedRowData.id}`,
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
        showToast("success", "Idea removed from Saved Ideas", 2000);
      } else {
        showToast("error", "Idea wasn't removed. Try again", 2000);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      // console.log('selectedRowData', selectedRowData);
    }
  };

  const editing = { allowDeleting: true, allowEditing: true };

  const keywordDiffTemplate = (props) => {
    return (
      <button
        type="button"
        style={{
          backgroundColor:
            props.keyword_diff === "High"
              ? "#FBDBC8"
              : props.keyword_diff === "Low"
              ? "#D2E7D0"
              : props.keyword_diff === "Medium"
              ? "#FCECBB"
              : "transparent",
          width: "w-1/2",
        }}
        className="py-1 px-2 capitalize rounded-2xl text-md KwDiffButtonSize"
      >
        {props.keyword_diff}
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

  const deleteSavedKeyword = async (id) => {
    setProcessingDeleteSavedIdea(true);
    try {
      const responseDelete = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/deleteSavedIdea/${id}`,
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
      if (responseDelete.data.success) {
        showToast("success", "Idea removed from Saved Ideas", 2000);
        setProcessingDeleteSavedIdea(false);
        // fetchSavedIdeasData();
      } else {
        showToast("error", "Idea wasn't removed. Try again", 2000);
        setProcessingDeleteSavedIdea(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setProcessingDeleteSavedIdea(false);
      throw error; // Rethrow the error to handle it in the component if needed
    }
  };

  const gridOrderStars = (props) => {
    const id = props.id;
    // if (!rowData || typeof rowData.isFavorite === 'undefined') {
    //   return null; // Handle cases where rowData is missing or isFavorite is undefined
    // }
    const [isFavorite, setIsFavorite] = useState(false);
    const makeFavorite = () => {
      setIsFavorite((prevIsFavorite) => !prevIsFavorite);
      deleteSavedKeyword(id);
    };

    const starIcon = isFavorite ? (
      <AiFillStar color="#7352FF" size={15} />
    ) : (
      <BiLoaderCircle className="animate-spin" color="#7352FF" size={15} />
    );

    return (
      <div
        onClick={() => {
          setShowSavedIdeaCategoryPanel(true);
          setIdeasDataSet(props);
        }}
        className="cursor-pointer"
      >
        {<FaHeart color="#7352FF" size={15} />}
      </div>
    );
  };

  const formatViews = (props) => {
    const estimatedViews = parseInt(props.potential_views);
    const formattedViews = formatNumberToKMBPlus(estimatedViews);
    // const formattedViews = estimatedViews.toLocaleString() + "+";
    return <span>{formattedViews}</span>;
  };

  const searchVolumeFormat = (props) => {
    const estimatedViews = parseInt(props.search_volume);
    const formattedViews = formatNumberToKMBPlus(estimatedViews);
    return <span>{formattedViews}</span>;
  };

  const actionTitleTemplate = (props) => {
    return (
      <div className="flex items-center justify-center">
        <div>
          {processingDeleteSavedIdea && (
            <BiLoaderCircle color="red" size={15} className="animate-spin" />
          )}
        </div>
      </div>
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
      <div>
        <IconsWithTitle
          title={props.headerText}
          icons={youtubeGooglePlusIcons}
        />
      </div>
    );
  };

  const VideoIconTitleTemplate = (props) => {
    return (
      <div className="tooltip-container">
        <IconsWithTitle title={props.headerText} icons={videoIcon} />
        <div className="tooltip-text text-black">
          Information about potential views
        </div>
      </div>
    );
  };

  const VideoIconTemplate = (props) => {
    return (
      <div
        className="flex flex-col break-words"
        onClick={() => {
          setShowInsights(true);
          setIdeasDataSet(props);
        }}
      >
        <span className="text-md capitalize">{props.video_ideas}</span>
        {/* <span
          className="text-xs text cursor-pointer"
          style={{ color: "#7352FF" }}
        >
          More Insights
        </span> */}
      </div>
    );
  };

  const TrendsTitleTemplate = (props) => {
    const trendIcon = <FiTrendingUp size={15} />;
    return (
      <div className="flex items-center justify-center">
        {props.headerText}
        <div className="ml-2">{trendIcon}</div>
      </div>
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

  return (
    <section>
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10  ${
          (showInsights || showCompetition) && "hidden"
        }`}
      >
        <div className="w-full flex">
          <div className="w-1/2 flex py-2">
            <div className="flex items-center justify-between mb-5">
              <span
                className="mr-3 flex items-center cursor-pointer"
                onClick={() => navigate("/saved-ideas-cat")}
              >
                <BiArrowBack color="#7472C2" className="mr-2" /> Back to list
              </span>
            </div>
          </div>
          <div className="w-1/2 flex justify-end py-2">
            {/* <div className="flex justify-start items-center">
              <div className="bg-white rounded-full border border-gray-300 px-4 py-2 flex items-center mr-4">
                <select
                  className="rounded-full w-full py-2 pl-4 pr-8 border"
                  style={{ border: "1px solid transparent" }}
                  value={selectedCategory && selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="all">All saved Ideas</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category} className="text-black">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div> */}
            <div className="w-full max-w-xs flex items-center p-2 pl-4 pr-4 border border-gray-300 bg-white rounded-full">
              <input
                type="text"
                placeholder="Enter a topic, brand, or product"
                className="flex-grow bg-transparent outline-none pr-2 text-xs"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <HiSearch className="text-gray-500 text-xs" />
            </div>
          </div>
        </div>
        {!filterableSavedIdeasData ? (
          <Loader marginTop={10} />
        ) : (
          <div>
            {fetchedSavedIdeas && (
              <div>
                <Loader message={"Loading your Saved Ideas. Hang on"} />
              </div>
            )}
            <br />
            <div className="rounded-md bg-white p-5">
              <Header title={`${customData}`} size="text-1xl" />
              <GridComponent
                dataSource={filterableSavedIdeasData}
                allowExcelExport
                allowPdfExport
                allowPaging
                allowSorting
                style={{ borderRadius: "10px" }}
              >
                <ColumnsDirective>
                  <ColumnDirective
                    field="isFavorite"
                    headerText=""
                    width="80"
                    template={gridOrderStars}
                    tooltip="Hover over for more information"
                    headerTemplate={actionTitleTemplate}
                  />
                  <ColumnDirective
                    field="video_ideas"
                    headerText="Video ideas"
                    headerTemplate={VideoIconTitleTemplate}
                    tooltip="Hover over for more information"
                    template={VideoIconTemplate}
                  />
                  <ColumnDirective
                    field="search_volume"
                    headerText="Search Volume on youtube"
                    template={searchVolumeFormat}
                    headerTemplate={VolumeTitleTemplate}
                    tooltip="Hover over for more information"
                  />
                  <ColumnDirective
                    field="trend"
                    headerText="Trends"
                    headerTemplate={TrendsTitleTemplate}
                    template={TrendsDataRowTemplate}
                  />
                  <ColumnDirective
                    field="keyword_diff"
                    headerText="Keyword Difficulty"
                    template={keywordDiffTemplate}
                    tooltip="Hover over for more information"
                  />
                  <ColumnDirective
                    field="potential_views"
                    headerText="Potential views on youtube"
                    headerTemplate={VideoIconTitleTemplate}
                    template={formatViews}
                    tooltip="Hover over for more information"
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
              <IdeasCategoryDelete
                dataSet={ideasDataSet}
                setUpdatedSavedIdea={setUpdatedSavedIdea}
                setShowSavedIdeaCategoryPanel={setShowSavedIdeaCategoryPanel}
              />
            )}
          </div>
        )}
      </div>
      {showInsights && (
        <Insights
          dataSet={ideasDataSet}
          setShowInsights={setShowInsights}
          setShowCompetition={setShowCompetition}
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
export default SavedIdeas;
