/* eslint-disable */

import homeImage from "../assets/images/HomeImage.png";
import homeBg from "../assets/images/homeBg.png";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      className="w-full h-screen pt-20"
      style={{ backgroundImage: `url(${homeBg})`, backgroundSize: "cover" }}
    >
      <section className="hero flex justify-center w-full h-1/2">
        <div className="w-full">
          <div className="flex flex-col justify-between items-center bg-black-900 mr-10">
            <div
              className="px-4 py-2 w-60 rounded-full"
              style={{ backgroundColor: "#F5F2FE", color: "#8754FE" }}
            >
              #1 YouTube SEO Software
            </div>
            <div className="heroMainText text-black mt-5">
              We Make YouTube <br /> Work for Business
            </div>
            <div className="mt-5 w-1/2 text-center">
              Tubedominator is more than just an agency. We empower brands with
              easy-to-use software tools, actionable insights, and expert agency
              services to grow their YouTube channel.
            </div>
            <div className="flex justify-center items-center mt-5 mr-5">
              <Link to="/sign-in">
                <button
                  style={{ backgroundColor: "#7438FF" }}
                  className="w-full text-lg text-white py-2 px-5 rounded-full"
                >
                  Start Your Journey Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="relative h-1/2">
        <img
          src={homeImage}
          alt=""
          className="absolute left-1/2 transform -translate-x-1/2 bottom-0"
        />
      </div>
    </div>
  );
}

export default Home;
