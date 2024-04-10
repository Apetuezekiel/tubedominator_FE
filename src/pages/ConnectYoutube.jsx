import { useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import { FaInfoCircle, FaYoutube } from "react-icons/fa";
import appLogo from "../assets/images/TubeDominator 1000x1000.png";
import GoogleLoginComp from "./UserAuth/GoogleLogin";
import { NavLink } from "react-router-dom";
import accountIllus from "../assets/images/brand loyalty-rafiki.png";
import homeBg from "../assets/images/homeBg.png";
import youtubeIllus from "../assets/images/HomeImage.png";
import { useInitializeOAuth } from "../state/state";

const ConnectYoutube = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });

  const initializeOAuth = useInitializeOAuth((state) => state.initializeOAuth);
  const setInitializeOAuth = useInitializeOAuth(
    (state) => state.setInitializeOAuth,
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
      return;
    }
    if (!formData.password) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));
      return;
    }
    console.log("Login successful!");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      // style={{ backgroundImage: `url(${homeBg})`, backgroundSize: "cover" }}
    >
      <div className="w-full flex-1 mt-8">
        <div className="flex flex-col items-center"></div>
        <div className="my-12 text-center">
          <div
            className="leading-none px-2 inline-block text-2xl whitespace-normal w-1/2 text-black font-extrabold tracking-wide transform translate-y-1/2"
            style={{ lineHeight: "30px" }}
          >
            One more step to power up Your Youtube Channel with TubeDominator's
            awesome features
          </div>
        </div>
        <div className="mx-auto max-w-xs">
          <div>
            <img
              src={accountIllus}
              alt="Sales magnet illustration"
              className="mb-5"
            />
          </div>

          <div style={{ marginTop: "100px" }}>
            <div className="-mb-24 ml-14 opacity-0">
              <GoogleLoginComp />
            </div>
            <div
              className="flex items-center justify-center ml-6 mt-10 px-1 py-3 rounded-md"
              style={{
                background:
                  "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                color: "white",
              }}
            >
              <div className="mr-3">
                <FaYoutube size={20} />
              </div>
              <div className="capitalize pr-4 text-white">
                Connect your Youtube
              </div>
            </div>
            {/* <hr />
            <div
              className="text-sm mb-1 ml-1 text-white cursor-pointer mt-10 rounded-md px-10 py-5 flex flex-col justify-center items-center gap-3"
              style={{
                background:
                  "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                color: "white",
              }}
            >
              <FaInfoCircle size={30} />
              <span>
                TubeDominator complies with the Google API Services User Data
                Policy, including Limited Use requirements. Information obtained
                from Google APIs is used and transferred within the app in
                adherence to these policies. For details, please refer to the
                Google API Services User Data Policy.
              </span>
            </div> */}
          </div>
        </div>
                  
      </div>
    </div>
  );
};

export default ConnectYoutube;
