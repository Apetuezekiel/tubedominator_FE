/* eslint-disable */
// import 'bootstrap/dist/css/bootstrap.css';

import heroImage from "../data/heroImage.png";
import prime from "../data/brand_logos/amazonprime-logo.svg";
import henkel from "../data/brand_logos/henkel-logo.svg";
import siemens from "../data/brand_logos/siemens-logo.svg";
import aasics from "../data/brand_logos/asics-logo.svg";
import merlin from "../data/brand_logos/leroy_merlin.svg";
import engel from "../data/brand_logos/engel_voelkers.svg";

function Home() {
  return (
    <div className="m-2 md:m-10 p-2 md:p-10 rounded-3xl">
      <section
        className="hero flex flex-col mt-20"
        style={{ backgroundColor: "#FBFCFE" }}
      >
        <div className="flex" style={{ backgroundColor: "#FBFCFE" }}>
          <div className="col-1 w-1/2 flex flex-col justify-between bg-black-900 mr-10">
            <div
              className="px-4 py-2 w-60 rounded-full"
              style={{ backgroundColor: "#F5F2FE", color: "#8754FE" }}
            >
              #1 YouTube SEO Software
            </div>
            <div className="heroMainText text-black mt-5">
              We Make YouTube <br /> Work for Business
            </div>
            <div className="mt-5">
              Tubedominator is more than just an agency. We empower brands with
              easy-to-use software tools, actionable insights, and expert agency
              services to grow their YouTube channel.
            </div>
            <div className="flex justify-center items-center mt-5 mr-5">
              <button
                style={{ backgroundColor: "#7438FF" }}
                className="w-full text-lg text-white py-5 px-5 rounded-full"
              >
                Talk to an Expert
              </button>
              <button
                style={{ backgroundColor: "transparent" }}
                className="w-full text-lg text-black py-5 px-5 rounded-full border-1 ml-5 border-black-900 outline-black-900"
              >
                Download Whitepaper
              </button>
            </div>
          </div>
          <div className="col-2 w-1/2">
            <img src={heroImage} alt="" className="heroImage" />
          </div>
        </div>
        <div className="brandLogoBox flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center text-lg">
            Powering YouTube growth for
          </div>
          <div className="flex justify-center items-center mt-5">
            <img className="brandLogos" src={prime} alt="" />
            <img className="brandLogos" src={henkel} alt="" />
            <img className="brandLogos" src={siemens} alt="" />
            <img className="brandLogos" src={aasics} alt="" />
            <img className="brandLogos" src={merlin} alt="" />
            <img className="brandLogos" src={engel} alt="" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
