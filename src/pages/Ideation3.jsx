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
  useUserAuthToken,
  useUserLoggedin,
  useAllUserDeets,
} from "../state/state";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { FaYoutube, FaGoogle, FaPlus, FaVideo } from "react-icons/fa";
import Spinner from "../components/Spinner";
import { BiSearch, BiWorld, BiStar } from "react-icons/bi";
import { useStateContext } from "../contexts/ContextProvider";
import { useUser } from "@clerk/clerk-react";
import showToast from "../utils/toastUtils";
// import { getUserEncryptedData } from "../data/api/calls";
import CryptoJS from "crypto-js";
import { userFullDataDecrypted } from "../data/api/calls";

const Ideation = () => {
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
  const userLoggedIn = useUserLoggedin((state) => state.userLoggedIn);
  const setUserLoggedIn = useUserLoggedin((state) => state.setUserLoggedIn);
  const allUserDeets = useAllUserDeets((state) => state.allUserDeets);
  const setAllUserDeets = useAllUserDeets((state) => state.setAllUserDeets);
  const encryptedGData = localStorage.getItem("encryptedGData");
  const decryptedFullData = decryptAndRetrieveData(encryptedGData);
  const [keywordSuggestionRemark, setKeywordSuggestionRemark] = useState("");
  let savedData;
  // !userLoggedIn && setUserLoggedIn(true);
  // console.log("getUserEncryptedData", getUserEncryptedData());

  useEffect(() => {
    // Get saved data from localStorage
    savedData = JSON.parse(localStorage.getItem("lastVideoIdeas"));
    setUserLoggedIn(true);
    console.log("decryptedFullData 2222222", decryptedFullData);

    // Compare the length of the API data with the localStorage data
    if (!savedData) {
      console.log("got here");

      return null;
    } else {
      console.log("now serving from local storage", savedData);
      setLoadedLocalStorage(true);
      setRelatedKeywordData(savedData.related_keywords);
      setExactKeywordData(savedData.exact_keyword);
    }
  }, []);

  // useEffect(() => {
  //   console.log("userAuthToken 1 decryptedFullData", decryptedFullData);
  //   const user_id = decryptedFullData.user_id;
  //   if (!userAuthToken) {
  //     const grabUserToken = async () => {
  //       try {
  //         const response = await axios.get(
  //           `http://localhost:8080/api/getSavedUserToken?user_id=${user_id}`,
  //           {
  //             headers: {
  //               "Content-Type": "application/json",
  //               "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
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

  function removeUndefinedOrNull(arr) {
    return arr.filter((item) => item !== undefined && item !== null);
  }

  const toggleSave = async (keyword, save) => {
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
        alert(
          "Yo Bro. I am about to delete the exact Keyword. You sure about this bro?. This shit is irreversible bro. You gotta be sure bro. Click okay if you sure, but think hard bro!!",
        );
      } else {
        foundObject = savedData.related_keywords.find(
          (item) => item.keyword === keyword,
        );
      }

      console.log("savedIdeasData", savedIdeasData);
      console.log("foundObject.monthlysearch", foundObject);

      if (save) {
        const response = await axios.post(
          "http://localhost:8080/api/addToSavedIdeas",
          {
            video_ideas: foundObject.keyword,
            search_volume: foundObject.monthlysearch,
            keyword_diff: foundObject.difficulty,
            potential_views: foundObject.estimated_views,
            email: decryptedFullData.email,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
              Authorization: `Bearer ${decryptedFullData.token}`,
            },
          },
        );
        // fetchSavedIdeasData()

        console.log("Data saved successfully and response:", foundObject);
        if (response.data.success) {
          showToast("success", "Idea saved successfully", 2000);
        } else {
          showToast("error", "Idea wasn't saved. Try again", 2000);
        }
      } else {
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
          console.log("to delete response.data", response.data.data);
          const data = response.data.data;
          const findFoundObjectInSaved = data.find(
            (item) => item.video_ideas === foundObject.keyword,
          );

          console.log("to delete response.data 2", findFoundObjectInSaved);
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
          console.log("Data removed successfully", findFoundObjectInSaved);
          if (responseDelete.data.success) {
            showToast("success", "Idea removed from Saved Ideas", 2000);
          } else {
            showToast("error", "Idea wasn't removed. Try again", 2000);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          throw error; // Rethrow the error to handle it in the component if needed
        }
      }
    } catch (error) {
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
            "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
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
    const keyword = props.keyword;
    // if (!rowData || typeof rowData.isFavorite === 'undefined') {
    //   return null; // Handle cases where rowData is missing or isFavorite is undefined
    // }
    const [isFavorite, setIsFavorite] = useState(false);
    const makeFavorite = () => {
      setIsFavorite(!isFavorite);
      isFavorite ? toggleSave(keyword, false) : toggleSave(keyword, true);
    };

    const starIcon = isFavorite ? (
      <AiFillStar color="#7352FF" />
    ) : (
      <AiOutlineStar color="#7352FF" />
    );

    return <div onClick={makeFavorite}>{starIcon}</div>;
  };

  function formatNumberToKPlus(number) {
    if (number >= 1000) {
      const formattedNumber = Math.floor(number / 1000);
      return formattedNumber + "k+";
    } else {
      return number.toString();
    }
  }

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

  const handleGetIdeas = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      console.log("handleGetIdeas   ", decryptedFullData.token);

      const response = await axios.get(
        `http://localhost:8080/api/fetchKeywordStat?keyword=${searchQuery}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
            Authorization: `Bearer ${decryptedFullData.token}`,
          },
        },
      );

      const data = response.data;
      console.log("response.data", response.data);
      setIsLoading(false);

      // Update state with the API response
      setExactKeywordData(data.response.exact_keyword);
      setRelatedKeywordData(data.response.related_keywords);
      localStorage.setItem("lastVideoIdeas", JSON.stringify(data.response));
      setLoadedLocalStorage(false);

      // console.log(keywordData);
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
    setKeywordSuggestionRemark("that are Question based");
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

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
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
          onClick={handleGetIdeas}
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
      <div>
        <div className="flex justify-start items-center">
          <Header title="Keywords you provided" size="text-1xl" />
          <span className="mt-5 ml-4 text-xs">
            {loadedLocalStorage && "(Results loaded from your last query)"}
          </span>
        </div>
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
            />
            <ColumnDirective
              field="monthlysearch"
              headerText="Search Volume on youtube"
              headerTemplate={VolumeTitleTemplate}
              template={searchVolumeDataRowTemplate}
            />
            <ColumnDirective
              field="difficulty"
              headerText="Keyword Difficulty"
              template={keywordDiffTemplate}
            />
            <ColumnDirective
              field="estimated_views"
              headerText="Potential views on youtube"
              headerTemplate={VideoIconTitleTemplate}
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
                <span className="ml-4 text-xs">{`${relatedKeywordData.length} video ideas found ${keywordSuggestionRemark}`}</span>
              </div>
            </div>
          </div>
          <div className="w-1/2 flex justify-end py-2"></div>
        </div>
        <GridComponent
          // id="gridcomp"
          dataSource={relatedKeywordData}
          allowExcelExport
          allowPdfExport
          allowPaging
          allowSorting
          selectionSettings={{ type: "Multiple" }}
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
            />
            <ColumnDirective
              field="keyword"
              headerText="Video ideas"
              headerTemplate={VideoIconTitleTemplate}
            />
            <ColumnDirective
              field="monthlysearch"
              headerText="Search Volume on youtube"
              headerTemplate={VolumeTitleTemplate}
              template={searchVolumeDataRowTemplate}
            />
            <ColumnDirective
              field="difficulty"
              headerText="Keyword Difficulty"
              template={keywordDiffTemplate}
            />
            <ColumnDirective
              field="estimated_views"
              headerText="Potential views on youtube"
              headerTemplate={VideoIconTitleTemplate}
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

export default Ideation;