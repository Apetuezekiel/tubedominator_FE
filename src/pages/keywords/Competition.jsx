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
import {
  analyzeVideos,
  findCountryAndLanguage,
  mergedVideosChannelsData,
  userFullDataDecrypted,
  analyzeCompetitionInsights,
  secondsToTime,
  daysToTime,
} from "../../data/api/calls";
import countriesWithLanguages from "../../data/countries";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/Loader";
import { useSerpYoutubeVideosInfo } from "../../state/state";
import Tags from "../../components/Tags";
import showToast from "../../utils/toastUtils";

function Competition({ dataSet, setShowInsights, setShowCompetition }) {
  const decryptedFullData = userFullDataDecrypted();
  const [keywordVideosInfo, setKeywordVideosInfo] = useState([]);
  const [competitionInsights, setCompetitionInsights] = useState([]);
  const [isSerpYoutubeLoaded, setIsSerpYoutubeLoaded] = useState(false);
  const serpYoutubeVideosInfo = useSerpYoutubeVideosInfo(
    (state) => state.serpYoutubeVideosInfo,
  );
  const setSerpYoutubeVideosInfo = useSerpYoutubeVideosInfo(
    (state) => state.setSerpYoutubeVideosInfo,
  );

  if (typeof dataSet.m1 === "string" && dataSet.m1.includes(":")) {
    for (let i = 1; i <= 12; i++) {
      const monthKey = `m${i}`;
      if (
        typeof dataSet[monthKey] === "string" &&
        dataSet[monthKey].includes(":")
      ) {
        dataSet = {
          ...dataSet,
          [monthKey]: dataSet[monthKey].split(":")[2],
          [`${monthKey}_year`]: dataSet[monthKey].split(":")[1],
          [`${monthKey}_month`]: dataSet[monthKey].split(":")[0],
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

  const handleDownload = (dataObject) => {
    // Convert the object to a JSON string
    const jsonString = JSON.stringify(dataObject, null, 2);

    // Create a Blob with the JSON content
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a link element
    const downloadLink = document.createElement("a");

    // Set the href attribute to a URL created from the Blob
    downloadLink.href = URL.createObjectURL(blob);

    // Set the download attribute with the desired file name
    downloadLink.download = "example.json";

    // Append the link to the document body
    document.body.appendChild(downloadLink);

    // Programmatically click the link to trigger the download
    downloadLink.click();

    // Remove the link from the DOM
    document.body.removeChild(downloadLink);
  };

  useEffect(() => {
    let isMounted = true;
    if (serpYoutubeVideosInfo.data.analyzed_video_details ?? false) {
      console.log(
        "analyzeVideos from local storage",
        analyzeCompetitionInsights(
          serpYoutubeVideosInfo.data.analyzed_video_details,
        ),
      );
      setCompetitionInsights(
        analyzeCompetitionInsights(
          serpYoutubeVideosInfo.data.analyzed_video_details,
        ),
      );

      const mergedData = mergedVideosChannelsData(
        serpYoutubeVideosInfo.data.data,
        serpYoutubeVideosInfo.data.analyzed_video_details,
        serpYoutubeVideosInfo.data.channel_details.detailed_results,
      );
      console.log("finalMergedData", mergedData);
      // handleDownload(mergedData);
      setKeywordVideosInfo(mergedData);
      setIsSerpYoutubeLoaded(true);

      console.log(
        "fetchSerpYoutubeVideos from app-wide state",
        serpYoutubeVideosInfo,
      );
    } else {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/fetchSerpYoutubeVideos`, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            Authorization: `Bearer ${decryptedFullData.token}`,
          },
          params: {
            keyword: dataSet.keyword,
          },
        })
        .then((response) => {
          console.log("fetchSerpYoutubeVideos", response);
          if (isMounted) {
            setSerpYoutubeVideosInfo({
              keyword: dataSet.keyword,
              data: response.data,
            });
            setCompetitionInsights(
              analyzeCompetitionInsights(response.data.analyzed_video_details),
            );

            const mergedData = mergedVideosChannelsData(
              response.data.data,
              response.data.analyzed_video_details,
              response.data.channel_details.detailed_results,
            );

            console.log("finalMergedData", mergedData);
            setKeywordVideosInfo(mergedData);
            setIsSerpYoutubeLoaded(true);

            // localStorage.setItem(
            //   `fetchSerpYoutubeVideos`,
            //   JSON.stringify(response.data),
            // );
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          showToast(
            "error",
            "Couldn't fetch Insights for your keyword at this time. Try again please",
            2000,
          );
          navigate("/ideation");
        });
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const navigate = useNavigate();

  let locationData = findCountryAndLanguage(dataSet, countriesWithLanguages);

  return (
    <section className="w-full z-50">
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl z-50">
        <header>
          <div className="flex items-center justify-between mb-5">
            <span
              className="mr-3 flex items-center cursor-pointer"
              onClick={() => setShowCompetition(false)}
            >
              <BiArrowBack color="#7438FF" className="mr-2" /> Back to list
            </span>
            <span
              className="text-3xl font-bold mb-2 cursor-pointer"
              onClick={() => setShowCompetition(false)}
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
              onClick={() => {
                setShowCompetition(false);
                setShowInsights(true);
              }}
            >
              Insights
            </span>
            <span
              className="mr-3 pb-3 px-5 cursor-pointer"
              style={{ borderBottom: "#7438FF 2px solid", color: "#7438FF" }}
            >
              Competition
            </span>
          </div>
          <hr />
        </header>

        <section className="">
          <div className="text-xl font-bold flex items-center mt-10">
            <AiFillYoutube color="red" className="mr-3" /> Top 10 YouTube Videos{" "}
          </div>
          <div className="flex w-full gap-10">
            <div className="w-3/4 border-2 p-10 rounded-md mt-5">
              <header>
                <span className="mr-10 font-bold">#</span>
                <span className="font-bold">Competitor's videos</span>
              </header>
              <hr className="mt-5 mb-5" />
              <div>
                {isSerpYoutubeLoaded ? (
                  keywordVideosInfo.map((item, index) => {
                    return (
                      <div key={index}>
                        <div className="flex items-center">
                          <span className="mr-10">{index + 1}</span>
                          <div className="mt-5 flex items-start">
                            <img
                              src={item.thumbnail.static}
                              alt="Thumnail"
                              className="rounded-md h-28 mr-3"
                            />
                            <div>
                              <div className="text-md text-gray-800 capitalize">
                                {item.title}
                              </div>
                              <div className="text-sm text-gray-800 flex items-center mt-3">
                                <img
                                  src={item.channel.thumbnail}
                                  alt=""
                                  className="h-10 w-10 rounded-full mr-3"
                                />{" "}
                                {item.channel.name} <BsDot size={20} />{" "}
                                {item?.channel_details?.subscriber_count &&
                                  formatNumberToKMBPlus(
                                    item?.channel_details?.subscriber_count,
                                  ).replace("+", "")}
                              </div>
                              <div className="text-gray-800 flex items-center mt-3 text-xs">
                                Uploaded {item.published_date}{" "}
                                <BsDot size={20} /> Views:{" "}
                                {formatNumberToKMBPlus(item.views).replace(
                                  "+",
                                  "",
                                )}{" "}
                                <BsDot size={20} /> Likes:{" "}
                                {item.statistics?.likeCount &&
                                  formatNumberToKMBPlus(
                                    item.statistics?.likeCount,
                                  ).replace("+", "")}{" "}
                                <BsDot size={20} /> Comments:{" "}
                                {item.statistics?.commentCount &&
                                  formatNumberToKMBPlus(
                                    item.statistics?.commentCount,
                                  ).replace("+", "")}{" "}
                              </div>
                            </div>
                          </div>
                        </div>
                        {item.snippet?.tags && (
                          <Tags items={item.snippet?.tags} />
                        )}
                        <hr className="mt-5 mb-5" />
                      </div>
                    );
                  })
                ) : (
                  <Loader />
                )}
              </div>
            </div>
            <div className="w-1/4 border-2 p-10 rounded-md mt-5">
              <div className="flex flex-col gap-5 mt-8">
                <div className="text-lg text-gray-800 font-bold">
                  Average Video Length
                </div>
                <div className="text-3xl text-gray-800">
                  {competitionInsights.averageVideoLength != null
                    ? secondsToTime(competitionInsights.averageVideoLength)
                    : "N/A"}
                </div>
                <div className="text-xs text-gray-800 flex items-center mt-3">
                  Shortest:{" "}
                  {competitionInsights.shortestVideoLength != null
                    ? secondsToTime(competitionInsights.shortestVideoLength)
                    : "N/A"}{" "}
                  <BsDot size={20} /> Longest:{" "}
                  {competitionInsights.longestVideoLength != null
                    ? secondsToTime(competitionInsights.longestVideoLength)
                    : "N/A"}
                </div>
                <div className="text-xs">
                  Based on the median video length of our competitors, we
                  recommend creating a video that is similar in length. This can
                  help ensure that your video is not too long or too short, and
                  will be more likely to hold your viewers' attention.
                  Typically, videos in our industry are around 5 min long.
                  However, the ideal length of your video may also depend on
                  your specific content and goals. So, we suggest experimenting
                  with different video lengths to find what works best for you.
                </div>
                <hr />
              </div>
              <div className="flex flex-col gap-5 mt-8">
                <div className="text-lg text-gray-800 font-bold">
                  Average Video Age
                </div>
                <div className="text-3xl text-gray-800 font-bold">
                  {competitionInsights.averageVideoAge != null
                    ? daysToTime(competitionInsights.averageVideoAge)
                    : "N/A"}
                </div>
                <div className="text-gray-800 flex items-center mt-3 text-xs">
                  Newest:{" "}
                  {competitionInsights.newestVideoAge != null
                    ? daysToTime(competitionInsights.newestVideoAge)
                    : "N/A"}{" "}
                  <BsDot size={20} /> Oldest:{" "}
                  {competitionInsights.oldestVideoAge != null
                    ? daysToTime(competitionInsights.oldestVideoAge)
                    : "N/A"}
                </div>
                <div className="text-xs">
                  Given videos were uploaded quite some time ago you may have a
                  higher chance of ranking higher in the search results by
                  creating a video on this topic with updated and fresh content.
                </div>
                <hr />
              </div>
              <div className="flex flex-col gap-5 mt-8">
                <div className="text-lg text-gray-800 font-bold">
                  Average Likes & Comments
                </div>
                <div>
                  <span className="text-3xl text-gray-800 mr-3">
                    {competitionInsights.averageLikesComments != null
                      ? formatNumberToKMBPlus(
                          Math.ceil(competitionInsights.averageLikesComments),
                        )
                      : "N/A"}
                  </span>
                  <span className="text-xs">per 1.000 views</span>
                </div>
                <div className="text-md text-gray-800 flex items-center mt-3 text-xs">
                  Least:{" "}
                  {competitionInsights.leastLikesComments != null
                    ? formatNumberToKMBPlus(
                        Math.ceil(competitionInsights.leastLikesComments),
                      )
                    : "N/A"}{" "}
                  <BsDot size={20} /> Most:{" "}
                  {competitionInsights.mostLikesComments != null
                    ? formatNumberToKMBPlus(
                        Math.ceil(competitionInsights.mostLikesComments),
                      )
                    : "N/A"}
                </div>
                <div className="text-xs">
                  Shares and likes can be an indication of how engaging video
                  content is. In order to rank for that topic, your video
                  content will need to be similarly engaging and provide value
                  to your viewers.
                </div>
                <hr />
              </div>
              <div className="flex flex-col gap-5 mt-8">
                <div className="text-lg text-gray-800 font-bold">
                  Average Subscribers
                </div>
                <div className="text-3xl text-gray-800 font-bold">
                  {isSerpYoutubeLoaded ? (
                    formatNumberToKMBPlus(
                      serpYoutubeVideosInfo.data.channel_details
                        .average_subscriber_count,
                    ).replace("+", "") ?? "No Data"
                  ) : (
                    <BiLoaderCircle color="#7352FF" className="animate-spin" />
                  )}
                </div>
                <div className="text-xs text-gray-800 flex items-center mt-3">
                  Smallest:{" "}
                  {isSerpYoutubeLoaded ? (
                    formatNumberToKMBPlus(
                      serpYoutubeVideosInfo.data.channel_details
                        .lowest_subscriber_count,
                    ).replace("+", "") ?? "No Data"
                  ) : (
                    <BiLoaderCircle color="#7352FF" className="animate-spin" />
                  )}{" "}
                  <BsDot size={20} /> Biggest:{" "}
                  {isSerpYoutubeLoaded ? (
                    formatNumberToKMBPlus(
                      serpYoutubeVideosInfo.data.channel_details
                        .highest_subscriber_count,
                    ).replace("+", "") ?? "No Data"
                  ) : (
                    <BiLoaderCircle color="#7352FF" className="animate-spin" />
                  )}
                </div>
                <div className="text-xs">
                  If the average channel size of the top-ranking channels is
                  much larger than yours, you may face challenges to outperform
                  them. However, this doesn't mean it's impossible to rank for
                  the keyword, as there are other factors that can influence
                  video performance and visibility, such as video quality and
                  engagement metrics. So, we recommend focusing on creating
                  high-quality content and engaging with your audience to
                  improve your chances of ranking higher in the search results,
                  even if your channel size is smaller
                </div>
                <hr />
              </div>
              <div className="flex flex-col gap-5 mt-8">
                <div className="text-xs text-gray-800 font-bold">
                  Popular tags
                </div>
                {competitionInsights.topTags && (
                  <Tags items={competitionInsights.topTags} ml={"ml-0"} />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default Competition;
