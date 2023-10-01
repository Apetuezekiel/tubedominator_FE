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
import { HiOutlineRefresh } from "react-icons/hi";
import Spinner from "../components/Spinner";

import { HiOutlineChevronDown, HiSearch } from "react-icons/hi";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { Header } from "../components";
import axios from "axios";
import {
  useUserYoutubeInfo,
  useKeywordStore,
  useSavedIdeasData,
} from "../state/state";
import { FaYoutube, FaGoogle, FaPlus, FaVideo } from "react-icons/fa";
import CryptoJS from "crypto-js";
import showToast from "../utils/toastUtils";

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
  // const savedIdeasData = useSavedIdeasData((state) => state.savedIdeasData);
  const {
    savedIdeasData,
    setSavedIdeasData,
    isLoading,
    error,
    fetchSavedIdeasData,
  } = useSavedIdeasData();
  // const setSavedIdeasData = useSavedIdeasData(
  //   (state) => state.setUserYoutubeData,
  // );

  const [favorites, setFavorites] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(savedIdeasData);
  const userEncryptedData = localStorage.getItem("encryptedFullData");
  const decryptedFullData = decryptAndRetrieveData(userEncryptedData);
  const relatedKeywordData = useKeywordStore(
    (state) => state.relatedKeywordData,
  );
  const setRelatedKeywordData = useKeywordStore(
    (state) => state.setRelatedKeywordData,
  );

  useEffect(() => {
    fetchSavedIdeasData();
    console.log("savedIdeasData", savedIdeasData);
  }, []);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

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
      setSavedIdeasData(originalData);
    } else {
      // Filter the data based on the new search query
      const filteredResults = searchFilter(savedIdeasData, newSearchQuery);
      setSavedIdeasData(filteredResults);
    }
  };

  const handleRowSelected = async (args) => {
    const selectedRowData = args.data;
    try {
      const responseDelete = await axios.delete(
        `http://localhost:8080/api/deleteSavedIdea/${selectedRowData.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
            Authorization: `Bearer ${decryptedFullData.token}`,
          },
          params: {
            email: decryptedFullData.email,
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

  const deleteSavedKeyword = async (keyword) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/getAllSavedIdeas",
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
            Authorization: `Bearer ${decryptedFullData.token}`,
          },
        },
      );
      // return response.data;
      const data = response.data.data;
      const findFoundObjectInSaved = data.find(
        (item) => item.video_ideas === keyword,
      );

      console.log("to delete response.data 2", keyword, findFoundObjectInSaved);
      console.log("decryptedFullData.email", decryptedFullData.email);

      const responseDelete = await axios.delete(
        `http://localhost:8080/api/deleteSavedIdea/${findFoundObjectInSaved.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
            Authorization: `Bearer ${decryptedFullData.token}`,
          },
          params: {
            email: decryptedFullData.email,
          },
        },
      );
      if (responseDelete.data.success) {
        showToast("success", "Idea removed from Saved Ideas", 2000);
        fetchSavedIdeasData();
      } else {
        showToast("error", "Idea wasn't removed. Try again", 2000);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Rethrow the error to handle it in the component if needed
    }
  };

  const gridOrderStars = (props) => {
    const keyword = props.video_ideas;
    // if (!rowData || typeof rowData.isFavorite === 'undefined') {
    //   return null; // Handle cases where rowData is missing or isFavorite is undefined
    // }
    const [isFavorite, setIsFavorite] = useState(false);
    const makeFavorite = () => {
      deleteSavedKeyword(keyword);
    };

    const starIcon = isFavorite ? <AiFillStar /> : <AiOutlineStar />;

    return <div onClick={makeFavorite}>{<AiFillStar color="#7352FF" />}</div>;
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

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="w-full flex">
        <div className="w-1/2 flex py-2">
          <div className="flex justify-start items-center">
            <div className="bg-white rounded-full border border-gray-300 px-4 py-2 flex items-center mr-4">
              <span className="mr-2 text-xs">All saved ideas</span>
              <HiOutlineChevronDown />
            </div>
            <div className="bg-white rounded-tl-full rounded-bl-full border border-gray-300 px-4 py-2 flex items-center">
              <span className="mr-2 text-xs">All ideas</span>
            </div>
            <div className="bg-white rounded-tr-full rounded-br-full border border-gray-300 px-4 py-2 flex items-center">
              <span className="mr-2 text-xs">Ideas with script</span>
            </div>
          </div>
        </div>
        <div className="w-1/2 flex justify-end py-2">
          {/* <div className="flex items-center w-2/4 border border-gray-300 bg-white rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Search video idea"
              className="flex-grow bg-transparent pr-2 text-xs"
              value={searchQuery}
              onChange={handleSearchChange}

            />
            <HiSearch className={`text-gray-500 text-sm ${
            isSearchEmpty
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-purple-500 cursor-pointer"
          }`}/>
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
      {!savedIdeasData ? (
        <div className="loading-container">
          <Spinner />
        </div>
      ) : (
        <div>
          <Header
            title={`All saved ideas (${savedIdeasData.length} ideas)`}
            size="text-1xl"
          />
          <GridComponent
            // id="gridcomp"
            dataSource={savedIdeasData}
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
                field="isFavorite"
                headerText=""
                width="80"
                template={gridOrderStars}
                tooltip="Hover over for more information"
              />
              <ColumnDirective
                field="video_ideas"
                headerText="Video ideas"
                headerTemplate={VideoIconTitleTemplate}
                tooltip="Hover over for more information"
              />
              <ColumnDirective
                field="search_volume"
                headerText="Search Volume on youtube"
                template={searchVolumeFormat}
                headerTemplate={VolumeTitleTemplate}
                tooltip="Hover over for more information"
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
      )}
    </div>
  );
};
export default SavedIdeas;
