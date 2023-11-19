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
import { userFullDataDecrypted } from "../data/api/calls";
import showToast from "../utils/toastUtils";
import { BiChevronDown, BiEdit, BiTrendingUp } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import Opitimize from "../components/Opitimize";
import Loader from "../components/Loader";

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
  const [userPlaylistData, setUserPlaylistData] = useState([]);
  console.log("decryptedFullData OptimizationPage", decryptedFullData);
  const navigate = useNavigate();
  const [isOptimizeVideo, setIsOptimizeVideo] = useState(false);

  function removeUndefinedOrNull(arr) {
    return arr.filter((item) => item !== undefined && item !== null);
  }

  useEffect(() => {
    console.log("allUserDeetsallUserDeetsallUserDeets", decryptedFullData);
    let isMounted = true;

    const fetchMyYoutubeInfo = async () => {
      try {
        axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/fetchMyYoutubeInfo`, {
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
              setUserYoutubeData(response.data);
              setIsuserDataLoaded(true);
              console.log(response);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
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
  };

  const ThumbnailTitleTemplate = (props) => {
    console.log("propsppp", props);
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
    const formatedNumber = formatNumberToKPlus(props.viewCount);
    return <div>{formatedNumber}</div>;
  };

  const gridOrderOptimizationLevel = (props) => {
    return props.viewCount < 1000 ? (
      <div className="h-2 w-full rounded-full flex flex-row items-center justify-between">
        <div className="h-full w-80 bg-gray-300 rounded-full mr-2">
          <div className="h-full w-10 bg-purple-600 rounded-full"></div>
        </div>
        <span className="w-20 text-xs text-purple-600">20%</span>
      </div>
    ) : props.viewCount < 5000 ? (
      <div className="h-2 w-full rounded-full flex flex-row items-center justify-between">
        <div className="h-full w-80 bg-gray-300 rounded-full mr-2">
          <div className="h-full w-40 bg-purple-600 rounded-full"></div>
        </div>
        <span className="w-20 text-xs text-purple-600">50%</span>
      </div>
    ) : (
      <div className="h-2 w-full rounded-full flex flex-row items-center justify-between">
        <div className="h-full w-80 bg-gray-300 rounded-full mr-2">
          <div className="h-full w-50 bg-purple-600 rounded-full"></div>
        </div>
        <span className="w-20 text-xs text-purple-600">70%</span>
      </div>
    );
  };

  const gridOrderOptimizationImpact = (props) => {
    return props.viewCount < 1000 ? (
      <div className="h-5 w-full rounded-full flex flex-row items-center justify-between">
        <div className="h-full bg-gray-300 w-full rounded-full mr-2">
          <div className="h-full w-10 bg-purple-600 rounded-full">
            <span className="w-20 text-xs ml-3 text-white">Low</span>
          </div>
        </div>
      </div>
    ) : props.viewCount < 5000 ? (
      <div className="h-5 w-full rounded-full flex flex-row items-center justify-between">
        <div className="h-full bg-gray-300 w-full rounded-full mr-2">
          <div className="h-full w-40 bg-purple-600 rounded-full">
            <span className="w-20 text-xs ml-3 text-white">Med</span>
          </div>
        </div>
      </div>
    ) : (
      <div className="h-5 w-full rounded-full flex flex-row items-center justify-between">
        <div className="h-full bg-gray-300 w-full rounded-full mr-2">
          <div className="h-full w-60 bg-purple-600 rounded-full">
            <span className="w-20 text-xs ml-3 text-white">High</span>
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
        selectedVideoId && <Opitimize videoId={selectedVideoId} />
      ) : (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl overflow-hidden">
          <div className="flex justify-between">
            <div className="w-3/4 flex py-2">
              <div className="flex justify-start items-center">
                <div className="bg-white rounded-full border border-gray-300 px-4 py-2 flex items-center mr-4">
                  <select
                    id="mySelect"
                    // value={this.state.selectedOption}
                    // onChange={this.handleChange}
                    className="text-xs outline-none"
                  >
                    <option value=""> Visibility (All)</option>
                    <option className="text-xs" value="Public Videos">
                      Public Videos
                    </option>
                    <option className="text-xs" value="Private Videos">
                      Private Videos
                    </option>
                    <option className="text-xs" value="Unlisted Videos">
                      Unlisted Videos
                    </option>
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
                    <option className="text-xs" value="Last Month">
                      Last Month
                    </option>
                    <option className="text-xs" value="Last Week">
                      Last Week
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
            <div className="w-1/4 flex justify-end py-2">
              {/* <div className="flex items-center w-2/4 border border-gray-300 bg-white rounded-full px-4 py-2">
                <input
                  type="text"
                  placeholder="Search"
                  className="flex-grow bg-transparent pr-2 text-xs"
                />
                <HiSearch className="text-gray-500 text-xs" />
              </div> */}
            </div>
          </div>
          {!isUserDataLoaded ? (
            <Loader message={"Loading your channel Videos. Hold tight"} />
          ) : (
            ""
          )}
          <div>
            {/* Header component */}
            <Header title={`${userYoutubeData.length} videos`} />
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
                <ColumnDirective
                  field="optimizationImpact"
                  headerText="Optimization impact"
                  template={gridOrderOptimizationImpact}
                  // width="300"
                />
                <ColumnDirective
                  field="viewCount"
                  headerText="View Count"
                  template={viewCountTemplate}
                  // width="150"
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
      )}
    </div>
  );
};

export default Ideation;
