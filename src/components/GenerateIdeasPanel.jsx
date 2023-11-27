import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { HiLightningBolt } from "react-icons/hi";
import countriesWithLanguages from "../data/countries";
import { BsLightningChargeFill } from "react-icons/bs";
import { FaLongArrowAltRight } from "react-icons/fa";

const GenerateIdeasPanel = ({
  onSearchChange,
  setShowSearchPanel,
  setSearchQueryComplete,
}) => {
  const initialCountry = {
    countryCode: "GLB",
    languageCode: "en",
  };
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [searchQuery, setSearchQuery] = useState("");
  //   const [searchQueryComplete, setSearchQueryComplete] = useState("");

  const handleCountryChange = (event) => {
    const selectedValue = event.target.value;
    const [selectedCountryCode, selectedLanguageCode] =
      selectedValue.split(":");

    setSelectedCountry({
      countryCode: selectedCountryCode,
      languageCode: selectedLanguageCode,
    });
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  const isSearchEmpty = searchQuery.trim() === "";

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div className="bg-white w-2/6 p-5 rounded-md">
        <div className="flex justify-between">
          <div></div>
          <span
            className="text-right text-xs rounded-full h-5 w-5 flex justify-end m-auto cursor-pointer"
            style={{
              background:
                "linear-gradient(210.54deg, #9999FF 7.79%, #4B49AC 92.58%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setShowSearchPanel(false);
            }}
          >
            X
          </span>
        </div>

        <div className="rounded-md">
          <span className="flex items-center text-xs font-bold mb-5">
            <HiLightningBolt className="mr-2" color="#8C52FF" /> Get Ideas
          </span>
          <div className="w-full flex items-center">
            <div>
              <span className="text-xs">Enter a Topic</span>
              <div className="flex items-center flex-col justify-start">
                <div className="w-full max-w-xs flex items-center border border-gray-300 bg-white rounded-full">
                  <input
                    type="text"
                    placeholder="Enter a topic, brand, or product"
                    className="flex-grow bg-transparent outline-none pr-2 text-xs py-3 px-3"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <BiSearch className="text-gray-500 text-xs mr-3" />
                </div>
              </div>
            </div>
            <div className="ml-5">
              <span className="text-xs">Language</span>
              <div className="relative">
                <select
                  id="countrySelect"
                  className="rounded-full py-2 pl-4 pr-8 border border-gray-300 bg-white text-xs"
                  value={`${selectedCountry.countryCode}:${selectedCountry.languageCode}`}
                  onChange={handleCountryChange}
                >
                  <option value="GLB:en">Global (English)</option>
                  {countriesWithLanguages.map((item, index) => (
                    <option
                      key={index}
                      value={`${item.countryCode}:${item.languageCode}`}
                    >
                      {`${item.country} (${item.language})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <button
          className={`text-white rounded-full px-7 py-2 mt-5 flex items-center text-xs getIdeasBtn text-center`}
          onClick={() => {
            setSearchQueryComplete(true);
            setShowSearchPanel(false);
          }}
          disabled={isSearchEmpty}
          style={{
            background: isSearchEmpty
              ? "rgba(169, 169, 169, 0.5)" // Grayed out background
              : "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%)",
          }}
        >
          GENERATE
          <FaLongArrowAltRight className="ml-2" color="white" />
        </button>
      </div>
    </div>
  );
};

export default GenerateIdeasPanel;
