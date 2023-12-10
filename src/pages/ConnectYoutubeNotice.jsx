import { useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import appLogo from "../assets/images/TubeDominator 1000x1000.png";
import pagePic from "../assets/images/3d-youtube-logo-silver-stand-with-dark-logos-background.jpg";
import GoogleLoginComp from "./UserAuth/GoogleLogin";
import { NavLink } from "react-router-dom";
import accountIllus from "../assets/images/brand loyalty-rafiki.png";
import homeBg from "../assets/images/homeBg.png";
import youtubeIllus from "../assets/images/HomeImage2.png";

const ConnectYoutube = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation logic goes here
    // For instance:
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

    // If validation passes, perform login or sign up action
    // This is a mock representation of a successful login:
    console.log("Login successful!");
  };

  return (
    // <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
    <div
      className="w-full max-h-screen h-screen bg-gray-100 text-gray-900 flex justify-center items-center  "
      style={{ backgroundImage: `url(${homeBg})`, backgroundSize: "cover" }}
    >
      <div className="w-full flex-1">
        {/* <div className="my-12 text-center">
          <div
            className="leading-none px-2 inline-block text-2xl whitespace-normal w-1/2 text-black font-extrabold tracking-wide transform translate-y-1/2"
            style={{ lineHeight: "30px" }}
          >
            One more step to power up Your Youtube Channel with TubeDominator's
            awesome features
          </div>
        </div> */}
        <div className="text-center">
          <div
            className="leading-none px-2 inline-block text-2xl whitespace-normal w-1/2 text-black font-extrabold tracking-wide"
            style={{ lineHeight: "30px" }}
          >
            Hey there, Thank you once again for your patronage. <br />
            <br /> Kindly note that we're here to provide an adequate support
            until you start getting outstanding results with the platform.
            <br />
            <br />
            For now, to get started kindly provide us with the gmail account
            that is tied to your YouTube channel so we can approve it on the
            platform to enable you enjoy all the awesome features of
            TubeDominator.
            <br />
            <br />
            NOTE: Send the gmail address here:
            <div style={{ color: "#0000EE" }}>
              <a href="mailto:support@supremewebcustomercare.freshdesk.com">
                support@supremewebcustomercare.freshdesk.com
              </a>
            </div>
            and we will get it approved immediately. Thank you and let's make
            YouTube work for your business.
          </div>
        </div>
                  
      </div>
    </div>
  );
};

export default ConnectYoutube;
