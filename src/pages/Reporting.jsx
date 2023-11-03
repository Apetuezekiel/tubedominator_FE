/* eslint-disable */

import React from "react";
import { useState, useEffect } from "react";

import { BsCurrencyDollar } from "react-icons/bs";
import { GoPrimitiveDot } from "react-icons/go";
import { IoIosMore } from "react-icons/io";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { pieChartData } from "../data/dummy";
import { ChartsHeader, LineChart, Pie as PieChart } from "../components";
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
import {
  earningData,
  medicalproBranding,
  recentTransactions,
  weeklyStats,
  dropdownData,
  SparklineAreaData,
  ecomPieChartData,
} from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import product9 from "../data/product9.jpg";
import {
  FaYoutube,
  FaGoogle,
  FaPlus,
  FaCalendarAlt,
  FaAngleDown,
} from "react-icons/fa";
import tubicsLogo from "../data/tubicon.svg";
import { userFullDataDecrypted } from "../data/api/calls";
import axios from "axios";
import { useUserYoutubeInfo } from "../state/state";
import Spinner from "../components/Spinner";
import donought from "../data/donought3.png";

const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent
      id="time"
      fields={{ text: "Time", value: "Id" }}
      style={{ border: "none", color: currentMode === "Dark" && "white" }}
      value="1"
      dataSource={dropdownData}
      popupHeight="220px"
      popupWidth="120px"
    />
  </div>
);

// const saveUserToken = async () => {
//   const decryptedFullData = userFullDataDecrypted();
//   console.log("decryptedFullData", decryptedFullData);
//   await axios
//   .post(
//     "${process.env.REACT_APP_BASE_URL}/saveUserToken",
//     {
//       encryptedFullData: JSON.stringify(decryptedFullData)
//     },
//     {
//       headers: {
//         "Content-Type": "application/json",
//         "x-api-key": process.env.REACT_APP_X_API_KEY,
//         Authorization: `Bearer ${decryptedFullData.token}`,
//       },
//     },
//   )
//   .then(async (response) => {
//     showToast("success", "Error saving token. Try again", 2000);
//     console.log(response);
//   })
//   .catch((error) => {
//     console.error("Error storing token:", error);
//     console.error("-----------------------", error.response.data.message);
//     showToast("error", "Error saving token. Try again", 2000);
//   });
// }

