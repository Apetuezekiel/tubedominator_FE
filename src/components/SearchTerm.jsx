/* eslint-disable */
import { useState } from "react";
import heroImage from "../data/avatar3.png";
import { FaChevronDown, FaChevronUp, FaYoutube } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";
import { thingsToFix, itemsFixed } from "../data/optimizeData";
import { useEffect } from "react";
import {
  useShowSearchTermPanel,
  useUserSavedSearchTerm,
  useUserSearchTerm,
  useUserYoutubeInfo,
} from "../state/state";
import Spinner from "./Spinner";
import { userFullDataDecrypted } from "../data/api/calls";
import axios from "axios";
import { FiCamera, FiEdit3 } from "react-icons/fi";
import { BiLoaderCircle, BiSearch } from "react-icons/bi";
import { BsFillBookmarkCheckFill, BsBookmark } from "react-icons/bs";
import { AiOutlineCopy, AiOutlineRollback } from "react-icons/ai";
import { Tooltip } from "react-tippy";
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
import showToast from "../utils/toastUtils";
import countriesWithLanguages from "../data/countries";

const staticData = [
  { keyword: "Keyword 1", source: "Source 1", monthlysearch: 1000 },
  { keyword: "Keyword 2", source: "Source 2", monthlysearch: 1500 },
  { keyword: "Keyword 3", source: "Source 3", monthlysearch: 800 },
];

