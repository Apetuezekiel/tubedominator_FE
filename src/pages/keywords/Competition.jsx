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
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { formatNumberToKMBPlus } from "../../data/helper-funtions/helper";
import { findCountryAndLanguage, userFullDataDecrypted } from "../../data/api/calls";
import countriesWithLanguages from "../../data/countries";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/Loader";

function Competition({dataSet, setShowInsights, setShowCompetition}) {
  const decryptedFullData = userFullDataDecrypted();
  const [keywordVideosInfo, setKeywordVideosInfo] = useState([]);
  const [isResultLoaded, setIsResultLoaded] = useState(false);


  useEffect(() => {
    let isMounted = true;
    let ideaKeywordSerpData = JSON.parse(localStorage.getItem(`${decryptedFullData.gid}-${dataSet.index}-keywordVideosInfo`));
    if (ideaKeywordSerpData !== null || ideaKeywordSerpData !== undefined) {
        setKeywordVideosInfo(ideaKeywordSerpData);
        setIsResultLoaded(true);
        console.log("Loaded from Local storage");
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
            setKeywordVideosInfo(keywordVideosInfo);
            localStorage.setItem(`${decryptedFullData.gid}-${dataSet.index}-keywordVideosInfo`, JSON.stringify(keywordVideosInfo));
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

  let locationData = findCountryAndLanguage(dataSet, countriesWithLanguages);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl z-50">
      <header>
        <div className="flex items-center justify-between mb-5">
          <span className="mr-3 flex items-center cursor-pointer" onClick={()=> setShowCompetition(false)}>
            <BiArrowBack color="#7438FF" className="mr-2" /> Back to list
          </span>
          <span className="text-3xl font-bold mb-2 cursor-pointer" onClick={()=> setShowCompetition(false)}>
            <MdCancel color="red"/>
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
          <span>{formatNumberToKMBPlus(dataSet.volume)} | Language: {locationData.country} ({locationData.language  })</span>
        </div>
        <div className="flex mt-10">
          <span
            className="mr-3 pb-3 px-5 cursor-pointer"
          >
            Insights
          </span>
          <span
            className="mr-3 pb-3 px-5 cursor-pointer"
            onClick={() => {
              setShowCompetition(false)
              setShowInsights(true)
            }}
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
            {
              isResultLoaded ? (
                keywordVideosInfo.map((item, index) => {
                  return <div key={index}>
                  <div className="flex items-center">
                    <span className="mr-10">1</span>
                    <div className="mt-5 flex items-start">
                      <img
                        src={item.thumbnail.static}
                        alt="Thumnail"
                        className="rounded-md h-32 mr-3"
                      />
                      <div>
                        <div className="text-lg text-gray-800 capitalize">
                          {item.title}
                        </div>
                        <div className="text-md text-gray-800 flex items-center mt-3">
                          <img
                            src={item.channel.thumbnail}
                            alt=""
                            className="h-10 w-10 rounded-full mr-3"
                          />{" "}
                          ABC News <BsDot size={20} /> 15M Subscribers
                        </div>
                        <div className="text-gray-800 flex items-center mt-3 text-xs">
                          Uploaded {item.published_date} <BsDot size={20} /> Views: {formatNumberToKMBPlus(item.views).replace('+', '')}{" "}
                          <BsDot size={20} /> Likes: {formatNumberToKMBPlus(item.views).replace('+', '')} <BsDot size={20} />{" "}
                          Comments: 2.6K
                        </div>
                        <div
                          className="rounded-full flex items-center justify-center py-2 mt-3"
                          style={{ backgroundColor: "#E8EBED" }}
                        >
                          Easy there dog
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="mt-5 mb-5" />
                </div>
                })
              ) : (
                <Loader />
              )
            }
          </div>
          <div className="w-1/4 border-2 p-10 rounded-md mt-5">
            <div className="flex flex-col gap-5 mt-8">
              <div className="text-lg text-gray-800 font-bold">
                Average Video Length
              </div>
              <div className="text-3xl text-gray-800">5 min</div>
              <div className="text-sm text-gray-800 flex items-center mt-3">
                Shortest: 2 min <BsDot size={20} /> Longest: 14 min
              </div>
              <div className="text-sm">
                Based on the median video length of our competitors, we
                recommend creating a video that is similar in length. This can
                help ensure that your video is not too long or too short, and
                will be more likely to hold your viewers' attention. Typically,
                videos in our industry are around 5 min long. However, the ideal
                length of your video may also depend on your specific content
                and goals. So, we suggest experimenting with different video
                lengths to find what works best for you.
              </div>
              <hr />
            </div>
            <div className="flex flex-col gap-5 mt-8">
              <div className="text-lg text-gray-800 font-bold">
                Average Likes & Comments
              </div>
              <div className="text-3xl text-gray-800 font-bold">67 months</div>
              <div className="text-sm text-gray-800 flex items-center mt-3">
                Newest: 4 months <BsDot size={20} /> Oldest: 138 months
              </div>
              <div className="text-sm">
                Given videos were uploaded quite some time ago you may have a
                higher chance of ranking higher in the search results by
                creating a video on this topic with updated and fresh content.
              </div>
              <hr />
            </div>
            <div className="flex flex-col gap-5 mt-8">
              <div className="text-lg text-gray-800 font-bold">
                Average Video Length
              </div>
              <div>
                <span className="text-3xl text-gray-800 mr-3">17</span>
                <span className="text-sm">per 1.000 views</span>
              </div>
              <div className="text-md text-gray-800 flex items-center mt-3">
                Shortest: 2 min <BsDot size={20} /> Longest: 14 min
              </div>
              <div className="text-sm">
                Shares and likes can be an indication of how engaging video
                content is. In order to rank for that topic, your video content
                will need to be similarly engaging and provide value to your
                viewers.
              </div>
              <hr />
            </div>
            <div className="flex flex-col gap-5 mt-8">
              <div className="text-lg text-gray-800 font-bold">
                Average Subscribers
              </div>
              <div className="text-3xl text-gray-800 font-bold">5.3M</div>
              <div className="text-sm text-gray-800 flex items-center mt-3">
                Smallest: 7.7K <BsDot size={20} /> Biggest: 15M
              </div>
              <div className="text-sm">
                If the average channel size of the top-ranking channels is much
                larger than yours, you may face challenges to outperform them.
                However, this doesn't mean it's impossible to rank for the
                keyword, as there are other factors that can influence video
                performance and visibility, such as video quality and engagement
                metrics. So, we recommend focusing on creating high-quality
                content and engaging with your audience to improve your chances
                of ranking higher in the search results, even if your channel
                size is smaller
              </div>
              <hr />
            </div>
            <div className="flex flex-col gap-5 mt-8">
              <div className="text-lg text-gray-800 font-bold">
                Popular tags
              </div>
              <div className="text-sm">
                <div
                  className="rounded-full flex items-center justify-center py-2 mt-3"
                  style={{ backgroundColor: "#E8EBED" }}
                >
                  Easy there dog
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Competition;
