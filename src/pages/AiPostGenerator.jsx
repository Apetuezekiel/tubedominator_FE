import { BiArrowBack, BiLoaderCircle, BiSearch } from "react-icons/bi";
import axios from "axios";
import { useEffect } from "react";
import { userFullDataDecrypted } from "../data/api/calls";
import { useState } from "react";
import Loader from "../components/Loader";
import { IoCopy } from "react-icons/io5";
import showToast from "../utils/toastUtils";
import { Tooltip } from "react-tooltip";

function AiPostGenerator({ display }) {
  const decryptedFullData = userFullDataDecrypted();
  const [generatedYoutubePost, setGeneratedYoutubePost] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(null);
  const [loadedYoutubePost, setLoadedYoutubePost] = useState(false);
  const [copiedStates, setCopiedStates] = useState({
    title: false,
    script: false,
    description: false,
    // Add more sections as needed
  });

  const isSearchEmpty = searchQuery.trim() === "";

  useEffect(() => {
    // Get saved data from localStorage
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
      console.log("handleGetIdeas", decryptedFullData.token);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/generateYoutubePost`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            Authorization: `Bearer ${decryptedFullData.token}`,
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

      // Save the entire data object to localStorage
      localStorage.setItem("lastGeneratedPost", JSON.stringify(updatedData));

      setLoadedYoutubePost(true);
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

  return (
    <section className={`w-full z-50 ${display}`}>
      <div className="m-2 md:m-10 mt-10 p-2 md:p-10 rounded-3xl">
        <div>
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
                              generatedYoutubePost.script,
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
                      {generatedYoutubePost.tags.map((item, index) => (
                        <div key={index} className="m-2">
                          <div className="flex rounded-full bg-gray-200 p-2">
                            <div className="bg-gray-300 rounded-full px-3 py-1 text-xs text-gray-700">
                              {item}
                            </div>
                          </div>
                        </div>
                      ))}
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
                      {generatedYoutubePost.hashtags.map((item, index) => (
                        <div key={index} className="m-2">
                          <div className="flex rounded-full bg-gray-200 p-2">
                            <div className="bg-gray-300 rounded-full px-3 py-1 text-xs text-gray-700">
                              {item}
                            </div>
                          </div>
                        </div>
                      ))}
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
                      {generatedYoutubePost.keywords.map((item, index) => (
                        <div key={index} className="m-2">
                          <div className="flex rounded-full bg-gray-200 p-2">
                            <div className="bg-gray-300 rounded-full px-3 py-1 text-xs text-gray-700">
                              {item}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
                </div>
              </section>

              {/* <section className="flex gap-2">
                <div className="section1 m-2 mt-5 p-2 px-5 py-10 border-2 bg-white rounded-md w-3/5"> 
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
                    {generatedYoutubePost.hashtags.map((item, index) => (
                      <div key={index} className="m-2">
                        <div className="flex rounded-full bg-gray-200 p-2">
                          <div className="bg-gray-300 rounded-full px-3 py-1 text-xs text-gray-700">
                            {item}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="section1 m-2 mt-5 p-2 px-5 py-10 border-2 bg-white rounded-md w-2/5">
                  <header className="flex justify-between w-full">
                    <span className="font-semibold">Keywords</span>
                    <span className="relative">
                      <IoCopy
                        className="ml-2 text-gray-700 cursor-pointer"
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
                    {generatedYoutubePost.keywords.map((item, index) => (
                      <div key={index} className="m-2">
                        <div className="flex rounded-full bg-gray-200 p-2">
                          <div className="bg-gray-300 rounded-full px-3 py-1 text-xs text-gray-700">
                            {item}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section> */}
            </div>
          ) : isLoading ? (
            <Loader />
          ) : (
            <div className="flex m-auto w-full justify-center items-center mt-20">
              Use search bar to generate Youtube post for your Idea
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AiPostGenerator;
