/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { FaYoutube } from "react-icons/fa";
import { Header } from "../components";
import { HiOutlineRefresh } from "react-icons/hi";
import {
  useAllUserDeets,
  useUserAuthToken,
  useUserData,
  useUserYoutubeInfo,
} from "../state/state";
import { useKeywordStore } from "../state/state";
import CryptoJS from "crypto-js";
import Spinner from "../components/Spinner";
import { getAllYoutubePosts, userFullDataDecrypted } from "../data/api/calls";
import showToast from "../utils/toastUtils";
import { BiChevronDown, BiEdit, BiTrendingUp } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import Opitimize from "../components/Opitimize";
import Loader from "../components/Loader";
import { formatNumberToKMBPlus } from "../data/helper-funtions/helper";
import { FiEye } from "react-icons/fi";

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

  const userYoutubeData = useUserYoutubeInfo((state) => state.userYoutubeData);
  const setUserYoutubeData = useUserYoutubeInfo(
    (state) => state.setUserYoutubeData,
  );
  const exactKeywordData = useKeywordStore((state) => state.exactKeywordData);
  const allUserDeets = useAllUserDeets((state) => state.allUserDeets);
  const setAllUserDeets = useAllUserDeets((state) => state.setAllUserDeets);
  const userData = useUserData((state) => state.userData);
  const setUserData = useUserData((state) => state.setUserData);
  const clerkUser = JSON.parse(localStorage.getItem("clerkUser"));
  const userAuthToken = useUserAuthToken((state) => state.userAuthToken);
  const setUserAuthToken = useUserAuthToken((state) => state.setUserAuthToken);
  const decryptedFullData = userFullDataDecrypted();
  const [isUserDataLoaded, setIsuserDataLoaded] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [selectedVideoLikeCount, setSelectedVideoLikeCount] = useState("");
  const [selectedVideoCommentCount, setSelectedVideoCommentCount] =
    useState("");
  const [selectedVideoViewCount, setSelectedVideoViewCount] = useState("");
  const [userPlaylistData, setUserPlaylistData] = useState([]);
  console.log("decryptedFullData OptimizationPage", decryptedFullData);
  const navigate = useNavigate();
  const [isOptimizeVideo, setIsOptimizeVideo] = useState(false);

  function removeUndefinedOrNull(arr) {
    return arr.filter((item) => item !== undefined && item !== null);
  }

  const data = [
    {
      categoryId: "27",
      channelId: "UCIaJua9IU_Db15LKAaq_ZYw",
      channelTitle: "Zicstack",
      commentCount: "50",
      description: 'Today Service is tagged "Holy Ghost Night of"',
      favoriteCount: "100000",
      likeCount: "454230",
      liveBroadcastContent: "none",
      madeForKids: true,
      player:
        '<iframe width="480" height="270" src="//www.youtube.com/embed/tlPt5_0DFsY" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      playlists: [
        { id: 1, title: "Playlist 1" },
        { id: 2, title: "Playlist 2" },
        { id: 3, title: "Playlist 3" },
        { id: 4, title: "Playlist 4" },
        { id: 5, title: "Playlist 5" },
      ],
      privacyStatus: "public",
      publicStatsViewable: true,
      publishedAt: "2022-02-24T15:25:25Z",
      thumbnails: {
        url: "https://i.ytimg.com/vi/tlPt5_0DFsY/sddefault.jpg",
        width: 640,
        height: 480,
      },
      title: "Church with the Holy Ghost",
      topicCategories: ["https://en.wikipedia.org/wiki/Religion"],
      uploadStatus: "processed",
      videoId: "tlPt5_0DFsY",
      viewCount: "900000",
    },
    {
      categoryId: "15",
      channelId: "UCAnotherChannelID",
      channelTitle: "AnotherChannelTitle",
      commentCount: "10",
      description: "Another video description",
      favoriteCount: "5",
      likeCount: "5",
      liveBroadcastContent: "none",
      madeForKids: false,
      player:
        '<iframe width="480" height="270" src="//www.youtube.com/embed/AnotherVideoID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      playlists: [
        { id: 6, title: "Another Playlist 1" },
        { id: 7, title: "Another Playlist 2" },
      ],
      privacyStatus: "private",
      publicStatsViewable: false,
      publishedAt: "2022-03-15T12:45:30Z",
      thumbnails: {
        url: "https://i.ytimg.com/vi/AnotherVideoID/sddefault.jpg",
        width: 720,
        height: 480,
      },
      title: "Another Video Title",
      topicCategories: ["https://en.wikipedia.org/wiki/Technology"],
      uploadStatus: "processed",
      videoId: "tlPt5_0DFsY",
      viewCount: "5",
    },
  ];

  useEffect(() => {
    console.log("allUserDeetsallUserDeetsallUserDeets", decryptedFullData);
    let isMounted = true;

    const fetchMyYoutubeInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/fetchMyYoutubeInfo`,
          {
            params: {
              channel_id: decryptedFullData.channelId,
            },
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.REACT_APP_X_API_KEY,
              Authorization: `Bearer ${decryptedFullData.token}`,
              gToken: decryptedFullData.gToken,
            },
          },
        );

        console.log("response I am inte", response);
        if (response.data.success) {
          const gottenYoutubePosts = await getAllYoutubePosts();
          const updatedData = response.data.data.map((item1, index1) => {
            // Initialize item2 here to make it accessible in the entire map function
            const item2 = gottenYoutubePosts.find(
              (item2) => item1.videoId === item2.video_id,
            );

            if (item2) {
              const analyzedVideoPerformance = analyzeVideoPerformance(
                item2.likeCount,
                item1.likeCount,
                item2.commentCount,
                item1.commentCount,
                item2.viewCount,
                item1.viewCount,
              );

              console.log(
                "analyzedVideoPerformanceeeeeeeeee",
                analyzedVideoPerformance,
                item2.likeCount,
                item1.likeCount,
                item2.commentCount,
                item1.commentCount,
                item2.viewCount,
                item1.viewCount,
              );

              return {
                ...item1,
                optimizationPercentage:
                  analyzedVideoPerformance.optimizationPercentage,
                optimizationImpact: analyzedVideoPerformance.optimizationImpact,
              };
            }

            // If a match is not found, return the original item1
            return item1;
          });

          console.log("updatedData", updatedData);

          // Assuming setUserYoutubeData is a function to set the updated data
          setUserYoutubeData(updatedData);
          setIsuserDataLoaded(true);
        } else {
          console.error("Error fetching data:");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchMyPlaylists = async () => {
      try {
        axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/fetchMyPlaylists`, {
            params: {
              channel_id: decryptedFullData.channelId,
            },
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.REACT_APP_X_API_KEY,
              Authorization: `Bearer ${decryptedFullData.token}`,
              gToken: decryptedFullData.gToken,
            },
          })
          .then((response) => {
            if (isMounted) {
              setUserPlaylistData(response.data);
              console.log(
                "User Youtube Playlists Optimization page",
                response.data,
              );
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            showToast("error", error.message, 2000);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("error", error.message, 2000);
      }
    };

    fetchMyPlaylists();
    fetchMyYoutubeInfo();

    return () => {
      // Cleanup function to be called when the component is unmounted
      isMounted = false;
    };
  }, []);

  const analyzeVideoPerformance = (
    oldLikeCount,
    newLikeCount,
    oldCommentCount,
    newCommentCount,
    oldViewCount,
    newViewCount,
  ) => {
    // Calculate percentage changes
    const likeChangePercentage = calculatePercentageChange(
      oldLikeCount,
      newLikeCount,
    );
    const commentChangePercentage = calculatePercentageChange(
      oldCommentCount,
      newCommentCount,
    );
    const viewChangePercentage = calculatePercentageChange(
      oldViewCount,
      newViewCount,
    );

    // Calculate optimizationPercentage
    const optimizationPercentage = calculateOptimizationPercentage(
      likeChangePercentage,
      commentChangePercentage,
      viewChangePercentage,
    );

    // Determine optimization impact
    const optimizationImpact = calculateOptimizationImpact(
      likeChangePercentage,
      commentChangePercentage,
      viewChangePercentage,
    );

    // Return the results
    return {
      optimizationPercentage,
      optimizationImpact,
    };
  };

  function calculatePercentageChange(oldValue, newValue) {
    if (oldValue === 0) {
      return newValue !== 0 ? 100 : 0;
    }

    const percentageChange = ((newValue - oldValue) / Math.abs(oldValue)) * 100;
    return parseFloat(percentageChange.toFixed(2));
  }

  const calculateOptimizationPercentage = (
    likeChangePercentage,
    commentChangePercentage,
    viewChangePercentage,
  ) => {
    const absoluteLikeChange = Math.abs(likeChangePercentage);
    const absoluteCommentChange = Math.abs(commentChangePercentage);
    const absoluteViewChange = Math.abs(viewChangePercentage);

    const averageChange =
      (absoluteLikeChange + absoluteCommentChange + absoluteViewChange) / 3;

    // Cap the value at 100
    const cappedPercentage = Math.min(averageChange, 100);

    return parseFloat(cappedPercentage.toFixed(2));
  };

  function calculateOptimizationImpact(
    likeChangePercentage,
    commentChangePercentage,
    viewChangePercentage,
  ) {
    const overallChange =
      Math.abs(likeChangePercentage) +
      Math.abs(commentChangePercentage) +
      Math.abs(viewChangePercentage);

    if (overallChange < 5) {
      return "Low";
    } else if (overallChange < 15) {
      return "Medium";
    } else {
      return "High";
    }
  }

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

  const optimizeVideo = (props) => {
    setIsOptimizeVideo(true);
    setSelectedVideoId(props.videoId);
    setSelectedVideoLikeCount(props.likeCount);
    setSelectedVideoCommentCount(props.commentCount);
    setSelectedVideoViewCount(props.viewCount);
  };

  const ThumbnailTitleTemplate = (props) => {
    console.log("propsppp 23323323332", props);
    return (
      <div>
        <div className="flex justify-start items-center">
          <img
            src={props.thumbnails.url}
            alt="Thumbnail"
            style={{ width: "100px", height: "80px" }}
          />
          <div className="ml-3">
            <div className="whitespace-normal mt-4 mb-3 flex">
              {props.title}
            </div>
            <div className="text-gray-500 italic">Public</div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span
            className="flex justify-center items-center cursor-pointer"
            onClick={() => optimizeVideo(props)}
          >
            <span className="text-gray-500 hover:text-black">Optimize</span>
            <span className="ml-1 text-purple-600">
              <BiEdit />
            </span>
          </span>
          {/* <Link
            to="/optimization"
            className="flex justify-center items-center cursor-pointer"
          >
            <span className="text-gray-500 hover:text-black">Reportings</span>
            <span className="ml-1 text-purple-600">
              <BiTrendingUp />
            </span>
          </Link> */}
          <Link
            to={`https://www.youtube.com/watch?v=${props.videoId}`}
            className="flex justify-center items-center cursor-pointer"
          >
            <span className="text-gray-500 hover:text-black">View on YT</span>
            <span className="ml-1 text-red-600">
              <FaYoutube />
            </span>
          </Link>
        </div>
      </div>
    );
  };

  function formatNumberToKPlus(number) {
    if (number >= 1000) {
      const formattedNumber = Math.floor(number / 1000);
      return formattedNumber + "k+";
    } else {
      return number.toString();
    }
  }

  const viewCountTemplate = (props) => {
    const formatedNumber = formatNumberToKMBPlus(props.viewCount);
    // const icon = <FiEye size={15} color="#E87A00" className="mr-2" />;
    return (
      <div className="flex items-center">
        {/* {icon} */}
        {formatedNumber}
      </div>
    );
  };

  const viewCountHeaderTemplate = (props) => {
    const icon = <FiEye size={15} color="#E87A00" className="mr-2" />;
    return (
      <div className="flex items-center">
        {icon}
        {props.headerText}
      </div>
    );
  };

  const gridOrderOptimizationLevel = (props) => {
    const roundedPercentage = Math.round(props.optimizationPercentage);
    const percentageWidth = `${roundedPercentage}%`;

    return (
      <div className="h-10 w-full rounded-md flex flex-row items-center justify-between">
        <div
          className="h-full w-80 rounded-md mr-2"
          style={{ backgroundColor: "#DCDCFF" }}
        >
          <div
            className="h-full rounded-tl-md rounded-bl-md flex items-center justify-center"
            style={{ width: percentageWidth, background: "#C8C8FF" }}
          >
            <span
              className="text-xs text-gray-700"
              style={{
                fontFamily: "Work Sans",
                fontSize: "13px",
                fontWeight: 400,
                lineHeight: "15px",
                letterSpacing: "0em",
                textAlign: "left",
              }}
            >
              {roundedPercentage}%
            </span>
          </div>
        </div>
      </div>
    );
  };

  const gridOrderOptimizationImpact = (props) => {
    return props.optimizationImpact === "Low" ? (
      <div className="h-5 w-full rounded-full flex flex-row items-center justify-between">
        <div className="h-full bg-gray-300 w-full rounded-full mr-2">
          <div className="h-full w-10 bg-purple-600 rounded-full">
            <span className="w-20 text-xs ml-3 text-white">Low</span>
          </div>
        </div>
      </div>
    ) : props.optimizationImpact === "Medium" ? (
      <div className="h-5 w-full rounded-full flex flex-row items-center justify-between">
        <div className="h-full bg-gray-300 w-full rounded-full mr-2">
          <div className="h-full w-40 bg-purple-600 rounded-full">
            <span className="w-20 text-xs text-white ml-7">Med</span>
          </div>
        </div>
      </div>
    ) : props.optimizationImpact === "High" ? (
      <div className="h-5 w-full rounded-full flex flex-row items-center justify-between">
        <div className="h-full bg-gray-300 w-full rounded-full mr-2">
          <div className="h-full w-60 bg-purple-600 rounded-full">
            <span className="w-20 text-xs ml-3 text-white text-center">
              High
            </span>
          </div>
        </div>
      </div>
    ) : (
      "N/A"
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

  const formatViews = (props) => {
    const estimatedViews = parseInt(props.estimated_views);
    return <span>{estimatedViews}+</span>;
  };

  const gridInstance = React.createRef();

  const exportToExcel = () => {
    if (gridInstance.current) {
      gridInstance.current.excelExport();
    }
  };

  const [countries, setCountries] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("https://restcountries.com/v2/all?fields=name")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
      });
  }, []);

  return (
    <div>
      {isOptimizeVideo ? (
        selectedVideoId && (
          <Opitimize
            videoId={selectedVideoId}
            likeCount={selectedVideoLikeCount}
            commentCount={selectedVideoCommentCount}
            viewCount={selectedVideoViewCount}
          />
        )
      ) : (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 rounded-md overflow-hidden">
          <div className="flex justify-between">
            <div className="w-full flex py-2">
              <div className="flex w-full justify-between items-center">
                <div className="">
                  <div className="pageTitle text-3xl font-semibold">
                    Optimization
                  </div>
                  <div className="tag text-md mt-2 text-xs font-thin">
                    Implement our optimization recommendations to increase your
                    organic reach
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <div className="bg-white rounded-full border border-gray-300 px-4 py-2 flex items-center mr-4">
                    <select
                      id="mySelect"
                      // value={this.state.selectedOption}
                      // onChange={this.handleChange}
                      className="text-xs outline-none"
                    >
                      <option value=""> Visibility (All)</option>
                      {/* <option className="text-xs" value="Public Videos">
                      Public Videos
                    </option>
                    <option className="text-xs" value="Private Videos">
                      Private Videos
                    </option>
                    <option className="text-xs" value="Unlisted Videos">
                      Unlisted Videos
                    </option> */}
                    </select>
                  </div>
                  <div className="bg-white rounded-full border border-gray-300 px-4 py-2 flex items-center mr-4">
                    <select
                      id="mySelect"
                      // value={this.state.selectedOption}
                      // onChange={this.handleChange}
                      className="text-xs outline-none"
                    >
                      <option value="">Playlists (All)</option>
                      {userPlaylistData.map((playlist, index) => (
                        <option
                          className="text-xs"
                          key={index}
                          value={playlist.title}
                        >
                          {playlist.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* <div className="w-52 text-sm h-80">
              <div
                onClick={() => setOpen(!open)}
                className={`bg-white w-full p-2 flex items-center justify-between rounded-full border border-gray-300 ${
                  !selected && "text-gray-700"
                }`}
              >
                {selected
                  ? selected?.length > 25
                    ? selected?.substring(0, 25) + "..."
                    : selected
                  : "Playlists (All)"}
                <BiChevronDown
                  size={20}
                  className={`${open && "rotate-180"}`}
                />
              </div>
              <ul
                className={`bg-white mt-2 overflow-y-auto ${
                  open ? "max-h-60" : "max-h-0"
                } `}
              >
                <div className="flex items-center px-2 sticky top-0 bg-white">
                  <AiOutlineSearch size={18} className="text-gray-700" />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) =>
                      setInputValue(e.target.value.toLowerCase())
                    }
                    placeholder="Search for your playlist"
                    className="placeholder:text-gray-700 p-2 outline-none"
                  />
                </div>
                {userPlaylistData?.map((playlist, index) => (
                  <li
                    key={index}
                    className={`p-2 text-sm hover:bg-sky-600 hover:text-white
            ${
              playlist?.title?.toLowerCase() === selected?.toLowerCase() &&
              "bg-sky-600 text-white"
            }
            ${
              playlist?.title?.toLowerCase().startsWith(inputValue)
                ? "block"
                : "hidden"
            }`}
                    onClick={() => {
                      if (
                        playlist?.title?.toLowerCase() !==
                        selected.toLowerCase()
                      ) {
                        setSelected(playlist?.title);
                        setOpen(false);
                        setInputValue("");
                      }
                    }}
                  >
                    {playlist?.title}
                  </li>
                ))}
              </ul>
            </div> */}
                  <div className="bg-white rounded-full border border-gray-300 px-4 py-2 flex items-center mr-4">
                    <select
                      id="mySelect"
                      // value={this.state.selectedOption}
                      // onChange={this.handleChange}
                      className="text-xs outline-none"
                    >
                      <option value=""> Time (All)</option>
                      <option className="text-xs" value="Last Week">
                        Last Week
                      </option>
                      <option className="text-xs" value="Last Month">
                        Last Month
                      </option>
                      <option className="text-xs" value="Last Week">
                        Last Year
                      </option>
                    </select>
                  </div>

                  {/* <div className="bg-white rounded-full border border-gray-300 px-4 py-2 flex items-center mr-4">
                  <span className="mr-2 text-xs">Updated on YT</span>
                  <HiOutlineChevronDown />
                </div>
                <div className="bg-white rounded-full border border-gray-300 px-4 py-2 flex items-center mr-4">
                  <span className="mr-2 text-xs">Drafts</span>
                  <HiOutlineChevronDown />
                </div> */}
                </div>
              </div>
            </div>
            {/* IMPORTANT COMMENT */}
            {/* <div className="w-1/4 flex justify-end py-2">
              <div className="flex items-center w-2/4 border border-gray-300 bg-white rounded-full px-4 py-2">
                <input
                  type="text"
                  placeholder="Search"
                  className="flex-grow bg-transparent pr-2 text-xs"
                />
                <HiSearch className="text-gray-500 text-xs" />
              </div>
            </div> */}
          </div>
          {!isUserDataLoaded ? (
            <Loader message={"Loading your channel Videos. Hold tight"} />
          ) : (
            ""
          )}
          <div>
            {/* Header component */}
            <div className="text-xs font-thin mt-5 mb-5">
              Results: {`${userYoutubeData.length} videos`}
            </div>
            <div className="rounded-md bg-white p-5">
              <GridComponent
                dataSource={userYoutubeData}
                // id="gridcomp"
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
                    field="title"
                    headerText="Videos"
                    template={ThumbnailTitleTemplate}
                    width="300"
                  />
                  <ColumnDirective
                    field="optimizationLevel"
                    headerText="Optimization level"
                    template={gridOrderOptimizationLevel}
                    // width="300"
                  />
                  {/* <ColumnDirective
                  field="optimizationImpact"
                  headerText="Optimization impact"
                  template={gridOrderOptimizationImpact}
                  // width="300"
                /> */}
                  <ColumnDirective
                    field="viewCount"
                    headerText="View Count"
                    template={viewCountTemplate}
                    headerTemplate={viewCountHeaderTemplate}
                    width="150"
                  />
                  <ColumnDirective
                    field="publishedAt"
                    headerText="Published At"
                    // width="150"
                    template={formatDate}
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
        </div>
      )}
    </div>
  );
};

export default Ideation;
