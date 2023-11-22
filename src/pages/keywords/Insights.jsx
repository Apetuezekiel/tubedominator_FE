import {
  AiFillYoutube,
  AiOutlineArrowDown,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import thumbnail1 from "../../assets/images/thumbnail1.webp";
import thumbnail2 from "../../assets/images/thumbnail2.jpg";
import thumbnail3 from "../../assets/images/thumbnail3.webp";
import { BsDot } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import { BiArrowBack, BiLoaderCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { formatNumberToKMBPlus } from "../../data/helper-funtions/helper";
import axios from "axios";
import { useEffect } from "react";
import {
  calculateChancesOfSuccess,
  findCountryAndLanguage,
  userFullDataDecrypted,
} from "../../data/api/calls";
import { useState } from "react";
import countriesWithLanguages from "../../data/countries";
import Loader from "../../components/Loader";
import Competition from "./Competition";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useSerpYoutubeVideosInfo } from "../../state/state";
import tubeDominatorLogo from "../../assets/images/TubeDominator 500x500.png";
import {
  ageOfTopVideos,
  competitorChannelSize,
  keywordDifficulty,
} from "../../data/insightsData";

function Insights({
  dataSet,
  setShowInsights,
  setShowCompetition,
  showCompetition,
  display,
}) {
  console.log("dataSet", dataSet);
  const decryptedFullData = userFullDataDecrypted();
  const [keywordVideosInfo, setKeywordVideosInfo] = useState([]);
  const [isSerpGoogleLoaded, setSerpGoogleLoaded] = useState("");
  const [overallInsightMetrics, setOverallInsightsMetrics] = useState("");
  const savedIdeasData = JSON.parse(localStorage.getItem("lastVideoIdeas"));
  const serpYoutubeVideosInfo = useSerpYoutubeVideosInfo(
    (state) => state.serpYoutubeVideosInfo,
  );
  const setSerpYoutubeVideosInfo = useSerpYoutubeVideosInfo(
    (state) => state.setSerpYoutubeVideosInfo,
  );
  // const [youtubeVideosInfo, setYoutubeVideosInfo] = useState(false);
  const [isSerpYoutubeLoaded, setIsSerpYoutubeLoaded] = useState(false);

  if (typeof dataSet.m1 === 'string' && dataSet.m1.includes(":")) {
    for (let i = 1; i <= 12; i++) {
      const monthKey = `m${i}`;
      if (typeof dataSet[monthKey] === 'string' && dataSet[monthKey].includes(":")) {
        dataSet = {
          ...dataSet,
          [monthKey]: dataSet[monthKey].split(':')[2],
          [`${monthKey}_year`]: dataSet[monthKey].split(':')[1],
          [`${monthKey}_month`]: dataSet[monthKey].split(':')[0],
        };
      }
    }
    dataSet = {
      ...dataSet,
      keyword: dataSet.video_ideas,
      volume: dataSet.search_volume,
      estimated_views: dataSet.potential_views,
      difficulty: dataSet.keyword_diff,
    };
  }
  

  console.log("new data set", dataSet);

  

  let locationData = findCountryAndLanguage(dataSet, countriesWithLanguages);

  const formattedData = Object.keys(dataSet)
    .filter((key) => key.startsWith("m"))
    .map((key) => ({
      month: dataSet[`${key}_month`],
      searchVolume: dataSet[key],
    }))
    .sort((a, b) => a.month - b.month);

  function formatNumber(value) {
    if (value < 1000) {
      return value;
    } else if (value < 1000000) {
      return (value / 1000).toFixed(1) + "K";
    } else if (value < 1000000000) {
      return (value / 1000000).toFixed(1) + "M";
    } else {
      return (value / 1000000000).toFixed(1) + "B";
    }
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const updatedFormattedData = formattedData.filter(
    (item) => item.month !== undefined && item.month !== null,
  );

  useEffect(() => {
    let isMounted = true;

    const fetchSerpGoogleVideos = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/fetchSerpGoogleVideos`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.REACT_APP_X_API_KEY,
              Authorization: `Bearer ${decryptedFullData.token}`,
            },
            params: {
              keyword: dataSet.keyword,
              location: "United States",
              country: "us",
              language: "en",
            },
          },
        );

        if (response.data.success && isMounted) {
          const keywordVideosInfo = response.data.data.map((item, index) => ({
            ...item,
            index: index + 1,
          }));

          setKeywordVideosInfo(keywordVideosInfo.slice(0, 3));

          localStorage.setItem(
            `${decryptedFullData.gid}-${dataSet.index}-keywordVideosInfo`,
            JSON.stringify(keywordVideosInfo),
          );

          setSerpGoogleLoaded("data");
        } else {
          setSerpGoogleLoaded("nodata");
        }
      } catch (error) {
        console.error("Error fetching SerpGoogleVideos:", error);
        setSerpGoogleLoaded("nodata");
      }
    };

    const fetchSerpYoutubeVideos = async () => {
      // localStorage.removeItem('fetchSerpYoutubeVideos');
      // setSerpYoutubeVideosInfo({});
      // let fetchSerpYoutubeVideosLS = JSON.parse(
      //   localStorage.getItem(`fetchSerpYoutubeVideos`),
      // );

      // if (
      //   fetchSerpYoutubeVideosLS !== null &&
      //   fetchSerpYoutubeVideosLS !== undefined
      // ) {
      //   setSerpYoutubeVideosInfo(fetchSerpYoutubeVideosLS);
      //   // console.log("mergeVideoData(response.data.analyzed_video_details, response.data.data)", mergeVideoData(fetchSerpYoutubeVideosLS.analyzed_video_details, fetchSerpYoutubeVideosLS.data));

      //   console.log("Loaded from Local storage", fetchSerpYoutubeVideosLS);
      //   const chancesOfSuccess = calculateChancesOfSuccess(dataSet.difficulty, fetchSerpYoutubeVideosLS.date_category, fetchSerpYoutubeVideosLS.channel_details.subscriber_category)
      //   setOverallInsightsMetrics(chancesOfSuccess)
      //   console.log("dataSet.difficulty, fetchSerpYoutubeVideosLS.channel_details.subscriber_category, fetchSerpYoutubeVideosLS.date_category", dataSet.difficulty, fetchSerpYoutubeVideosLS.channel_details.subscriber_category, fetchSerpYoutubeVideosLS.date_category);
      //   console.log("chancesOfSuccess", chancesOfSuccess);
      //   setIsSerpYoutubeLoaded(true);
      // } else {
      if (dataSet?.keyword === serpYoutubeVideosInfo?.keyword) {
        console.log(
          "Loaded again from Local App wide state",
          serpYoutubeVideosInfo,
        );
        const chancesOfSuccess = calculateChancesOfSuccess(
          dataSet.difficulty,
          serpYoutubeVideosInfo.data.date_category,
          serpYoutubeVideosInfo.data.channel_details.subscriber_category,
        );
        setOverallInsightsMetrics(chancesOfSuccess);
        console.log(
          "dataSet.difficulty, fetchSerpYoutubeVideosLS.channel_details.subscriber_category, fetchSerpYoutubeVideosLS.date_category",
          dataSet.difficulty,
          serpYoutubeVideosInfo.data.channel_details.subscriber_category,
          serpYoutubeVideosInfo.data.date_category,
        );
        console.log("chancesOfSuccess", chancesOfSuccess);
        setIsSerpYoutubeLoaded(true);
      } else {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/fetchSerpYoutubeVideos`,
            {
              headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.REACT_APP_X_API_KEY,
                Authorization: `Bearer ${decryptedFullData.token}`,
              },
              params: {
                keyword: dataSet.keyword,
              },
            },
          );

          console.log("fetchSerpYoutubeVideos", response);

          if (isMounted) {
            console.log("response.data", response.data);

            localStorage.setItem(
              `fetchSerpYoutubeVideos`,
              JSON.stringify(response.data),
            );
            setSerpYoutubeVideosInfo({
              keyword: dataSet,
              data: response.data,
            });
            const chancesOfSuccess = calculateChancesOfSuccess(
              dataSet.difficulty,
              response.data.date_category,
              response.data.channel_details.subscriber_category,
            );
            setOverallInsightsMetrics(chancesOfSuccess);
            console.log("chancesOfSuccess", chancesOfSuccess);
            setIsSerpYoutubeLoaded(true);
            // console.log("mergeVideoData(response.data.analyzed_video_details, response.data.data)", mergeVideoData(response.data.analyzed_video_details, response.data.data));
          }
        } catch (error) {
          console.error("Error fetching SerpYoutubeVideos:", error);
        }
      }
      // }
    };

    fetchSerpGoogleVideos();
    fetchSerpYoutubeVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  // useEffect(() =>{
  //   let isMounted = true;
  //   axios
  //   .get(`${process.env.REACT_APP_API_BASE_URL}/fetchSerpYoutubeVideos`, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       "x-api-key": process.env.REACT_APP_X_API_KEY,
  //       Authorization: `Bearer ${decryptedFullData.token}`,
  //     },
  //     params: {
  //       keyword: dataSet.keyword,
  //     },
  //   })
  //   .then((response) => {
  //     console.log("fetchSerpYoutubeVideos", response);
  //     if (isMounted) {
  //       // const youtubeVideosInfo = response.data.data.map((item, index) => ({
  //       //   ...item,
  //       //   index: index + 1,
  //       // }));
  //       console.log("response.data", response.data)
  //       setSerpYoutubeVideosInfo(response.data);
  //       // setYoutubeVideosInfo(youtubeVideosInfo);
  //       setIsSerpYoutubeLoaded(true);
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("Error fetching data:", error);
  //   });
  // }, [])

  const navigate = useNavigate();
  const difficultyColors = {
    Low: "#D2E7D0",
    Medium: "#FCECBB",
    High: "#FDECEC",
  };

  const difficultyColor = difficultyColors[dataSet.difficulty];

  return (
    <section className={`w-full z-50 ${display}`}>
      <div className="m-2 md:m-10 mt-10 p-2 md:p-10 bg-white rounded-3xl">
        {isSerpYoutubeLoaded ? (
          <div>
            <header>
              <div className="flex items-center justify-between mb-5">
                <span
                  className="mr-3 flex items-center cursor-pointer"
                  onClick={() => setShowInsights(false)}
                >
                  <BiArrowBack color="#7438FF" className="mr-2" /> Back to list
                </span>
                <span
                  className="text-3xl font-bold mb-2 cursor-pointer"
                  onClick={() => setShowInsights(false)}
                >
                  <MdCancel color="red" />
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-3">Your idea:</span>
                <span className="text-3xl font-bold mb-2 capitalize">
                  {dataSet.keyword}
                </span>
              </div>
              <div className="flex mt-3">
                <span className="mr-3">Search volume:</span>
                <span>
                  {formatNumberToKMBPlus(dataSet.volume)} | Language:{" "}
                  {locationData.country} ({locationData.language})
                </span>
              </div>
              <div className="flex mt-10">
                <span
                  className="mr-3 pb-3 px-5 cursor-pointer"
                  style={{
                    borderBottom: "#7438FF 2px solid",
                    color: "#7438FF",
                  }}
                >
                  Insights
                </span>
                <span
                  className="mr-3 pb-3 px-5 cursor-pointer"
                  onClick={() => {
                    setShowInsights(false);
                    setShowCompetition(true);
                  }}
                >
                  Competition
                </span>
              </div>
              <hr />
            </header>

            <section className="section1 m-2 mt-14 p-2 px-5 py-10 border-2 bg-white rounded-3xl flex shadow-lg">
              <div className="w-3/12 border-r-2">
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">
                    Potential Views on YouTube
                  </span>
                  <AiOutlineInfoCircle color="gray" size={15} />
                </div>
                <div className="mt-20">
                  <div className="text-5xl font-semibold">
                    {formatNumberToKMBPlus(dataSet.estimated_views)}
                  </div>
                  <div className="text-sm">per month</div>
                </div>
                {/* <div style={{ color: "#7438FF" }} className="mt-20 text-xs">
              How do we calculate this number?
            </div> */}
              </div>

              <div className="w-7/12 px-8">
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">
                    Search Trend on
                  </span>
                  <span className="mr-2">
                    <AiFillYoutube color="red" size={20} />
                  </span>
                  <AiOutlineInfoCircle color="gray" size={15} />
                </div>
                <div className="flex">
                  <div>
                    <div className="mt-8">
                      <div className="mb-3 text-sm">Search Volume Avg</div>
                      <span className="text-3xl font-semibold mr-3">
                        {formatNumberToKMBPlus(dataSet.estimated_views)}
                      </span>
                      <span className="text-sm">per month</span>
                    </div>
                    <div className="mt-8">
                      <div className="mb-3 text-sm">Last Month</div>
                      <div className="flex items-center">
                        <span className="text-3xl font-semibold mr-3">
                          {formatNumberToKMBPlus(dataSet.m1)}
                        </span>
                        <span
                          className="rounded-full flex items-center justify-center px-5 py-2 w-30"
                          style={{
                            backgroundColor: "transparent",
                            color: "transparent",
                          }}
                        >
                          <span className="mr-1">
                            <AiOutlineArrowDown color="transparent" />
                          </span>{" "}
                          -28%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-10 mt-8">
                    <AreaChart
                      width={500}
                      height={200}
                      data={updatedFormattedData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tickFormatter={(month) => monthNames[month - 1]}
                        domain={["dataMin", "dataMax"]}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [value, `${name}`]}
                        labelFormatter={(label) => monthNames[label - 1]}
                      />
                      <Legend />
                      <Area
                        type="linear"
                        dataKey="searchVolume"
                        fillOpacity={0.6}
                        fill="#7352FF"
                        stroke="#7352FF"
                        activeDot={{ r: 8 }}
                      />
                    </AreaChart>
                    {/* <LineChart/> */}
                  </div>
                </div>
              </div>
            </section>

            <section className="section1 m-2 mt-14 p-2 px-5 py-10 border-2 bg-white rounded-3xl flex shadow-lg">
              <div className="border-r-2 w-3/12">
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">
                    Chances of Success For Idea
                  </span>
                  <AiOutlineInfoCircle color="gray" size={15} />
                </div>
                <div className="mt-8 w-full h-fit flex justify-center items-center">
                  <div className="mt-10">
                    <span
                      className="rounded-full flex items-center justify-center px-5 py-2 w-30"
                      style={{
                        backgroundColor:
                          overallInsightMetrics &&
                          (overallInsightMetrics.level === "Low"
                            ? "#D2E7D0"
                            : overallInsightMetrics.level === "Medium"
                            ? "#FCECBB"
                            : overallInsightMetrics.level === "High"
                            ? "#FDECEC"
                            : "gray"), // fallback to inherit if the category is not Small, Medium, or Large
                      }}
                    >
                      {overallInsightMetrics && overallInsightMetrics.level}
                    </span>
                    <div className="text-5xl font-bold text-gray-800 mt-5">
                      {overallInsightMetrics &&
                        overallInsightMetrics.percentage}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-9/12 px-8">
                <div className="flex items-center">
                  <span className="mr-2 text-sm font-medium">
                    Calculated based on your top 10 competitors' characteristics
                    for this video idea:
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-start flex-col mt-5">
                    <div className="flex items-center mt-5 mb-5">
                      <span className="mr-2 text-xs text-gray-500 font-semibold">
                        Keyword Difficulty
                      </span>
                      <AiOutlineInfoCircle
                        size={10}
                        className="text-gray-500"
                      />
                    </div>
                    <span
                      className="rounded-full flex items-center justify-center px-5 py-2 w-30 text-xs"
                      style={{ backgroundColor: difficultyColor }}
                    >
                      {dataSet.difficulty}
                    </span>
                    <div className="text-xs mt-5 text-gray-500 whitespace-normal">
                      {dataSet.difficulty === "Low"
                        ? keywordDifficulty[0].info
                        : dataSet.difficulty === "Medium"
                        ? keywordDifficulty[1].info
                        : dataSet.difficulty === "High"
                        ? keywordDifficulty[2].info
                        : ""}
                    </div>
                  </div>
                  <div className="flex items-start flex-col mt-5">
                    <div className="flex items-center mt-5 mb-5">
                      <span className="mr-2 text-xs text-gray-500 font-semibold">
                        Competitor's Channel Size
                      </span>
                      <AiOutlineInfoCircle
                        size={10}
                        className="text-gray-500"
                      />
                    </div>
                    <span
                      className="rounded-full flex items-center justify-center px-5 py-2 w-30 text-xs"
                      style={{
                        backgroundColor:
                          isSerpYoutubeLoaded &&
                          (serpYoutubeVideosInfo.data.channel_details
                            .subscriber_category === "Small"
                            ? "#D2E7D0"
                            : serpYoutubeVideosInfo.data.channel_details
                                .subscriber_category === "Medium"
                            ? "#FCECBB"
                            : serpYoutubeVideosInfo.data.channel_details
                                .subscriber_category === "Large"
                            ? "#FDECEC"
                            : "gray"), // fallback to inherit if the category is not Small, Medium, or Large
                      }}
                    >
                      {isSerpYoutubeLoaded ? (
                        serpYoutubeVideosInfo.data.channel_details
                          .subscriber_category ?? "No Data"
                      ) : (
                        <BiLoaderCircle
                          color="#7352FF"
                          className="animate-spin"
                        />
                      )}
                    </span>
                    <div className="text-xs mt-5 text-gray-500 whitespace-normal">
                      {isSerpYoutubeLoaded &&
                        (serpYoutubeVideosInfo.data.channel_details
                          .subscriber_category === "Small"
                          ? competitorChannelSize[0].info.replace(
                              "medianInfo",
                              formatNumber(
                                serpYoutubeVideosInfo.data.channel_details
                                  .median_subscriber_count,
                              ),
                            )
                          : serpYoutubeVideosInfo.data.channel_details
                              .subscriber_category === "Medium"
                          ? competitorChannelSize[1].info.replace(
                              "medianInfo",
                              formatNumber(
                                serpYoutubeVideosInfo.data.channel_details
                                  .median_subscriber_count,
                              ),
                            )
                          : serpYoutubeVideosInfo.data.channel_details
                              .subscriber_category === "Large"
                          ? competitorChannelSize[2].info.replace(
                              "medianInfo",
                              formatNumber(
                                serpYoutubeVideosInfo.data.channel_details
                                  .median_subscriber_count,
                              ),
                            )
                          : "")}
                    </div>
                  </div>
                  <div className="flex items-start flex-col mt-5">
                    <div className="flex items-center mt-5 mb-5">
                      <span className="mr-2 text-xs text-gray-500 font-semibold">
                        Age of Top Videos
                      </span>
                      <AiOutlineInfoCircle
                        size={10}
                        className="text-gray-500"
                      />
                    </div>
                    <span
                      className="rounded-full flex items-center justify-center px-5 py-2 w-30 text-xs"
                      style={{
                        backgroundColor:
                          isSerpYoutubeLoaded &&
                          (serpYoutubeVideosInfo.data.date_category === "Low"
                            ? "#D2E7D0"
                            : serpYoutubeVideosInfo.data.date_category ===
                              "Medium"
                            ? "#FCECBB"
                            : serpYoutubeVideosInfo.data.date_category ===
                              "High"
                            ? "#FDECEC"
                            : "gray"), // fallback to inherit if the category is not Low, Medium, or High
                      }}
                    >
                      {isSerpYoutubeLoaded ? (
                        serpYoutubeVideosInfo.data.date_category ?? "No Data"
                      ) : (
                        <BiLoaderCircle
                          color="#7352FF"
                          className="animate-spin"
                        />
                      )}
                    </span>
                    <div className="text-xs mt-5 text-gray-500 whitespace-normal">
                      {isSerpYoutubeLoaded &&
                        (serpYoutubeVideosInfo.data.date_category === "Low"
                          ? ageOfTopVideos[0].info
                          : serpYoutubeVideosInfo.data.date_categoryy ===
                            "Medium"
                          ? ageOfTopVideos[1].info
                          : serpYoutubeVideosInfo.data.date_category === "High"
                          ? ageOfTopVideos[2].info
                          : "")}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="section1 m-2 mt-14 p-2 px-5 py-10 border-2 bg-white rounded-3xl flex shadow-lg">
              <div className="w-3/6 border-r-2">
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-2 font-bold">
                    Video on Google
                  </span>
                  <AiOutlineInfoCircle size={20} />
                </div>
                <div>Top videos ranking on Google for this idea</div>
                <div className="mt-8">
                  {isSerpGoogleLoaded === "data" ? (
                    keywordVideosInfo.map((item, index) => {
                      return (
                        <div className="mt-5 flex items-top" key={index}>
                          <div>
                            <img
                              src={item.thumbnail}
                              alt="Thumnail"
                              className="rounded-md h-12 mr-3"
                            />
                            <span className="text-xs text-center">
                              {item.duration}
                            </span>
                          </div>
                          <div className="ml-2">
                            <div className="text-xs text-gray-800 capitalize break-words">
                              {item.title}
                            </div>
                            <div className="flex items-center text-xs">
                              {item.platform} <BsDot size={20} /> {item.channel}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : isSerpGoogleLoaded === "nodata" ? (
                    <div className="flex items-center justify-center mt-20">
                      <img
                        src={tubeDominatorLogo}
                        alt="Tubedominator logo"
                        className="h-7"
                      />
                      <div className="text-xs whitespace-normal ml-5">
                        Google doesn't have video snippets for this keyword
                      </div>
                    </div>
                  ) : (
                    <Loader message={`Loading Google Video Insights`} />
                  )}
                  {/* <div className="mt-5 flex items-center">
              <img
                src={thumbnail1}
                alt="Thumnail"
                className="rounded-md h-12 mr-3"
              />
              <div>
                <div className="text-sm text-gray-800">80/100</div>
                <div className="flex items-center text-xs">
                  Youtube <BsDot size={20} />{" "}
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center">
              <img
                src={thumbnail2}
                alt="Thumnail"
                className="rounded-md h-12 mr-3"
              />
              <div>
                <div className="text-lg text-gray-800">80/100</div>
                <div className="flex items-center text-sm">
                  Youtube <BsDot size={20} />{" "}
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center">
              <img
                src={thumbnail3}
                alt="Thumnail"
                className="rounded-md h-12 mr-3"
              />
              <div>
                <div className="text-lg text-gray-800">80/100</div>
                <div className="flex items-center text-sm">
                  Youtube <BsDot size={20} />{" "}
                </div>
              </div>
            </div> */}
                </div>
              </div>

              <div className="w-3/6 px-8">
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-2 font-bold">
                    Keywords You May Rank For
                  </span>
                  <AiOutlineInfoCircle size={20} />
                </div>
                {/* <div className="flex gap-2 break-words">
          {
            savedIdeasData.related_keywords.map((item, index) => {
              return <div
              className="rounded-full flex items-center justify-center py-2 text-sm px-3"
              style={{ backgroundColor: "#E8EBED" }}
              key={index}
            >
              {item.string}
              <span
                className="py-1 px-2 rounded-full ml-5 text-xs"
                style={{ backgroundColor: "#9FA4AC" }}
              >
                {formatNumberToKMBPlus(item.volume)}
              </span>
            </div>
            })
          }
          </div> */}
                <div className="flex flex-wrap -mx-2">
                  {savedIdeasData.related_keywords.map((item, index) => (
                    <div key={index} className="m-2">
                      <div className="flex rounded-full bg-gray-200 p-2">
                        <div className="bg-gray-300 rounded-l-full px-3 py-1 text-xs">
                          {item.string}
                        </div>
                        <div className="bg-gray-400 rounded-r-full px-3 py-1 ml-2 text-xs">
                          {formatNumberToKMBPlus(item.volume)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        ) : (
          <Loader />
        )}
      </div>

      {showCompetition && (
        <Competition
          dataSet={dataSet}
          setShowInsights={setShowInsights}
          setShowCompetition={setShowCompetition}
        />
      )}
    </section>
  );
}

export default Insights;
