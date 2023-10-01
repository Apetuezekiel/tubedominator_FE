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
// import { HiOutlineChevronDown, HiSearch } from "react-icons/hi";
import { FaYoutube } from "react-icons/fa";
import { Header } from "../components";
import { HiOutlineRefresh } from "react-icons/hi";
import { useUserYoutubeInfo } from "../state/state";
import { useKeywordStore } from "../state/state";

// ICONS
import { BiSearch, BiWorld, BiStar } from "react-icons/bi";
import { HiOutlineChevronDown, HiSearch } from "react-icons/hi";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import Spinner from "../components/Spinner";
import { createSpinner, showSpinner } from "@syncfusion/ej2-popups";

const Ideation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  // const [exactKeywordData, setExactKeywordData] = useState([]);
  // const [relatedKeywordData, setRelatedKeywordData] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [selectedRows, setSelectedRows] = useState({});
  const [loadedLocalStorage, setLoadedLocalStorage] = useState(false);
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
  const userYoutubeData = useUserYoutubeInfo((state) => state.userYoutubeData);

  function removeUndefinedOrNull(arr) {
    return arr.filter((item) => item !== undefined && item !== null);
  }

  useEffect(() => {
    // Get saved data from localStorage
    let savedData = JSON.parse(localStorage.getItem("lastVideoIdeas"));

    // Compare the length of the API data with the localStorage data
    if (!savedData) {
      console.log("got here");

      return null;
    } else {
      console.log("now serving from local storage");
      setLoadedLocalStorage(true);
      setRelatedKeywordData(savedData.related_keywords);
      setExactKeywordData(savedData.exact_keyword);
    }
  }, []);

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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const isSearchEmpty = searchQuery.trim() === "";

  const handleGetIdeasClick = () => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsLoading(true);

    // Make the API call here
    axios
      .get(
        `http://localhost:8080/api/fetchKeywordStat?keywords=${searchQuery}`,
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

  const ThumbnailTemplate = (props) => {
    return (
      <div>
        <img
          src={props.thumbnailUrl}
          alt="Thumbnail"
          style={{ width: "100px", height: "80px" }}
        />
      </div>
    );
  };

  const formatDate = (props) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return (
      <div>
        {new Date(props.publishedAt).toLocaleDateString("en-US", options)}
      </div>
    );
  };

  // Custom header template for Channel Title column
  const channelTitleHeaderTemplate = (props) => {
    return (
      <span className="flex items-center">
        {props.column ? props.column.headerText : "Channel Title"}
        <FaYoutube className="mx-2" />
      </span>
    );
  };

  const ThumbnailTitleTemplate = (props) => {
    return (
      <div>
        <img
          src={props.thumbnails.high.url}
          alt="Thumbnail"
          style={{ width: "100px", height: "80px" }}
        />
        <div>{props.title}</div>
      </div>
    );
  };

  const gridOrderOptimizationLevel = (props) => {
    return (
      <div className="h-2 w-full rounded-full flex flex-row items-center justify-between">
        <div className="h-full w-80 bg-gray-300 w-full rounded-full mr-2">
          <div className="h-full w-10 bg-purple-600 rounded-full"></div>
        </div>
        <span className="w-20 text-xs text-purple-600">20%</span>
      </div>
    );
  };

  const gridOrderOptimizationImpact = (props) => {
    return (
      <div className="h-5 w-full rounded-full flex flex-row items-center justify-between">
        <div className="h-full w-80 bg-gray-300 w-full rounded-full mr-2">
          <div className="h-full w-10 bg-purple-600 rounded-full">
            <span className="w-20 text-xs ml-3 text-white">Low</span>
          </div>
        </div>
      </div>
    );
  };
  const handleRowSelected = async (args) => {
    console.log("clickfd");
  };
  const editing = { allowDeleting: true, allowEditing: true };
  const keywordDiffTemplate = (props) => {
    return (
      <button
        type="button"
        style={{
          backgroundColor:
            props.difficulty === "Hard"
              ? "red"
              : props.difficulty === "Easy"
              ? "green"
              : props.difficulty === "Medium"
              ? "yellow"
              : "transparent",
        }}
        className="py-1 px-2 capitalize rounded-2xl text-md"
      >
        {props.difficulty}
      </button>
    );
  };

  const gridInstance = React.createRef();

  const exportToExcel = () => {
    if (gridInstance.current) {
      gridInstance.current.excelExport();
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl">
      {/* {isLoading ? (
        <div className="loading-container">
          <Spinner />
        </div>
      ) : (
        <div className=""></div>
      )} */}
      {/* <div>
        <h2>Selected Rows:</h2>
        <ul>
          {selectedRows}
        </ul>
      </div> */}
      {/* <div className="flex justify-start items-center">
        <Header title="Keywords you provided" size="text-1xl" />
        <span className="mt-5 ml-4 text-xs">
          {loadedLocalStorage && "(Results loaded from your last query)"}
        </span>
      </div> */}
      <GridComponent
        // id="gridcomp"
        dataSource={exactKeywordData}
        allowExcelExport
        allowPdfExport
        allowPaging
        allowSorting
        // contextMenuItems={contextMenuItems}
        // editSettings={editing}
        // rowSelected={handleRowSelected}
      >
        <ColumnsDirective>
          <ColumnDirective field="isFavorite" headerText="save" width="80" />
          <ColumnDirective field="keyword" headerText="Video ideas" />
          <ColumnDirective
            field="monthlysearch"
            headerText="Seach Volume on youtube"
          />
          <ColumnDirective
            field="difficulty"
            headerText="Keyword Difficulty"
            template={keywordDiffTemplate}
          />
          <ColumnDirective
            field="estimated_views"
            headerText="Potential views on youtube"
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
  );
};

export default Ideation;