const Reporting = () => {
  const [mostWatchedUserVideos, setMostWatchedUserVideos] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [activeAccordion2, setActiveAccordion2] = useState(0);
  const { currentColor, currentMode } = useStateContext();

  const toggleAccordion = (index) => {
    setActiveAccordion(index === activeAccordion ? null : index);
  };
  const toggleAccordion2 = (index) => {
    setActiveAccordion2(index === activeAccordion2 ? null : index);
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [reportingSelected, setReportingSelected] = useState(false);
  const decryptedFullData = userFullDataDecrypted();
  const [isUserDataLoaded, setIsuserDataLoaded] = useState(false);

  // saveUserToken();
  useEffect(() => {
    console.log("allUserDeetsallUserDeetsallUserDeets", decryptedFullData);
    let isMounted = true;

    const fetchMyYoutubeInfo = async () => {
      try {
        axios
          .get(`${process.env.REACT_APP_BASE_URL}/fetchMyYoutubeInfo`, {
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
              setMostWatchedUserVideos(response.data);
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

    fetchMyYoutubeInfo();

    return () => {
      // Cleanup function to be called when the component is unmounted
      isMounted = false;
    };
  }, []);

  const getOneMonthDateRange = () => {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const fromDate = oneMonthAgo.getDate();
    const fromMonth = oneMonthAgo.toLocaleString("default", { month: "short" });
    const fromYear = oneMonthAgo.getFullYear();

    const toDate = today.getDate();
    const toMonth = today.toLocaleString("default", { month: "short" });
    const toYear = today.getFullYear();

    return `From ${fromDate} ${fromMonth} - ${toDate} ${toMonth} ${toYear}`;
  };

  const getOneWeekDateRange = () => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    const fromDate = oneWeekAgo.getDate();
    const fromMonth = oneWeekAgo.toLocaleString("default", { month: "short" });
    const fromYear = oneWeekAgo.getFullYear();

    const toDate = today.getDate();
    const toMonth = today.toLocaleString("default", { month: "short" });
    const toYear = today.getFullYear();

    return `From ${fromDate} ${fromMonth} - ${toDate} ${toMonth} ${toYear}`;
  };

  const getLast4WeeksDateRange = () => {
    const today = new Date();
    const endDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1,
    ); // Get yesterday's date
    const startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate() - 27,
    ); // 4 weeks ago

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    return `From ${formattedStartDate} to ${formattedEndDate}`;
  };

  const selectReporting = () => {
    setReportingSelected(!reportingSelected);
  };

  const last4weeks = getLast4WeeksDateRange();
  const dateRange = getOneWeekDateRange();

  const formatDate = (props) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return (
      <div>
        {new Date(props.publishedAt).toLocaleDateString("en-US", options)}
      </div>
    );
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

  return (
    <div className="py-5 px-10 mt-20">
      <div
        className="flex rankingStatBoxes py-10"
        style={{ backgroundColor: "#FBFCFE" }}
      >
        <div className="w-1/2 flex flex-col">
          <div
            className="flex items-center justify-start"
            style={{ fontSize: "30px", fontWeight: "900" }}
          >
            {" "}
            <FaYoutube className="mr-3" style={{ color: "red" }} />
            Organic Performance Report
          </div>
          <div>
            {`Zicstack YouTube Channel | ${last4weeks} | Source: YouTube`}
          </div>
        </div>
        <div className="w-1/2 flex flex-col justify-items-end">
          <div className="relative text-left flex justify-end">
            {/* Dropdown button */}
            <button
              // onClick={toggleDropdown}
              className="rounded-full border border-purple-600 bg-purple-200 text-purple-600 px-4 py-2 flex items-center space-x-2"
            >
              <FaCalendarAlt className="text-purple-600" />
              <span>Last 4 weeks</span>
              <FaAngleDown className="text-black" />
            </button>

            {/* Dropdown options */}
            {isDropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                {/* Default option */}
                <div className="p-2">
                  <button className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-purple-600" />
                    <span>Last 4 weeks</span>
                  </button>
                </div>

                {/* Divider */}
                <hr />

                {/* Additional options */}
                <div className="p-2">
                  <button className="flex items-center space-x-2">
                    {/* Add your additional option icon and text here */}
                    {/* Example:
              <YourIconComponent className="text-gray-600" />
              <span>Your Option</span>
              */}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-10">
        <div className="flex justify-center items-center w-full z-30">
          <div
            className={`flex justify-center items-center w-1/2 h-32 bg-gray-200 py-4 rounded-md cursor-pointer ${
              !reportingSelected && "reportingSelected"
            }`}
            onClick={selectReporting}
          >
            <div className="flex flex-col items-center cursor-pointer">
              <div
                className="text-gray-900 mr-3 mb-5 flex justify-center items-center"
                style={{ fontSize: "20px", fontWeight: "400" }}
              >
                <span>Organic Views</span>
                <span className="ml-2">
                  <AiOutlineInfoCircle />
                </span>
              </div>
              <div className="flex">
                <div
                  className="text-gray-900 mr-3"
                  style={{ fontSize: "30px", fontWeight: "600" }}
                >
                  0
                </div>
                <div className="flex justify-center items-center rounded-full bg-gray-300 text-black py-1 px-3 text-center">
                  <span>0%</span>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`flex justify-center items-center w-1/2 h-32 bg-gray-200 rounded-md cursor-pointer ${
              reportingSelected && "reportingSelected"
            }`}
            onClick={selectReporting}
          >
            <div className="flex flex-col items-center">
              <div
                className="text-gray-900 mr-3 flex justify-center items-center"
                style={{ fontSize: "20px", fontWeight: "400" }}
              >
                <span>Organic Views</span>
                <span className="ml-2">
                  <AiOutlineInfoCircle />
                </span>
              </div>
              <div className="flex">
                <div
                  className="text-gray-900 mr-3"
                  style={{ fontSize: "30px", fontWeight: "600" }}
                >
                  0 Hours
                </div>
                <div className="flex justify-center items-center rounded-full bg-gray-300 text-black py-1 px-3 text-center">
                  <span>0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full py-20 -m-6 bg-white">
          {!reportingSelected ? (
            <div
              className={`flex items-center justify-center w-4/6 bg-white px-4 rounded-md hidden${
                reportingSelected ? "reportingSelectedView" : "hidden"
              }`}
            >
              <LineChart />
              {/* <ChartComponent></ChartComponent> */}
            </div>
          ) : (
            <div
              className={`flex items-center justify-center w-4/6 bg-white px-4 rounded-md hidden${
                reportingSelected ? "reportingSelectedView" : "hidden"
              }`}
            >
              <LineChart />
            </div>
          )}
          <div className="flex justify-center items-center w-2/6 ">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4">Organic traffic sources</div>
              <div className="p-4">Views</div>
              <div className="p-4 flex items-center">
                <span
                  className="w-5 h-5 rounded-full mr-2"
                  style={{ backgroundColor: "#6A71FB" }}
                ></span>
                <span>Suggested videos</span>
              </div>
              <div className="p-4 ml-5">0</div>

              <div className="p-4 flex items-center">
                <span
                  className="w-5 h-5 rounded-full mr-2"
                  style={{ backgroundColor: "#61ABF7" }}
                ></span>
                <span>Google search</span>
              </div>
              <div className="p-4 ml-5">0</div>
              <div className="p-4 flex items-center">
                <span
                  className="w-5 h-5 rounded-full mr-2"
                  style={{ backgroundColor: "#ADE0FB" }}
                ></span>
                <span>YouTube search</span>
              </div>
              <div className="p-4 ml-5">0</div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex justify-between items-center w-full mt-10">
          <div
            className="flex flex-col rankingStatBoxes border-1 w-1/3 mr-8 border-gray-300 rounded px-10 py-10"
            style={{ backgroundColor: "#FBFCFE", height: "600px" }}
          >
            <div className="text-lg mb-3" style={{ fontSize: "20px" }}>
              Keyword Distribution
            </div>
            <div className="flex">
              <div
                className="text-gray-900 mr-3"
                style={{ fontSize: "30px", fontWeight: "600" }}
              >
                0 Keywords in Top 3
              </div>
              <div className="rounded-full bg-gray-300 text-black p-2 w-10">
                0%
              </div>
            </div>
            <div className="text-gray-500 text-sm -mt-2">of 3 Keywords</div>
            <div className="h-fit items-center justify-center ml-20 mt-20">
              <img src={donought} alt="" height={250} width={250} />
            </div>
            {/* <div className="reportingPie">
              {" "}
              <PieChart
                id="chart-pie"
                data={pieChartData}
                legendVisiblity
                // height="full"
                className="reportingPie"
              />
            </div> */}
          </div>
          <div
            className="flex flex-col justify-start items-center rankingStatBoxes border-1 w-1/3 mr-8 border-gray-300 rounded py-10"
            style={{ backgroundColor: "#FBFCFE", height: "600px" }}
          >
            <div className="flex items-center justify-center">
              {" "}
              <FaYoutube className="mr-3" style={{ color: "red" }} />
              Most Watched Videos Organically
            </div>
            <div className="text-gray-500 text-sm">{dateRange}</div>
            <div className="flex flex-col items-center mt-10 px-5">
              {mostWatchedUserVideos.length < 1 && (
                <div>
                  <img src={tubicsLogo} alt="" height="100px" width="100px" />
                  <div className="mt-2">We have too little data.</div>
                </div>
              )}
              {isUserDataLoaded ? (
                <GridComponent
                  dataSource={mostWatchedUserVideos}
                  allowExcelExport
                  allowPdfExport
                  allowPaging
                  allowSorting
                >
                  <ColumnsDirective>
                    <ColumnDirective field="" headerText="#" />
                    <ColumnDirective
                      field="title"
                      headerText="Videos"
                      template={ThumbnailTitleTemplate}
                      width={300}
                    />
                    <ColumnDirective
                      field="viewCount"
                      headerText="View Count"
                      template={viewCountTemplate}
                      width={150}
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
              ) : (
                <Spinner />
              )}
            </div>
          </div>
          {/* <div
            className="flex flex-col justify-start items-center rankingStatBoxes border-1 w-1/3 border-gray-300 rounded"
            style={{ backgroundColor: "#FBFCFE", height: "600px" }}
          >
            <div className="flex items-center justify-center mt-10">
              Monetary Value of Organic Traffic
            </div>
            <div className="flex mt-10">
              <div
                className="text-gray-900 mr-3"
                style={{ fontSize: "50px", fontWeight: "600" }}
              >
                € 0
              </div>
              <div className="rounded-full bg-gray-300 text-black w-10 flex justify-center items-center">
                0%
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Reporting;
