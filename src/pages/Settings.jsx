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

const Settings = () => {
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

  function removeUndefinedOrNull(arr) {
    return arr.filter((item) => item !== undefined && item !== null);
  }

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
          "http://localhost:8080/api/addToSavedIdeas",
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
            "http://localhost:8080/api/getAllSavedIdeas",
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
            `http://localhost:8080/api/deleteSavedIdea/${findFoundObjectInSaved.id}`,
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

  Example2();

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
        "http://localhost:8080/api/addToSavedIdeas",
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
    const estimatedViews = parseInt(props.estimated_views);
    // const formattedViews = estimatedViews.toLocaleString() + "+";
    return (
      <span className="flex items-center justify-center">
        {estimatedViews}+
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

  const isSearchEmpty = searchQuery.trim() === "";

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      {isLoading ? (
        <div className="loading-container">
          <Spinner />
        </div>
      ) : (
        <div className=""></div>
      )}
      <div>
        <div className="flex items-center mb-5 w-full border-b border-solid border-gray-300">
          <div className="flex justify-between items-center mr-5 pr-5">
            Rankings
          </div>
          <div className="flex justify-between items-center selectedMenuKwPg">
            Keywords
          </div>
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
            <div className="flex justify-start items-center">
              <div
                className="text-white rounded-full border border-gray-300 px-4 py-2 flex items-center mr-4"
                style={{ backgroundColor: "#7352FF" }}
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
          </div>
        </div>
        <GridComponent
          // id="gridcomp"
          dataSource={exactKeywordData}
          allowExcelExport
          allowPdfExport
          allowPaging
          allowSorting
          selectionSettings={{ type: "Multiple" }}
          toolbar={["Delete"]}
          // contextMenuItems={contextMenuItems}
          // editSettings={editing}
          // rowSelected={handleRowSelected}
        >
          <ColumnsDirective>
            <ColumnDirective type="checkbox" width="50" />
            <ColumnDirective
              field=""
              headerText="Youtube Results"
              headerTemplate={VideoIconTitleTemplate}
            />
            <ColumnDirective
              field="monthlysearch"
              headerText="Rank"
              headerTemplate={VolumeTitleTemplate}
              template={searchVolumeDataRowTemplate}
            />
            <ColumnDirective
              field="difficulty"
              headerText="Change"
              template={keywordDiffTemplate}
            />
            <ColumnDirective
              field="estimated_views"
              headerText="Video Result"
              headerTemplate={VideoIconTitleTemplate}
              template={formatViews}
            />
            <ColumnDirective
              field="estimated_views"
              headerText="Volume"
              template={formatViews}
            />
            <ColumnDirective
              field="estimated_views"
              headerText="Date added"
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
    </div>
  );
};

export default Settings;
