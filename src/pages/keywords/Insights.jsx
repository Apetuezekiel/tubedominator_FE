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
  findCountryAndLanguage,
  userFullDataDecrypted,
} from "../../data/api/calls";
import { useState } from "react";
import countriesWithLanguages from "../../data/countries";
import Loader from "../../components/Loader";
import Competition from "./Competition";

function Insights({ dataSet, setShowInsights, setShowCompetition }) {
  const decryptedFullData = userFullDataDecrypted();
  const [keywordVideosInfo, setKeywordVideosInfo] = useState([]);
  const [isResultLoaded, setIsResultLoaded] = useState(false);
  const savedIdeasData = JSON.parse(localStorage.getItem("lastVideoIdeas"));
  // const [showCompetition, setShowCompetition] = useState(false);

  let locationData = findCountryAndLanguage(dataSet, countriesWithLanguages);

  useEffect(() => {
    let isMounted = true;
    let ideaKeywordSerpData = JSON.parse(
      localStorage.getItem(
        `${decryptedFullData.gid}-${dataSet.index}-keywordVideosInfo`,
      ),
    );
    if (ideaKeywordSerpData !== null || ideaKeywordSerpData !== undefined) {
      setKeywordVideosInfo(ideaKeywordSerpData.slice(0, 3));
      setIsResultLoaded(true);
      console.log("Loaded from Local storage", ideaKeywordSerpData);
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
          if (isMounted) {
            const keywordVideosInfo = response.data.map((item, index) => ({
              ...item,
              index: index + 1,
            }));
            setKeywordVideosInfo(keywordVideosInfo.slice(0, 3));
            localStorage.setItem(
              `${decryptedFullData.gid}-${dataSet.index}-keywordVideosInfo`,
              JSON.stringify(keywordVideosInfo),
            );
            setIsResultLoaded(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const navigate = useNavigate();
  const difficultyColors = {
    Low: "#D2E7D0",
    Medium: "#FCECBB",
    High: "#FDECEC",
  };

  const difficultyColor = difficultyColors[dataSet.difficulty];

  return (
    <section className="w-full z-50">
      <div className="m-2 md:m-10 mt-10 p-2 md:p-10 bg-white rounded-3xl">
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
              style={{ borderBottom: "#7438FF 2px solid", color: "#7438FF" }}
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
          <div className="w-2/6 border-r-2">
            <div className="flex items-center">
              <span className="mr-2">Potential Views on YouTube</span>
              <AiOutlineInfoCircle size={20} />
            </div>
            <div className="mt-8">
              <div className="text-3xl font-semibold">
                {formatNumberToKMBPlus(dataSet.estimated_views)}
              </div>
              <div className="text-sm">per month</div>
            </div>
            <div style={{ color: "#7438FF" }} className="mt-20 text-xs">
              How do we calculate this number?
            </div>
          </div>

          <div className="w-4/6 px-8">
            <div className="flex items-center">
              <span className="mr-2">Search Trend on</span>
              <span className="mr-2">
                <AiFillYoutube size={20} />
              </span>
              <AiOutlineInfoCircle size={20} />
            </div>
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
                  style={{ backgroundColor: "#FDECEC", color: "red" }}
                >
                  <span className="mr-1">
                    <AiOutlineArrowDown color="red" />
                  </span>{" "}
                  -28%
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="section1 m-2 mt-14 p-2 px-5 py-10 border-2 bg-white rounded-3xl flex shadow-lg">
          <div className="w-2/6 border-r-2">
            <div className="flex items-center">
              <span className="mr-2">Chances of Success For Idea</span>
              <AiOutlineInfoCircle size={20} />
            </div>
            <div className="mt-8 w-full h-fit flex justify-center items-center">
              <div className="mt-10">
                <span
                  className="rounded-full flex items-center justify-center px-5 py-2 w-30"
                  style={{ backgroundColor: difficultyColor }}
                >
                  {dataSet.difficulty}
                </span>
                <div className="text-5xl font-bold text-gray-800 mt-5">
                  80/100
                </div>
              </div>
            </div>
          </div>

          <div className="w-4/6 px-8">
            <div className="flex items-center">
              <span className="mr-2">
                Calculated based on your top 10 competitors' characteristics for
                this video idea:
              </span>
            </div>
            <div className="flex justify-between">
              <div className="mt-5 mr-10">
                <div className="flex items-center mt-5 mb-5">
                  <span className="mr-2 text-xs text-gray-500 font-semibold">
                    Keyword Difficulty
                  </span>
                  <AiOutlineInfoCircle size={10} className="text-gray-500" />
                </div>
                <span
                  className="rounded-full flex items-center justify-center px-5 py-2 w-30 text-xs"
                  style={{ backgroundColor: difficultyColor }}
                >
                  {dataSet.difficulty}
                </span>
                <div className="text-xs mt-5 text-gray-500">
                  Competitor channels are just starting to learn about YouTube
                  SEO and may not be implementing best practices consistently.
                </div>
              </div>
              <div className="mt-5 mr-10">
                <div className="flex items-center mt-5 mb-5">
                  <span className="mr-2 text-xs text-gray-500 font-semibold">
                    Competitor's Channel Size
                  </span>
                  <AiOutlineInfoCircle size={10} className="text-gray-500" />
                </div>
                <span
                  className="rounded-full flex items-center justify-center px-5 py-2 w-30 text-xs"
                  style={{ backgroundColor: difficultyColor }}
                >
                  {dataSet.difficulty}
                </span>
                <div className="text-xs mt-5 text-gray-500">
                  Competitor channels are just starting to learn about YouTube
                  SEO and may not be implementing best practices consistently.
                </div>
              </div>
              <div className="mt-5 mr-10">
                <div className="flex items-center mt-5 mb-5">
                  <span className="mr-2 text-xs text-gray-500 font-semibold">
                    Age of Top Videos
                  </span>
                  <AiOutlineInfoCircle size={10} className="text-gray-500" />
                </div>
                <span
                  className="rounded-full flex items-center justify-center px-5 py-2 w-30 text-xs"
                  style={{ backgroundColor: difficultyColor }}
                >
                  {dataSet.difficulty}
                </span>
                <div className="text-xs mt-5 text-gray-500">
                  Competitor channels are just starting to learn about YouTube
                  SEO and may not be implementing best practices consistently.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section1 m-2 mt-14 p-2 px-5 py-10 border-2 bg-white rounded-3xl flex shadow-lg">
          <div className="w-3/6 border-r-2">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2 font-bold">Video on Google</span>
              <AiOutlineInfoCircle size={20} />
            </div>
            <div>Top videos ranking on Google for this idea</div>
            <div className="mt-8">
              {isResultLoaded ? (
                keywordVideosInfo.map((item, index) => {
                  return (
                    <div className="mt-5 flex items-top" key={index}>
                      <div>
                        <img
                          src={item.thumbnail.static}
                          alt="Thumnail"
                          className="rounded-md h-12 mr-3"
                        />
                        <span className="text-xs text-center">
                          {item.length}
                        </span>
                      </div>
                      <div className="ml-2">
                        <div className="text-xs text-gray-800 capitalize break-words">
                          {item.title}
                        </div>
                        <div className="flex items-center text-xs">
                          Youtube <BsDot size={20} /> {item.channel.name}
                        </div>
                      </div>
                    </div>
                  );
                })
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
      {/* {showCompetition &&  <Competition dataSet={dataSet} setShowInsights={setShowInsights} setShowCompetition={setShowCompetition} />} */}
    </section>
  );
}

export default Insights;
