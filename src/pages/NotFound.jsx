import React from "react";
import { Link } from "react-router-dom";
import notFoundImage from "../assets/images/not-found.png"; // Add the path to your 404 image

function NotFound() {
  return (
    <div className="w-full h-screen pt-20">
      <section className="hero flex justify-center w-full h-1/2">
        <div className="w-full">
          <div className="flex flex-col justify-between items-center bg-black-900 mr-10">
            {/* <div
              className="px-4 py-2 w-60 rounded-full"
              style={{ backgroundColor: "#F5F2FE", color: "#8754FE" }}
            >
              404 Not Found
            </div> */}
            <img src={notFoundImage} alt="" className="mx-auto h-72" />
            <div className="heroMainText text-black mt-5">
              Oops! Page Not Found
            </div>
            <div className="mt-5 w-1/2 text-center">
              The page you are looking for might be in another universe.
            </div>
            <div className="flex justify-center items-center mt-5 mr-5">
              <Link to="/">
                <button
                  style={{
                    background:
                      "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                    color: "white",
                  }}
                  className="w-full text-lg text-white py-3 px-5 rounded-full"
                >
                  Go Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* <div className="relative h-1/2">
        <img
          src={notFoundImage}
          alt=""
          className="absolute left-1/2 transform -translate-x-1/2 bottom-20 h-96"
        />
      </div> */}
    </div>
  );
}

export default NotFound;
