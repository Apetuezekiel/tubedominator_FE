import { BiArrowBack, BiLoaderCircle, BiSearch } from "react-icons/bi";
import axios from "axios";
import { useEffect } from "react";
import {
  generateVideo,
  generateVideoSlides,
  getVideoTemplates,
  renderVideo,
  retrieveVideo,
  userFullDataDecrypted,
} from "../data/api/calls";
import { useState } from "react";
import Loader from "../components/Loader";
import { IoCopy } from "react-icons/io5";
import showToast from "../utils/toastUtils";
import { Tooltip } from "react-tooltip";
import TDLogo from "../assets/images/TubeDominator 500x500.png";
import Tags from "../components/Tags";

function AiPostGenerator({ display }) {
  // const decryptedFullData = userFullDataDecrypted();
  const [generatedYoutubePost, setGeneratedYoutubePost] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(null);
  const [loadedYoutubePost, setLoadedYoutubePost] = useState(false);
  const [generatedThumbnail, setGeneratedThumbnail] = useState("");
  const [generatingThumbnail, setGeneratingThumbnail] = useState(false);
  const [videoTemplates, setVideoTemplates] = useState(false);
  const [selectedVideoTemplate, setSelectedVideoTemplate] = useState({
    index: null,
    templateId: "",
  });
  const [loadingVideoTemplates, setLoadingVideoTemplates] = useState(false);
  const [creatingVideo, setCreatingVideo] = useState(false);
  const [videoCreated, setVideoCreated] = useState(false);
  const [videoCreationFailed, setVideoCreationFailed] = useState(false);
  const [videoRendered, setVideoRendered] = useState(false);
  const [videoRetrieved, setVideoRetrieved] = useState(false);
  const [renderingVideo, setRenderingVideo] = useState(false);
  const [retrievingVideo, setRetrievingVideo] = useState(false);
  const [videoRetrievalFailed, setVideoRetrievalFailed] = useState(false);
  const [videoRenderingFailed, setVideoRenderingFailed] = useState(false);
  const [generatingSlides, setGeneratingSlides] = useState(false);
  const [slidesGenerated, setSlidesGenerated] = useState(false);
  const [slidesGeneratingFailed, setSlidesGeneratingFailed] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [textSource, setTextSource] = useState("text");
  const [copiedStates, setCopiedStates] = useState({
    title: false,
    script: false,
    description: false,
    // Add more sections as needed
  });

  const isSearchEmpty = searchQuery.trim() === "";

  const generateThumbnail = async (prompt) => {
    setGeneratingThumbnail(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/generateThumbnail`,
        {
          prompt,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            Authorization: `Bearer ${userFullDataDecrypted()?.token}`,
          },
        },
      );

      if (response.data.success) {
        const thumbnailUrl = response.data.data.data[0].url;
        setGeneratingThumbnail(false);
        console.log("THumbnail succesfully generated");
        setGeneratedThumbnail(thumbnailUrl);
      } else {
        setGeneratingThumbnail(false);
        console.log("Error generating thumbnail");
        return [];
      }
    } catch (error) {
      setGeneratingThumbnail(false);
      console.error("Error fetching data:", error);
      // You can handle the error here or rethrow it if needed
      throw error;
    }
  };

  useEffect(() => {
    // Get saved data from localStorage
    // localStorage.removeItem("lastGeneratedPost");
    // localStorage.removeItem("progress");
    const savedDataString = localStorage.getItem("lastGeneratedPost");

    // Check if there is any saved data
    if (!savedDataString) {
      console.log("No saved data found in localStorage");
      // Handle the case when there is no saved data
      return;
    }

    try {
      // Parse the JSON data from localStorage
      const savedData = JSON.parse(savedDataString);

      if (savedData) {
        console.log("Now serving from local storage", savedData);

        // Set the state with the data from localStorage
        // setLoadedLocalStorage(true); // Commented out as it is not clear from your code whether this state is needed
        setGeneratedYoutubePost(savedData);
        setSearchQuery(savedData.searchQuery);
        console.log("savedData.data.searchQuery", savedData.searchQuery);
        setLoadedYoutubePost(true);
      } else {
        console.log("Invalid or incomplete data in localStorage");
      }
    } catch (error) {
      console.error("Error parsing JSON from localStorage", error);
    }
  }, []);

  const setProgressInLocalStorage = (progress, videoId) => {
    localStorage.setItem("progress", `${progress}:${videoId}`);
  };

  const getProgressFromLocalStorage = () => {
    const progressString = localStorage.getItem("progress");
    if (progressString) {
      const [progress, videoId] = progressString.split(":");
      return { progress, videoId };
    }
    return null;
  };

  useEffect(() => {
    const progressInfo = getProgressFromLocalStorage();

    if (progressInfo) {
      const { progress, videoId } = progressInfo;

      // Reset all states to false initially
      setCreatingVideo(false);
      setVideoCreated(false);
      setVideoCreationFailed(false);
      setGeneratingSlides(false);
      setSlidesGenerated(false);
      setVideoRendered(false);
      setVideoRenderingFailed(false);
      setVideoRetrieved(false);
      setRetrievingVideo(false);

      // Set the corresponding state based on progress

      if (progress === "generateSlides") {
        setVideoCreated(true);
      } else if (progress === "render") {
        setSlidesGenerated(true);
      } else if (progress === "retrieve") {
        setVideoRendered(true);
      } else if (progress === "display") {
        setVideoRetrieved(true);
      }

      // ... (set other states based on your progress)
    }
  }, []);

  const handleGetIdeas = async () => {
    setLoadedYoutubePost(false);
    if (!searchQuery.trim()) {
      return;
    }

    const postData = {
      idea: searchQuery,
    };

    console.log("postData", postData);

    try {
      setIsLoading(true);
      // console.log("handleGetIdeas", decryptedFullData.token);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/generateYoutubePost`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            // Authorization: `Bearer ${decryptedFullData.token}`,
          },
        },
      );

      const data = response.data.data;
      console.log("response", data);
      setIsLoading(false);

      // Create a copy of data.data and update it with searchQuery
      const updatedData = { ...data, searchQuery };

      // Update state with the API response
      setGeneratedYoutubePost(updatedData);
      setInputValue(updatedData.videoScript);

      // Save the entire data object to localStorage
      localStorage.setItem("lastGeneratedPost", JSON.stringify(updatedData));

      setLoadedYoutubePost(true);
      generateThumbnail(updatedData.thumbnail);
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

  const handleCopyToClipboard = (content, section) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopiedStates((prevStates) => ({
          ...prevStates,
          [section]: true,
        }));

        // Reset the copied state after a certain duration
        setTimeout(() => {
          setCopiedStates((prevStates) => ({
            ...prevStates,
            [section]: false,
          }));
        }, 2000);
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDownload = () => {
    if (generatedThumbnail) {
      const downloadLink = document.createElement("a");
      downloadLink.href = generatedThumbnail;
      downloadLink.download = "generated_thumbnail.png";
      downloadLink.click();
    }
  };

  const handleGenerateOptionChange = (event) => {
    const selectedOption = event.target.value;
    setTextSource(selectedOption);
    console.log(`Selected option: ${selectedOption}`);
  };

  const fetchVideoTemplates = async () => {
    setLoadingVideoTemplates(true);
    const templates = await getVideoTemplates();
    if (templates === null) {
      setLoadingVideoTemplates(false);
    }
    setVideoTemplates(templates);
    setLoadingVideoTemplates(false);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleTextSourceChange = (source) => {
    setTextSource(source);
    setInputValue(""); // Clear input value when switching between text and URL
  };

  // const convertToVideo = async () => {
  //   setCreatingVideo(true);
  //   const convertVideo = await generateVideo(textSource, selectedVideoTemplate.templateId);
  //   if (convertVideo !== null) {
  //     const video_id = convertVideo._id;
  //     const renderingVideo = await renderVideo(video_id);
  //     if (renderingVideo !== null) {
  //       const isAccepted = renderingVideo.accepted;
  //       if (isAccepted) {
  //   setCreatingVideo(false);
  //         setRenderingVideo(true)
  //         setTimeout(() => {
  //           const retrievingVideo = retrieveVideo(video_id);
  //           if (retrievingVideo !== null) {
  //             const readyVideoId = retrievingVideo._id;
  //             if (readyVideoId)
  //           }
  //         }, )
  //       }
  //     }
  //   }
  // }

  const createVideo = async () => {
    setCreatingVideo(true);

    try {
      const convertVideo = await generateVideo(
        textSource,
        textSource === "text" ? generatedYoutubePost.videoScript : inputValue,
        selectedVideoTemplate.templateId,
      );

      if (convertVideo !== null) {
        // alert(convertVideo._id);
        const videoId = convertVideo._id;
        localStorage.setItem("videoCreatedId", videoId);
        setProgressInLocalStorage("create", videoId);
        setCreatingVideo(false);
        setVideoCreated(true);
        return videoId;
      } else {
        setCreatingVideo(false);
        setVideoCreationFailed(true);
        return null;
      }
    } catch (error) {
      console.error("Error during video creation:", error);
      setCreatingVideo(false);
      setVideoCreationFailed(true);
      return null;
    }
  };

  const generateSlides = async () => {
    const videoCreatedId = localStorage.getItem("videoCreatedId");
    setGeneratingSlides(true);

    try {
      // alert(`generate slides for ${videoCreatedId}`)
      const generatingSlides = await generateVideoSlides(videoCreatedId);

      if (generatingSlides !== null && generatingSlides.status === "draft") {
        setGeneratingSlides(false);
        setSlidesGenerated(true);
        setVideoCreated(false);
        setProgressInLocalStorage("generateSlides", videoCreatedId);
        return true;
      } else {
        setVideoCreated(false);
        setGeneratingSlides(false);
        setSlidesGeneratingFailed(true);
        return false;
      }
    } catch (error) {
      console.error("Error during video rendering:", error);
      setSlidesGeneratingFailed(true);
      setGeneratingSlides(false);
      return false;
    }
  };

  const renderCreatedVideo = async () => {
    const videoCreatedId = localStorage.getItem("videoCreatedId");
    setRenderingVideo(true);

    try {
      const renderingVideo = await renderVideo(videoCreatedId);

      if (renderingVideo !== null && renderingVideo.accepted) {
        setRenderingVideo(false);
        setSlidesGenerated(false);
        setVideoRendered(true);
        setProgressInLocalStorage("render", videoCreatedId);
        return true;
      } else {
        setSlidesGenerated(false);
        setRenderingVideo(false);
        setVideoRenderingFailed(true);
        return false;
      }
    } catch (error) {
      console.error("Error during video rendering:", error);
      setVideoRenderingFailed(true);
      setRenderingVideo(false);
      return false;
    }
  };

  const retrieveReadyVideo = async (attemptCount = 0) => {
    setRetrievingVideo(true);
    if (attemptCount >= 5) {
      console.error("Max attempts reached. Unable to retrieve ready video.");
      setVideoRetrievalFailed(true);
      return null;
    }

    const videoCreatedId = localStorage.getItem("videoCreatedId");

    try {
      const retrievingVideo = await retrieveVideo(videoCreatedId);

      if (
        retrievingVideo !== null &&
        retrievingVideo.url !== null &&
        retrievingVideo.url !== undefined
      ) {
        const readyVideoId = retrievingVideo._id;
        console.log("Ready Video ID:", readyVideoId);

        const readyVideoUrl = retrievingVideo.url;
        console.log("Ready Video URL:", readyVideoUrl);
        localStorage.setItem("readyVideoUrl", readyVideoUrl);
        setVideoRendered(false);
        setVideoRetrieved(true);
        setRetrievingVideo(false);
        setProgressInLocalStorage("retrieve", videoCreatedId);
        return readyVideoUrl;
      } else {
        setTimeout(() => retrieveReadyVideo(attemptCount + 1), 3 * 60 * 1000);
        return null;
      }
    } catch (error) {
      console.error("Error during video retrieval:", error);
      setVideoRendered(false);
      setVideoRetrievalFailed(true);
      setRetrievingVideo(false);
      return null;
    }
  };

  const videoProcessFailed = (message) => {
    return (
      <div className="text-xs text-red-500 font-semibold mt-5">
        {`${message}. Please try again`}
      </div>
    );
  };

  const handleVideoDownload = () => {
    const anchor = document.createElement("a");
    anchor.href = localStorage.getItem("readyVideoUrl");
    anchor.download = "downloaded-video.mp4";
    anchor.click();
  };

  return (
    <section className={`w-full z-50 ${display} min-h-screen`}>
      <div className="m-2 md:m-10 mt-10 p-2 md:p-10 rounded-3xl">
        <div>
          <div className="mb-10">
            <div className="pageTitle text-3xl font-semibold">
              AI Post Generator
            </div>
            <div className="tag text-md mt-2 text-xs font-thin">
              Generate your next youtube post with ease
            </div>
          </div>
          <header>
            <div className="flex items-center justify-center h-full mb-5 w-full">
              <div className="flex items-center flex-col w-1/2">
                <div className="w-full max-w-xs flex items-center p-2 pl-4 pr-4 border border-gray-300 bg-white rounded-full">
                  <input
                    type="text"
                    placeholder="Enter a topic to generate content on"
                    className="flex-grow bg-transparent outline-none pr-2 text-xs"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <BiSearch className="text-gray-500 text-xs" />
                </div>
              </div>

              <button
                className={`text-white rounded-full px-4 py-2 ml-4 text-xs flex items-center ${
                  isSearchEmpty
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "getIdeasButton"
                }`}
                onClick={handleGetIdeas}
                disabled={isSearchEmpty}
                style={{
                  background:
                    "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                  color: "white",
                }}
              >
                Generate Post{" "}
                {isLoading && (
                  <BiLoaderCircle className="ml-2 animate-spin" color="white" />
                )}
              </button>
            </div>
            <br />
            <hr />
          </header>

          {loadedYoutubePost ? (
            <div>
              <section className="flex gap-5">
                <div className="w-3/5">
                  <div className="m-2 mt-14 px-5 py-10 border-2 bg-white rounded-md w-full">
                    <header className="flex justify-between w-full">
                      <span className="font-semibold">Title</span>
                      <span className="relative">
                        <IoCopy
                          className="ml-2 text-gray-500 cursor-pointer"
                          color="#514FB2"
                          onClick={() =>
                            handleCopyToClipboard(
                              generatedYoutubePost.title,
                              "title",
                            )
                          }
                          data-tip="Copy to Clipboard"
                        />
                        <Tooltip place="bottom" type="dark" effect="solid" />

                        {copiedStates.title && (
                          <div
                            className="absolute right-0 text-white px-2 py-1 rounded mt-2"
                            style={{ backgroundColor: "#7438FF" }}
                          >
                            Copied!
                          </div>
                        )}
                      </span>
                    </header>
                    <div className="mt-3 text-sm   text-gray-500 font-medium">
                      {generatedYoutubePost.title}
                    </div>
                  </div>

                  <div className="section1 m-2 mt-5 px-5 py-10 border-2 bg-white rounded-md w-full">
                    <header className="flex justify-between w-full">
                      <span className="font-semibold">Description</span>
                      <span className="relative">
                        <IoCopy
                          className="ml-2 text-gray-500 cursor-pointer"
                          color="#514FB2"
                          onClick={() =>
                            handleCopyToClipboard(
                              generatedYoutubePost.description,
                              "description",
                            )
                          }
                          data-tip="Copy to Clipboard"
                        />
                        <Tooltip place="bottom" type="dark" effect="solid" />

                        {copiedStates.description && (
                          <div
                            className="absolute right-0 text-white px-2 py-1 rounded mt-2"
                            style={{ backgroundColor: "#7438FF" }}
                          >
                            Copied!
                          </div>
                        )}
                      </span>
                    </header>
                    <div className="mt-5 text-xs text-gray-700 ">
                      {generatedYoutubePost.description}
                    </div>
                  </div>

                  <div className="section1 m-2 mt-5 px-5 py-10 border-2 bg-white rounded-md w-full">
                    <header className="flex justify-between w-full">
                      <span className="font-semibold">Tags</span>
                      <span className="relative">
                        <IoCopy
                          className="ml-2 text-gray-500 cursor-pointer"
                          color="#514FB2"
                          onClick={() =>
                            handleCopyToClipboard(
                              generatedYoutubePost.tags,
                              "tags",
                            )
                          }
                          data-tip="Copy to Clipboard"
                        />
                        <Tooltip place="bottom" type="dark" effect="solid" />

                        {copiedStates.tags && (
                          <div
                            className="absolute right-0 text-white px-2 py-1 rounded mt-2"
                            style={{ backgroundColor: "#7438FF" }}
                          >
                            Copied!
                          </div>
                        )}
                      </span>
                    </header>
                    <div className={`flex flex-wrap mt-5`}>
                      <Tags
                        items={generatedYoutubePost.tags}
                        slice="false"
                        ml={0}
                      />
                    </div>
                  </div>

                  <div className="section1 m-2 mt-5 p-2 px-5 py-10 border-2 bg-white rounded-md w-full">
                    <header className="flex justify-between w-full">
                      <span className="font-semibold">Hashtags</span>
                      <span className="relative">
                        <IoCopy
                          className="ml-2 text-gray-500 cursor-pointer"
                          color="#514FB2"
                          onClick={() =>
                            handleCopyToClipboard(
                              generatedYoutubePost.hashtags,
                              "hashtags",
                            )
                          }
                          data-tip="Copy to Clipboard"
                        />
                        <Tooltip place="bottom" type="dark" effect="solid" />

                        {copiedStates.hashtags && (
                          <div
                            className="absolute right-0 text-white px-2 py-1 rounded mt-2"
                            style={{ backgroundColor: "#7438FF" }}
                          >
                            Copied!
                          </div>
                        )}
                      </span>
                    </header>
                    <div className={`flex flex-wrap mt-10`}>
                      <Tags
                        items={generatedYoutubePost.hashtags}
                        slice="false"
                        ml={0}
                      />
                    </div>
                  </div>

                  <div className="section1 m-2 mt-5 p-2 px-5 py-10 border-2 bg-white rounded-md w-full">
                    <header className="flex justify-between w-full">
                      <span className="font-semibold">Keywords</span>
                      <span className="relative">
                        <IoCopy
                          className="ml-2 text-gray-700 cursor-pointer"
                          color="#514FB2"
                          onClick={() =>
                            handleCopyToClipboard(
                              generatedYoutubePost.keywords,
                              "keywords",
                            )
                          }
                          data-tip="Copy to Clipboard"
                        />
                        <Tooltip place="bottom" type="dark" effect="solid" />

                        {copiedStates.keywords && (
                          <div
                            className="absolute right-0 text-white px-2 py-1 rounded mt-2"
                            style={{ backgroundColor: "#7438FF" }}
                          >
                            Copied!
                          </div>
                        )}
                      </span>
                    </header>
                    <div className={`flex flex-wrap mt-10`}>
                      <Tags
                        items={generatedYoutubePost.keywords}
                        slice="false"
                        ml={0}
                      />
                    </div>
                  </div>

                  <div className="section1 m-2 mt-5 p-2 px-5 py-10 border-2 bg-white rounded-md w-full">
                    <div className="ml-2">
                      {generatedThumbnail ? (
                        <div>
                          <img
                            src={generatedThumbnail}
                            alt="Generated Thumbnail"
                            className="h-48 w-48"
                          />
                          <div
                            onClick={handleDownload}
                            className="mt-2 cursor-pointer text-xs font-bold py-2 px-4 rounded"
                          >
                            Download Thumbnail
                          </div>
                        </div>
                      ) : generatingThumbnail ? (
                        <Loader message={"Generating your Thumbnail"} />
                      ) : (
                        <button
                          onClick={() => {
                            generateThumbnail(generatedYoutubePost.thumbnail);
                          }}
                          className="mt-2 cursor-pointer text-xs font-bold py-2 px-4 rounded"
                          style={{
                            background:
                              "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                            color: "white",
                          }}
                        >
                          Generate Thumbnail
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="section1 m-2 mt-5 p-2 px-5 py-10 border-2 bg-white rounded w-full">
                    <header className="flex justify-between w-full">
                      <span className="font-semibold">Generate Video</span>
                      <span className="relative">
                        <select
                          name="generateOption"
                          id="generateOption"
                          onChange={(e) => handleGenerateOptionChange(e)}
                        >
                          <option value="text">Text</option>
                          <option value="url">URL</option>
                        </select>
                      </span>
                    </header>

                    {creatingVideo ? (
                      <Loader message={"Creating your Video. Hang in there."} />
                    ) : generatingSlides ? (
                      <Loader
                        message={
                          "We are generating Slides for your video. Please hold on"
                        }
                      />
                    ) : renderingVideo ? (
                      <Loader message={"We are now rendering your Video"} />
                    ) : retrievingVideo ? (
                      <Loader
                        message={
                          "We are building the final part of your Video. Hang in there. This will take a few minutes"
                        }
                      />
                    ) : videoCreated ? (
                      <div className="w-full flex flex-col justify-center items-center mt-5">
                        <button
                          className={`py-2 px-3 rounded mt-5 text-xs`}
                          style={{
                            background:
                              "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                            color: "white",
                          }}
                          onClick={generateSlides}
                        >
                          Generate your Video slides
                        </button>
                        {slidesGeneratingFailed &&
                          videoProcessFailed("Your video slides wasnt created")}
                      </div>
                    ) : slidesGenerated ? (
                      <div className="w-full flex flex-col justify-center items-center mt-5">
                        <button
                          className={`py-2 px-3 rounded mt-5 text-xs`}
                          style={{
                            background:
                              "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                            color: "white",
                          }}
                          onClick={renderCreatedVideo}
                        >
                          Render your Video
                        </button>
                        {videoRenderingFailed &&
                          videoProcessFailed(
                            "Your video wasnt able to be rendered",
                          )}
                      </div>
                    ) : videoRendered ? (
                      <div className="w-full flex flex-col justify-center items-center mt-5">
                        <button
                          className={`py-2 px-3 rounded mt-5 text-xs`}
                          style={{
                            background:
                              "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                            color: "white",
                          }}
                          onClick={() => retrieveReadyVideo()}
                        >
                          Display your Video
                        </button>
                        {videoRetrievalFailed &&
                          videoProcessFailed(
                            "We couldn't get your video to display",
                          )}
                      </div>
                    ) : videoRetrieved ? (
                      <div className="w-full flex flex-col justify-center items-center">
                        <video width="400" controls className="rounded">
                          <source
                            src={localStorage.getItem("readyVideoUrl")}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                        <button
                          onClick={handleVideoDownload}
                          className="py-2 px-3 mb-3 mt-3 rounded text-xs"
                          style={{
                            background:
                              "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                            color: "white",
                          }}
                        >
                          Download Video
                        </button>
                        <br />
                        <button
                          onClick={() => setVideoRetrieved(false)}
                          className="py-2 px-3 mb-3 rounded text-xs"
                          style={{
                            background:
                              "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                            color: "white",
                          }}
                        >
                          Generate another Video
                        </button>
                      </div>
                    ) : (
                      <div className="mt-5 flex flex-col justify-center items-center">
                        {textSource === "text" ? (
                          <textarea
                            name=""
                            id=""
                            rows="10"
                            value={inputValue}
                            onChange={handleInputChange}
                            style={{
                              border: "#E5E4E2 1px solid",
                              width: "98%",
                            }}
                            className="p-5 text-xs"
                            readOnly
                          ></textarea>
                        ) : (
                          <input
                            type="text"
                            placeholder="www.yourlivepost.com/blog-title"
                            value={inputValue}
                            onChange={handleInputChange}
                            className="text-xs h-10 border-1 border-gray-500 rounded-md p-5"
                            style={{
                              border: "#E5E4E2 1px solid",
                              width: "98%",
                            }}
                          />
                        )}
                        {videoTemplates ? (
                          <div className="w-full flex flex-col justify-center items-center mt-5">
                            <div className={`flex flex-wrap`}>
                              {videoTemplates.map((item, index) => (
                                <div key={index} className="m-2 flex">
                                  <div
                                    className="rounded-md bg-gray-200 p-2 cursor-pointer"
                                    style={{
                                      backgroundColor: `${
                                        selectedVideoTemplate.index === index
                                          ? "#9999FF"
                                          : "#EAEAF5"
                                      }`,
                                    }}
                                    onClick={() =>
                                      setSelectedVideoTemplate(
                                        (prevSelected) => ({
                                          ...prevSelected,
                                          index,
                                          templateId: item._id,
                                        }),
                                      )
                                    }
                                  >
                                    <img
                                      src={item.thumbnail}
                                      alt=""
                                      className="h-20"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button
                              className={`py-2 px-3 rounded-full mt-5 text-xs ${
                                selectedVideoTemplate.index === null
                                  ? "bg-gray-600 cursor-not-allowed"
                                  : ""
                              }`}
                              style={{
                                background:
                                  "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                                color: "white",
                              }}
                              disabled={selectedVideoTemplate === null}
                              onClick={createVideo}
                            >
                              Convert {textSource.toUpperCase()} to Video
                            </button>
                            {/* {selectedVideoTemplate.templateId === "" &&
                              videoProcessFailed(
                                "Please select a template from above",
                              )} */}
                            {videoCreationFailed &&
                              videoProcessFailed("Video creation Failed")}
                          </div>
                        ) : loadingVideoTemplates ? (
                          <Loader message={"Loading Templates for you"} />
                        ) : (
                          <button
                            onClick={() => fetchVideoTemplates()}
                            className="mt-5 cursor-pointer text-xs font-bold py-2 px-4 rounded"
                            style={{
                              background:
                                "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                              color: "white",
                            }}
                          >
                            Load Templates
                          </button>
                        )}
                      </div>
                    )}
                    {/* <video width="400" controls>
                          <source src={"https://apis.elai.io/public/video/656f3f1d460620328d0ebe31.mp4?s=f959272f4ebb6c2589a2a314d3c0818fd7e1bac8ebc0836a88af893e3643a261"} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video> */}
                  </div>
                </div>
                <div className="section2 m-2 mt-14 p-2 px-5 py-10 border-2 bg-white rounded-md w-2/5">
                  <header className="flex justify-between w-full">
                    <span className="font-semibold">Video Script</span>
                    <span className="relative">
                      <IoCopy
                        className="ml-2 text-gray-500 cursor-pointer"
                        color="#514FB2"
                        onClick={() =>
                          handleCopyToClipboard(
                            generatedYoutubePost.script,
                            "script",
                          )
                        }
                        data-tip="Copy to Clipboard"
                      />
                      <Tooltip place="bottom" type="dark" effect="solid" />

                      {copiedStates.script && (
                        <div
                          className="absolute right-0 text-white px-2 py-1 rounded mt-2"
                          style={{ backgroundColor: "#7438FF" }}
                        >
                          Copied!
                        </div>
                      )}
                    </span>
                  </header>
                  <div
                    className="mt-3 text-xs text-gray-700"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {generatedYoutubePost.script}
                  </div>
                  {/* <div>{generatedYoutubePost.script}</div> */}
                </div>
              </section>
            </div>
          ) : isLoading ? (
            <Loader />
          ) : (
            <div className="flex m-auto w-full justify-center items-center mt-48">
              <img src={TDLogo} alt="" className="h-8 mr-3 my-auto" />
              Use search bar to generate Youtube post for your Idea
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AiPostGenerator;
