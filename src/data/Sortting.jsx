/* eslint-disable */
import React, { useState, useEffect } from "react";
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

// ICONS
import { BiSearch, BiWorld, BiStar } from "react-icons/bi";
import { HiOutlineChevronDown, HiSearch } from "react-icons/hi";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import Spinner from "../components/Spinner";
import { createSpinner, showSpinner } from "@syncfusion/ej2-popups";
import axios from "axios";
import { useKeywordStore } from "../state/state";
import { useUserYoutubeInfo } from "../state/state";

// const contextMenuItems = [
//   "AutoFit",
//   "AutoFitAll",
//   "SortAscending",
//   "SortDescending",
//   "Copy",
//   "Edit",
//   "Delete",
//   "Save",
//   "Cancel",
//   "PdfExport",
//   "ExcelExport",
// ];

const Sortting = () => {
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

  const handleRowSelected = async (args) => {
    // const selectedRowData = args.data;

    // Check if the selected row is already in the array
    // const rowExists = selectedRows.some((row) => row.id === selectedRowData.id);

    // Toggle adding/removing the row from the array
    // if (rowExists) {
    //   setSelectedRows(selectedRows.filter((row) => row.id !== selectedRowData.id));
    // } else {
    // Update selectedRows state optimistically (for UI responsiveness)
    // setSelectedRows({
    //   video_ideas: args.data.keywords,
    //   search_volume: args.data.monthlysearch,
    //   keyword_diff: args.data.difficulty,
    //   potential_views: args.data.estimated_views
    // });

    try {
      // Use selectedRowData here instead of selectedRows
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/addToSavedIdeas`,
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
        `${process.env.REACT_APP_BASE_URL}/fetchKeywordStat?keywords=${searchQuery}`,
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

  function gridOrderStars(props) {
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

  const isSearchEmpty = searchQuery.trim() === "";

  const editing = { allowDeleting: true, allowEditing: true };
  // Filter the keywordData array based on the searchQuery
  // const filteredData = keywordData.filter(
  //   (item) => item.keyword === searchQuery,
  // );

  const formatViews = (props) => {
    const estimatedViews = parseInt(props.estimated_views);
    const formattedViews = estimatedViews.toLocaleString() + "+";
    return <span>{formattedViews}</span>;
  };

  const keywordDiffTemplate = (props) => {
    // return (
    <button
      type="button"
      // style={{
      //   backgroundColor:
      //     props.difficulty === "Hard"
      //       ? "red"
      //       : props.difficulty === "Easy"
      //       ? "green"
      //       : props.difficulty === "Medium"
      //       ? "yellow"
      //       : "transparent",
      // }}
      className="text-white py-1 px-2 capitalize rounded-2xl text-md"
    >
      {/* {props.difficulty} */}
      123
    </button>;
    // );
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

  const gridInstance = React.createRef();

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

  const formatDate = (props) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return (
      <div>
        {new Date(props.publishedAt).toLocaleDateString("en-US", options)}
      </div>
    );
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl">
      <div className="flex items-center justify-center h-full mb-5">
        <div className="flex items-center flex-col ">
          <div className="w-full max-w-xs flex items-center p-2 pl-4 pr-4 border border-gray-300 bg-white rounded-full">
            <input
              type="text"
              placeholder="Enter a topic, brand, or product"
              className="flex-grow bg-transparent outline-none pr-2 text-xs"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <BiSearch className="text-gray-500 text-xs" />
          </div>
        </div>

        <div className="relative ml-4">
          <select className="rounded-full py-2 pl-4 pr-8 border border-gray-300 bg-white text-xs">
            <option value="en">Global (English)</option>
            <option value="es">Español </option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        <button
          className={`text-white rounded-full px-4 py-2 ml-4 text-xs ${
            isSearchEmpty
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-purple-500 cursor-pointer"
          }`}
          onClick={handleGetIdeasClick}
          disabled={isSearchEmpty}
        >
          GET IDEAS
        </button>
      </div>
      {isLoading ? (
        <div className="loading-container">
          <Spinner />
        </div>
      ) : (
        <div className=""></div>
      )}
      {/* <div>
        <h2>Selected Rows:</h2>
        <ul>
          {selectedRows}
        </ul>
      </div> */}
      <div className="flex justify-start items-center">
        <Header title="Keywords you provided" size="text-1xl" />
        <span className="mt-5 ml-4 text-xs">
          {loadedLocalStorage && "(Results loaded from your last query)"}
        </span>
      </div>
      <GridComponent
        id="gridcomp"
        dataSource={exactKeywordData}
        allowExcelExport
        allowPdfExport
        allowPaging
        allowSorting
        // contextMenuItems={contextMenuItems}
        editSettings={editing}
        rowSelected={handleRowSelected}
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
            // template={keywordDiffTemplate}
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
      {/* <GridComponent dataSource={userYoutubeData} ref={gridInstance}>
            <ColumnsDirective>
              <ColumnDirective
                field="title"
                headerText="Videos"
                template={ThumbnailTitleTemplate}
                width="200"
              />
              <ColumnDirective
                field="optimizationLevel"
                headerText="Optimization level"
                template={gridOrderOptimizationLevel}
                width="200"
              />
              <ColumnDirective
                field="optimizationImpact"
                headerText="Optimization impact"
                template={gridOrderOptimizationImpact}
                width="150"
              />
              <ColumnDirective field="viewCount" headerText="View Count" />
              <ColumnDirective
                field="publishedAt"
                headerText="Published At"
                width="150"
                template={formatDate}
              />
            </ColumnsDirective>
            <Inject services={[ExcelExport]} />
          </GridComponent> */}
      <Header title="Keyword Suggestions" size="text-1xl" className="mt-4" />
      <div className="w-full flex">
        <div className="w-1/2 flex py-2">
          <div className="flex justify-start items-center">
            <div
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
            </div>
            <div>
              <span className="ml-4 text-xs">{`${relatedKeywordData.length} video ideas found`}</span>
            </div>
          </div>
        </div>
        <div className="w-1/2 flex justify-end py-2"></div>
      </div>

      <GridComponent
        id="gridcomp"
        dataSource={relatedKeywordData}
        allowExcelExport
        allowPdfExport
        allowPaging
        allowSorting
        // contextMenuItems={contextMenuItems}
        editSettings={editing}
        rowSelected={handleRowSelected}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="isFavorite"
            headerText="save"
            width="80"
            // template={gridOrderStars}
          />
          <ColumnDirective field="keyword" headerText="Video ideas" />
          <ColumnDirective
            field="monthlysearch"
            headerText="Seach Volume on youtube"
            // template={<span>{exactKeywordData.monthlysearch}</span>}
          />
          <ColumnDirective field="difficulty" headerText="Keyword Difficulty" />
          {/* <ColumnDirective
        field="cost_per_click"
        headerText="Cost per click"
      /> */}
          <ColumnDirective
            field="estimated_views"
            headerText="Potential views on youtube"
            // template={(rowData) => <span>{parseInt(rowData.estimated_views).toLocaleString() + '+'}</span>}
            // template={(rowData) => (
            //   <span>{Math.floor(Number(rowData.estimated_views)).toLocaleString()}+</span>
            // )}
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

export default Sortting;
