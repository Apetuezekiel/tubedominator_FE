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
import { getSavedIdeas, userFullDataDecrypted } from "../data/api/calls";
import { BiLoaderCircle } from "react-icons/bi";
import { FiTrendingUp } from "react-icons/fi";
import { BsArrowDownShort, BsArrowUpShort, BsDot } from "react-icons/bs";
import { formatNumberToKMBPlus } from "../data/helper-funtions/helper";
import IdeasCategoryDelete from "../components/IdeasCategoryDelete";
import Loader from "../components/Loader";
import CubeLoader from "../components/CubeLoader";
import Insights from "./keywords/Insights";
import Competition from "./keywords/Competition";
import { IoFolderOpenOutline } from "react-icons/io5";
import { MdMoreHoriz } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import TDLogo from "../assets/images/TubeDominator 500x500.png";

const SavedIdeas = () => {
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
  const [loadingSavedIdeas, setLoadingSavedIdeas] = useState(false);
  const navigate = useNavigate();

  const handleMoreClick = (item) => {
    // Navigate to /saved-ideas and pass the value of 'item'
    navigate("/saved-ideas", { state: { customData: item } });
  };

  useEffect(() => {
    setLoadingSavedIdeas(true);
    setFetchedSavedIdeas(true);
    const fetchSavedIdeas = async () => {
      try {
        const userSavedIdeas = await getSavedIdeas();
        console.log("userSavedIdeas", userSavedIdeas);
        setSavedIdeasData(userSavedIdeas);
        setFilterableSavedIdeasData(userSavedIdeas);
        setFetchedSavedIdeas(false);
        // Create a Set to store unique categories
        const uniqueCategories = new Set();

        userSavedIdeas?.forEach((item) => {
          uniqueCategories.add(item.category);
        });

        // Convert the Set back to an array (if needed)
        const uniqueCategoriesArray = Array.from(uniqueCategories);

        // Set the unique categories in the state
        setCategories(uniqueCategoriesArray);
        console.log("uniqueCategoriesArray", uniqueCategoriesArray);
        setLoadingSavedIdeas(false);
        console.log("uniqueCategoriesArrayyyyyyyyyyy", uniqueCategoriesArray);
      } catch (error) {
        setLoadingSavedIdeas(false);
        setFetchedSavedIdeas(false);
        console.error("Error fetching saved ideas:", error);
      }
    };

    fetchSavedIdeas();
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
      const originalData = JSON.parse(localStorage.getItem("savedIdeasData"));
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

  const editing = { allowDeleting: true, allowEditing: true };

  return (
    <section>
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 min-h-screen ${
          (showInsights || showCompetition) && "hidden"
        }`}
      >
        <div className="w-full flex">
          <div className="w-1/2 flex py-2">
            <div className="">
              <div className="pageTitle text-3xl font-semibold">
                Saved Ideas
              </div>
              <div className="tag text-md mt-2 text-xs font-thin">
                Find here all your video ideas and briefings
              </div>
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
            {/* <div className="w-full max-w-xs flex items-center p-2 pl-4 pr-4 border border-gray-300 bg-white rounded-full">
              <input
                type="text"
                placeholder="Enter a topic, brand, or product"
                className="flex-grow bg-transparent outline-none pr-2 text-xs"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <HiSearch className="text-gray-500 text-xs" />
            </div> */}
          </div>
        </div>
        <div>
          <br />
          <div className="rounded-md bg-white p-5">
            <Header title={`Folders`} size="text-1xl" mt={0} />
            {loadingSavedIdeas ? (
              <div>
                <Loader message={"Loading your Saved Ideas. Hang on"} />
              </div>
            ) : categories.length > 0 ? (
              <div className="flex flex-wrap -mx-2">
                <div
                  className="m-2 flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => handleMoreClick("all")}
                >
                  <div
                    className="rounded-md p-2 w-40"
                    style={{ backgroundColor: "#EAEAF5" }}
                  >
                    <div className="flex items-center justify-end">
                      <span className="py-1 px-1 rounded-full bg-white flex items-center justify-center cursor-pointer">
                        <MdMoreHoriz color="black" className="m-auto" />
                      </span>
                    </div>
                    <div className="w-full text-center">
                      <div className="flex folder-container items-center justify-center">
                        <IoFolderOpenOutline
                          color="#C8C8DD"
                          size={48}
                          className="folder-container mt-5 mb-5"
                        />
                      </div>
                    </div>
                    <div className="py-1 text-xs font-bold">{"All"}</div>
                    {/* <div className="text-xs">{"Date created"}</div> */}
                  </div>
                </div>
                {categories.map((item, index) => (
                  <div
                    key={index}
                    className="m-2 flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => handleMoreClick(item)}
                  >
                    <div
                      className="rounded-md p-2 w-40"
                      style={{ backgroundColor: "#EAEAF5" }}
                    >
                      <div className="flex items-center justify-end">
                        <span className="folder-container py-1 px-1 rounded-full bg-white flex items-center justify-center cursor-pointer">
                          <MdMoreHoriz color="black" className="m-auto" />
                        </span>
                      </div>
                      <div className="w-full text-center">
                        <div className="flex items-center justify-center">
                          <IoFolderOpenOutline
                            color="#C8C8DD"
                            size={48}
                            className="mt-5 mb-5"
                          />
                        </div>
                      </div>
                      <div className="py-1 text-xs font-bold">{item}</div>
                      {/* <div className="text-xs">{"Date created"}</div> */}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-2 justify-center items-center mb-20">
                <img src={TDLogo} alt="" className="h-10" />
                <span>You do not have any saved Ideas</span>
              </div>
            )}
          </div>
        </div>
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