function SearchTerm({ videoId }) {
  const userSavedSearchTerm = useUserSavedSearchTerm(
    (state) => state.userSavedSearchTerm,
  );
  const setUserSavedSearchTerm = useUserSavedSearchTerm(
    (state) => state.setUserSavedSearchTerm,
  );
  const decryptedFullData = userFullDataDecrypted();
  const [isUserDataLoaded, setIsuserDataLoaded] = useState(false);
  const userYoutubeData = useUserYoutubeInfo((state) => state.userYoutubeData);
  const setUserYoutubeData = useUserYoutubeInfo(
    (state) => state.setUserYoutubeData,
  );
  const showSearchTermPanel = useShowSearchTermPanel(
    (state) => state.showSearchTermPanel,
  );
  const setShowSearchTermPanel = useShowSearchTermPanel(
    (state) => state.setShowSearchTermPanel,
  );
  const [formData, setFormData] = useState({
    title: String(userYoutubeData[0]?.title),
    description: String(userYoutubeData[0]?.description),
    tags: String(userYoutubeData[0]?.tags),
    thumbnail: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [unfixed, setUnfixed] = useState([]);
  const [fixed, setFixed] = useState([]);
  const searchTerm = "church";
  const accordionArray = [1, 2];
  const [accordionState, setAccordionState] = useState(
    Array(accordionArray.length).fill(false),
  );
  const [processedUserSearchTerms, setProcessedUserSearchTerms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const initialCountry = {
    countryCode: "GLB",
    languageCode: "en",
  };
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);

  // useEffect(() => {
  //   let isMounted = true;
  //   const fetchMyYoutubeVideos = async () => {
  //     try {
  //       axios
  //         .get(`${process.env.REACT_APP_BASE_URL}/fetchMyYoutubeVideos`, {
  //           params: {
  //             channel_id: decryptedFullData.channelId,
  //             videoIds: "BdG8R9pqHA0",
  //           },
  //           headers: {
  //             "Content-Type": "application/json",
  //             "x-api-key": process.env.REACT_APP_X_API_KEY,
  //             Authorization: `Bearer ${decryptedFullData.token}`,
  //             gToken: decryptedFullData.gToken,
  //           },
  //         })
  //         .then((response) => {
  //           if (isMounted) {
  //             setUserYoutubeData(response.data);
  //             setIsuserDataLoaded(true);
  //             console.log(response);
  //           }
  //         })
  //         .catch((error) => {
  //           console.error("Error fetching data:", error);
  //         });
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchMyYoutubeVideos();
  // }, []);

  let savedSearchTermData;
  useEffect(() => {
    savedSearchTermData = JSON.parse(
      localStorage.getItem(`${videoId}searchTermData`),
    );
    const savedSearchTerm = JSON.parse(
      localStorage.getItem(`${videoId}searchTerm`),
    );
    setSearchQuery(savedSearchTerm);
    setProcessedUserSearchTerms(savedSearchTermData);
    if (!savedSearchTermData) {
      console.log("got to local storage bay here");

      return null;
    } else {
      console.log(
        "now serving search term from local storage",
        savedSearchTermData,
      );
    }
  }, []);

  const handleCountryChange = (event) => {
    const selectedValue = event.target.value;
    const [selectedCountryCode, selectedLanguageCode] =
      selectedValue.split(":");

    // if (selectedCountryData) {
    setSelectedCountry({
      countryCode: selectedCountryCode,
      languageCode: selectedLanguageCode,
    });
    // }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleGetIdeas = async () => {
    if (!searchQuery.trim()) {
      showToast("warning", "Search box is empty", 2000);
      return;
    }

    console.log("You searched");

    const postData = {
      keyword: searchQuery,
      countryCode: selectedCountry.countryCode,
      languageCode: selectedCountry.languageCode,
    };

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/fetchKeywordStat`,
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
      console.log("response.data", response.data);
      setIsLoading(false);
      const allKeywords = data.response.all;
      const exactKeyword = data.response.exact_keyword[0];
      localStorage.setItem(
        `${videoId}searchTermData`,
        JSON.stringify(allKeywords),
      );
      localStorage.setItem(
        `${videoId}searchTerm`,
        JSON.stringify(exactKeyword.string),
      );
      setProcessedUserSearchTerms(allKeywords);
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

  const handleGetIdeasOnEnter = (event) => {
    if (event.key === "Enter") {
      handleGetIdeas();
    }
  };

  const validateAndAddToUnfixed = (index, condition, errorMessage) => {
    setUnfixed((prevUnfixed) => {
      if (condition) {
        // Remove the item from unfixed if it exists
        return prevUnfixed.filter((item) => item.index !== index);
      } else {
        // Add the item to unfixed if it doesn't exist
        if (!prevUnfixed.some((item) => item.index === index)) {
          return [...prevUnfixed, thingsToFix[index]];
        }
      }
      return prevUnfixed; // Return the unchanged array if no changes were made
    });

    setFixed((prevFixed) => {
      if (condition) {
        // Add the item to fixed if it doesn't exist
        if (!prevFixed.some((item) => item.index === index)) {
          return [...prevFixed, itemsFixed[index]];
        }
      } else {
        // Remove the item from fixed if it exists
        return prevFixed.filter((item) => item.index !== index);
      }
      return prevFixed; // Return the unchanged array if no changes were made
    });
  };

  const AICheck = () => {
    const urlRegex =
      /(https?:\/\/[^\s]*|www\.[^\s]*|[^@]+\.[^\s]+\.com[^\s]*)/g;
    const hashtagRegex = /#[A-Za-z0-9_-]+/g;
    const timestampRegex = /0:00/; // Check for the pattern "0:00"

    // Validation and checks for title
    const doesTitleHaveSearchTerm = !formData.title.includes(searchTerm);
    const isTitleLengthOkay =
      !formData.title.length > 0 && !formData.title.length <= 70;
    validateAndAddToUnfixed(0, doesTitleHaveSearchTerm, "Invalid title");
    validateAndAddToUnfixed(1, isTitleLengthOkay, "Invalid title");

    // Validation and checks for description
    const isDescriptionValid = !formData.description.includes(searchTerm);
    const isUrlValid = !formData.description.match(urlRegex);
    const isHashtagValid = !formData.description.match(hashtagRegex);
    const hasTimestamps = !formData.description.match(timestampRegex);

    validateAndAddToUnfixed(2, isDescriptionValid, "Invalid description");
    validateAndAddToUnfixed(3, hasTimestamps, "Invalid hashtag");
    validateAndAddToUnfixed(4, isUrlValid, "Invalid URL");
    validateAndAddToUnfixed(5, isHashtagValid, "Invalid hashtag");

    // Validation and checks for tags
    const tagsArray = formData.tags.split(",");
    const isTagsValid = !tagsArray.length >= 5;
    const isTagsSearchValid = !formData.tags.includes(searchTerm);

    validateAndAddToUnfixed(7, !formData.tags, "Tags are required");
    validateAndAddToUnfixed(8, isTagsValid, "Too few tags");
    validateAndAddToUnfixed(9, isTagsSearchValid, "Invalid tag search");
  };

  useEffect(() => {
    AICheck();
  }, [formData, searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFormData({ ...formData, ["thumbnail"]: file });
  };

  const handlePostUpdate = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }

    try {
      // Create a form data object to send the file to the server
      const formData = new FormData();
      formData.append("thumbnail", selectedFile);

      // Send the file to the Laravel backend for processing
      const response = await axios.post("/api/upload-thumbnail", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Thumbnail uploaded successfully!");
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      alert("An error occurred while uploading the thumbnail.");
    }
  };

  const updateUserVideo = async () => {
    const requestData = {
      videoId: userYoutubeData.videoId,
      categoryId: userYoutubeData.categoryId,
      videoTitle: formData.title,
      videoDescription: formData.description,
      videoTags: formData.tags,
      // videoThumbnailUrl: 'https://example.com/thumbnail.jpg',
      // videoThumbnailHeight: 120,
      // videoThumbnailWidth: 160,
    };

    const requestHeaders = {
      "Content-Type": "application/json",
      "x-api-key": process.env.REACT_APP_X_API_KEY,
      Authorization: `Bearer ${decryptedFullData.token}`,
      gToken: decryptedFullData.gToken,
    };

    try {
      axios
        .put(
          `${process.env.REACT_APP_BASE_URL}/updateMyYoutubeVideos`,
          requestData,
          {
            headers: requestHeaders,
          },
        )
        .then((response) => {
          if (isMounted) {
            console.log("Success:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [ThingsToFixState, setThingsToFixAccordion] = useState(
    Array(thingsToFix.length).fill(false),
  );

  const [fixedState, setFixedAccordion] = useState(
    Array(thingsToFix.length).fill(false),
  );

  const toggleThingsToFixAccordion = (index) => {
    const newState = [...ThingsToFixState];
    newState[index] = !newState[index];
    setThingsToFixAccordion(newState);
  };

  const toggleFixedAccordion = (index) => {
    const newState = [...fixedState];
    newState[index] = !newState[index];
    setFixedAccordion(newState);
  };

  const maxTitleCharacters = 100;
  const maxDescriptionCharacters = 5000;
  const maxTagsCharacters = 500;

  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const toggleAccordion1 = () => {
    setIsOpen1(!isOpen1);
  };

  const toggleAccordion2 = () => {
    setIsOpen2(!isOpen2);
  };

  const sourceTemplate = (props) => {
    return (
      <span>
        <FaYoutube color="red" />
      </span>
    );
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
    const [isCopied, setIsCopied] = useState(false);
    const monthlysearch = parseInt(props.monthlysearch);
    const formatedNumber = formatNumberToKMBPlus(monthlysearch);

    const copyToClipboard = () => {
      const textField = document.createElement("textarea");
      textField.innerText = props.keyword;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand("copy");
      textField.remove();
      setIsCopied(true);

      // Reset the "Copied" state after a brief delay
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    };

    const bookmarkIcon = props.bookmarked ? (
      <BsFillBookmarkCheckFill
        color="#7352FF"
        onClick={() => toggleSave(props, false)}
      />
    ) : (
      <BsBookmark color="#7352FF" onClick={() => toggleSave(props, true)} />
    );

    return (
      <div className="grid grid-cols-3 items-center">
        <span className="mr-3">{formatedNumber}</span>
        <span className="mr-3 cursor-pointer text-sm flex items-center">
          <span className="mr-2">
            <button
              onClick={() => selectUserSearchTerm(props.keyword)}
              className="btn"
            >
              Select
            </button>
          </span>
        </span>
        {/* <AiOutlineCopy color="#7352FF" className="cursor-pointer"/> */}
        <div className="relative">
          <Tooltip
            title="Copy keyword"
            position="top"
            trigger="mouseenter"
            animation="fade"
            theme="translucent"
          >
            <AiOutlineCopy
              color="#7352FF"
              className={`cursor-pointer ${isCopied ? "text-green-500" : ""}`}
              onClick={copyToClipboard}
            />
          </Tooltip>
          {isCopied && <span className="text-green-500 ml-1">Copied!</span>}
        </div>
      </div>
    );
  };

  const selectUserSearchTerm = (selectedSearchTerm) => {
    setUserSavedSearchTerm(selectedSearchTerm);
    setShowSearchTermPanel(false);
  };

  return (
    <div className="flex h-screen flex-col px-10 py-5">
      {/* <div className="flex pl-5 pb-5 pt-5">
        <div className="w-1/2 items-center flex">
          <img
            src={userYoutubeData[0]?.thumbnails.url}
            alt=""
            height="20"
            width="50"
            className="mr-3"
          />
          <div className="underline">{userYoutubeData[0]?.title}</div>
          <span
            className="ml-3 text-xs px-5 py-1 rounded-lg text-white"
            style={{ backgroundColor: "#7438FF" }}
          >
            Draft
          </span>
        </div>
        <div className="w-1/2 flex justify-end items-center">
          <button
            onClick={updateUserVideo}
            style={{ backgroundColor: "#7438FF" }}
            className="text-md text-white py-2 px-5 rounded"
          >
            Update on Youtube
          </button>
        </div>
      </div>
      <div className="flex pl-5 pb-5 border-b border-t pt-5">
        <div className="w-1/2 items-center flex underline">
          Search Term:{" "}
          {isUserDataLoaded ? (
            <span className="flex justify-center items-center ml-2">
              {userYoutubeData[0]?.title} <FiEdit3 className="ml-1" />
            </span>
          ) : (
            <Spinner width={3} />
          )}
        </div>
        <div className="w-1/2 flex justify-around items-center"></div>
      </div> */}
      <div className="flex flex-col justify-center items-center h-screen mt-20">
        <div className="flex flex-col justify-center items-center">
          <div>
            <TiDeleteOutline
              onClick={() => setShowSearchTermPanel(false)}
              size={30}
              color="#7352FF"
              className="cursor-pointer"
            />
          </div>
          <h1 className="text-xl">Define a Search Term To Rank For</h1>
          <div className="text-sm text-center">
            Choosing a search term gets you better recommendations for your
            metadata. <br />
            You can either search or choose a suggested term.
          </div>
        </div>
        <div className="flex w-4/6 flex-col items-center justify-center h-full mb-5">
          <div className="p-4 w-full">
            <div className="mb-4">
              <div className="border rounded shadow mt-5">
                <button
                  className="w-full text-sm text-left p-3 border-b flex items-center justify-between focus:outline-none"
                  onClick={toggleAccordion1}
                  style={{ backgroundColor: "#F4F6F8" }}
                >
                  Search
                  {isOpen1 ? (
                    <FaChevronUp size={10} />
                  ) : (
                    <FaChevronDown size={10} />
                  )}
                </button>
                {isOpen1 && (
                  <div v className="p-3 text-sm">
                    <div>
                      <div className="flex w-full items-end">
                        <div className="flex flex-col w-4/6">
                          <span className="mb-2">
                            Enter topics closely related to your video.
                          </span>
                          <div className="w-full max-w-xs flex items-center p-2 pl-4 pr-4 border border-gray-300 bg-white rounded-full">
                            <input
                              type="text"
                              placeholder="Enter a topic, brand, or product"
                              className="flex-grow bg-transparent outline-none pr-2 text-xs"
                              value={searchQuery}
                              onChange={handleSearchChange}
                              onKeyDown={handleGetIdeasOnEnter}
                            />
                            <BiSearch
                              className="text-gray-500 text-xs cursor-pointer"
                              onClick={handleGetIdeas}
                            />
                          </div>
                        </div>

                        <div className="relative ml-4 w-2/6">
                          <select
                            id="countrySelect"
                            className="rounded-full py-2 pl-4 pr-8 border border-gray-300 bg-white text-xs"
                            value={`${selectedCountry.countryCode}:${selectedCountry.languageCode}`}
                            onChange={handleCountryChange}
                          >
                            {/* <option value="GLB:en">Global (English)</option> */}
                            {countriesWithLanguages.map((item, index) => (
                              <option
                                key={index}
                                value={`${item.countryCode}:${item.languageCode}`}
                              >
                                {`${item.country} (${item.language})`}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      <div className="text-left flex items-center justify-between focus:outline-none border-b pb-3"></div>
                    </div>
                    <div>
                      {isLoading ? (
                        <div className="flex flex-col justify-center items-center w-full mt-20">
                          <BiLoaderCircle
                            className="animate-spin text-center"
                            color="#7352FF"
                            size={30}
                          />
                          <div>Gathering Insights for your Keyword.</div>
                        </div>
                      ) : (
                        <div className=""></div>
                      )}
                    </div>
                    <GridComponent
                      // id="gridcomp"
                      dataSource={processedUserSearchTerms}
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
                          field="keyword"
                          headerText="Keywords"
                          width="250"
                        />
                        <ColumnDirective
                          field="source"
                          headerText="Source"
                          template={sourceTemplate}
                          width="100"
                        />
                        <ColumnDirective
                          field="monthlysearch"
                          headerText="SV"
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
                )}
              </div>
              {/* <div className="border rounded shadow mt-5">
                <button
                  className="w-full text-sm text-left p-3 border-b flex items-center justify-between focus:outline-none"
                  onClick={toggleAccordion2}
                >
                  section.headline
                  {isOpen2 ? (
                    <FaChevronUp size={10} />
                  ) : (
                    <FaChevronDown size={10} />
                  )}
                </button>
                {isOpen2 && (
                  <div className="p-3 text-sm">
                    <p>section body</p>
                    <div className="text-sm text-gray-500">
                      <div className="text-left flex items-center justify-between focus:outline-none border-b pb-3"></div>
                    </div>
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchTerm;
