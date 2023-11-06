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

function Insights({ideasDataSet}) {
  const navigate = useNavigate();

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <header>
        <div className="flex items-center justify-between mb-5">
          <span className="mr-3 flex items-center cursor-pointer">
            <BiArrowBack color="#7438FF" className="mr-2" /> Back to list
          </span>
          <span className="text-3xl font-bold mb-2 cursor-pointer">
            <MdCancel color="red" />
          </span>
        </div>
        <div className="flex items-center">
          <span className="mr-3">Your idea:</span>
          <span className="text-3xl font-bold mb-2 capitalize">
            {ideasDataSet.keyword}
          </span>
        </div>
        <div className="flex mt-3">
          <span className="mr-3">Search volume:</span>
          <span>{ideasDataSet.volume} | Language: English (Global)</span>
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
            onClick={() => navigate("/competition")}
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
            <div className="text-4xl font-bold">40K</div>
            <div>per month</div>
          </div>
          <div style={{ color: "#7438FF" }} className="mt-20">
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
            <div className="mb-3 font-bold">Search Volume Avg</div>
            <span className="text-4xl font-bold mr-3">40K</span>
            <span>per month</span>
          </div>
          <div className="mt-8">
            <div className="mb-3 font-bold">Last Month</div>
            <div className="flex items-center">
              <span className="text-4xl font-bold mr-3">40K</span>
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
                style={{ backgroundColor: "#FDECEC", color: "red" }}
              >
                <span className="mr-1">
                  <AiOutlineArrowDown color="red" />
                </span>{" "}
                -28%
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
                <span className="mr-2">Search Trend on</span>
                <span className="mr-2">
                  <AiFillYoutube size={20} />
                </span>
                <AiOutlineInfoCircle size={20} />
              </div>
              <div
                className="rounded-full flex items-center justify-center px-10 py-2 w-28"
                style={{ backgroundColor: "#FDECEC", color: "red" }}
              >
                <span className="mr-1">
                  <AiOutlineArrowDown color="red" />
                </span>
                Easy
              </div>
              <div className="text-sm mt-5">
                Competitor channels are just starting to learn about YouTube SEO
                and may not be implementing best practices consistently.
              </div>
            </div>
            <div className="mt-5 mr-10">
              <div className="flex items-center mt-5 mb-5">
                <span className="mr-2">Search Trend on</span>
                <span className="mr-2">
                  <AiFillYoutube size={20} />
                </span>
                <AiOutlineInfoCircle size={20} />
              </div>
              <div
                className="rounded-full flex items-center justify-center px-10 py-2 w-28"
                style={{ backgroundColor: "#FDECEC", color: "red" }}
              >
                <span className="mr-1">
                  <AiOutlineArrowDown color="red" />
                </span>
                Easy
              </div>
              <div className="text-sm mt-5">
                Competitor channels are just starting to learn about YouTube SEO
                and may not be implementing best practices consistently.
              </div>
            </div>
            <div className="mt-5">
              <div className="flex items-center mt-5 mb-5">
                <span className="mr-2">Search Trend on</span>
                <span className="mr-2">
                  <AiFillYoutube size={20} />
                </span>
                <AiOutlineInfoCircle size={20} />
              </div>
              <div
                className="rounded-full flex items-center justify-center px-10 py-2 w-28"
                style={{ backgroundColor: "#FDECEC", color: "red" }}
              >
                <span className="mr-1">
                  <AiOutlineArrowDown color="red" />
                </span>
                Easy
              </div>
              <div className="text-sm mt-5">
                Competitor channels are just starting to learn about YouTube SEO
                and may not be implementing best practices consistently.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section1 m-2 mt-14 p-2 px-5 py-10 border-2 bg-white rounded-3xl flex shadow-lg">
        <div className="w-2/6 border-r-2">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2 font-bold">Video on Google</span>
            <AiOutlineInfoCircle size={20} />
          </div>
          <div>Top videos ranking on Google for this idea</div>
          <div className="mt-8">
            <div className="mt-5 flex items-center">
              <img
                src={thumbnail1}
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
            </div>
          </div>
        </div>

        <div className="w-4/6 px-8">
          <div className="flex items-center mb-2">
            <span className="text-xl mr-2 font-bold">
              Keywords You May Rank For
            </span>
            <AiOutlineInfoCircle size={20} />
          </div>
          <div
            className="rounded-full flex items-center justify-center py-2"
            style={{ backgroundColor: "#E8EBED" }}
          >
            Easy there dog
            <span
              className="py-1 px-2 rounded-full ml-5"
              style={{ backgroundColor: "#9FA4AC" }}
            >
              100
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Insights;
