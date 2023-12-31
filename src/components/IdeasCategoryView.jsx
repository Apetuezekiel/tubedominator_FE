import React, { useEffect, useState } from "react";
import { FaFolderPlus } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { getSavedIdeas, userFullDataDecrypted } from "../data/api/calls";
import { BiLoaderCircle } from "react-icons/bi";
import { AiFillCheckCircle } from "react-icons/ai";
import axios from "axios";
import showToast from "../utils/toastUtils";

const IdeasCategoryView = ({ dataSet, setShowSavedIdeaCategoryPanel }) => {
  console.log("dataSet", dataSet);
  const [categories, setCategories] = useState(["Uncategorized Ideas"]);
  const [fetchedSavedIdeas, setFetchedSavedIdeas] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showInputTag, setShowInputTag] = useState(false);
  const [addingNewFolder, setAddingNewFolder] = useState(false);
  const [addedNewFolder, setAddedNewFolder] = useState(false);
  const [savingKeywordIdea, setSavingKeywordIdea] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  // const decryptedFullData = userFullDataDecrypted();

  //   const [fetchingSavedIdeas, setFetchingSavedIdeas] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userSavedIdeas = await getSavedIdeas();
        console.log("userSavedIdeas from ideas category view", userSavedIdeas);

        // Create a Set to store unique categories
        const uniqueCategories = new Set();

        // Process the fetched data and add categories to the Set
        userSavedIdeas.forEach((item) => {
          uniqueCategories.add(item.category);
        });

        // Convert the Set back to an array (if needed)
        const uniqueCategoriesArray = Array.from(uniqueCategories);

        // Set the unique categories in the state
        setCategories(uniqueCategoriesArray);

        setFetchedSavedIdeas(true); // Data fetched successfully
        console.log("categories, categories", categories);
      } catch (error) {
        setFetchedSavedIdeas(true); // Handle the error
        console.error("Error fetching saved ideas:", error);
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, []);

  const handleFolderName = (event) => {
    setNewFolderName(event.target.value);
  };

  const handleCategoryChange = (event) => {
    // Get the selected value from the event
    const selectedValue = event.target.value;

    // Update the selected category in state
    setSelectedCategory(selectedValue);
  };

  const addNewFolder = () => {
    setAddingNewFolder(true);
    setCategories((prevCategories) => [...prevCategories, newFolderName]);
    setSelectedCategory(newFolderName);
    setAddedNewFolder(true);
    setShowInputTag(false);
  };

  const addSavedIdea = async () => {
    setSavingKeywordIdea(true);

    const requestBody = {
      video_ideas: dataSet.keyword || "",
      search_volume: dataSet.monthlysearch || "",
      keyword_diff: dataSet.difficulty || "",
      potential_views: dataSet.estimated_views || "",
      trend: dataSet.trend || "0",
      email: localStorage.getItem("userRegEmail") || "",
      category: selectedCategory || "Uncategorized Ideas",
      cpc: dataSet.cpc || "",
      cmp: dataSet.cmp || "",
      languageCode: dataSet.languageCode || "",
      countryCode: dataSet.countryCode || "",
      m1: `${dataSet.m1_month || ""}:${dataSet.m1_year || ""}:${
        dataSet.m1 || ""
      }`,
      m2: `${dataSet.m2_month || ""}:${dataSet.m2_year || ""}:${
        dataSet.m2 || ""
      }`,
      m3: `${dataSet.m3_month || ""}:${dataSet.m3_year || ""}:${
        dataSet.m3 || ""
      }`,
      m4: `${dataSet.m4_month || ""}:${dataSet.m4_year || ""}:${
        dataSet.m4 || ""
      }`,
      m5: `${dataSet.m5_month || ""}:${dataSet.m5_year || ""}:${
        dataSet.m5 || ""
      }`,
      m6: `${dataSet.m6_month || ""}:${dataSet.m6_year || ""}:${
        dataSet.m6 || ""
      }`,
      m7: `${dataSet.m7_month || ""}:${dataSet.m7_year || ""}:${
        dataSet.m7 || ""
      }`,
      m8: `${dataSet.m8_month || ""}:${dataSet.m8_year || ""}:${
        dataSet.m8 || ""
      }`,
      m9: `${dataSet.m9_month || ""}:${dataSet.m9_year || ""}:${
        dataSet.m9 || ""
      }`,
      m10: `${dataSet.m10_month || ""}:${dataSet.m10_year || ""}:${
        dataSet.m10 || ""
      }`,
      m11: `${dataSet.m11_month || ""}:${dataSet.m11_year || ""}:${
        dataSet.m11 || ""
      }`,
      m12: `${dataSet.m12_month || ""}:${dataSet.m12_year || ""}:${
        dataSet.m12 || ""
      }`,
    };

    console.log("requestBody", requestBody);

    const headers = {
      "Content-Type": "application/json",
      "x-api-key": process.env.REACT_APP_X_API_KEY,
      // Authorization: `Bearer ${decryptedFullData.token}`,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/addToSavedIdeas`,
        requestBody,
        { headers },
      );

      console.log(" and response:", response);

      if (response.data.success) {
        setSavingKeywordIdea(false);
        showToast("success", "Idea saved successfully", 2000);
        setShowSavedIdeaCategoryPanel(false);
      } else {
        throw new Error("Idea wasn't saved. Try again");
      }
    } catch (error) {
      console.error(error.message);
      setSavingKeywordIdea(false);
      showToast("error", "Idea wasn't saved. Try again", 2000);
      setShowSavedIdeaCategoryPanel(false);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div className="w-fit min-w-1/2 border border-gray-200 rounded-lg p-4 bg-white relative">
        <button
          className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={() => setShowSavedIdeaCategoryPanel(false)}
        >
          <MdCancel color="red" size={20} />
        </button>
        <h2 className="text-lg font-semibold mb-3">
          Categorize ideas for easy access
        </h2>
        <div className="flex items-center justify-center">
          {fetchedSavedIdeas === false && (
            <div className="ml-2 text-center">
              <div className="flex flex-col justify-center">
                <BiLoaderCircle
                  className="animate-spin text-center"
                  color="#7352FF"
                  size={20}
                />
                {/* <div>Loading Category Folders</div> */}
              </div>
            </div>
          )}
        </div>
        <div className="flex mt-3">
          <span className="w-1/3">Idea:</span>
          <span className="w-2/3 pl-20 font-semibold ml-2 text-lg capitalize break-words">
            {dataSet.string}
          </span>
        </div>
        <div className="flex mt-3">
          <span className="w-1/3">Folder:</span>
          <div className="relative pl-20 ml-4 w-2/3">
            <select
              className="rounded-full w-full py-2 pl-4 pr-8 border border-gray-300 bg-white text-xs"
              value={selectedCategory && selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="en">Choose a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category} className="text-black">
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="lg:flex mt-5">
          <div className="w-1/2">
            <button
              onClick={() => setShowInputTag(true)}
              className="text-left flex items-center w-fit mt-3 text-md py-2 px-5 rounded-full mr-3 border border-purple-600 text-purple-600"
            >
              New Folder <FaFolderPlus className="ml-3" color="#7438FF" />
            </button>
            {showInputTag && (
              <div className="flex items-center">
                <input
                  type="text"
                  className="w-4/5 rounded-full text-xs border mt-3 mr-3 border-purple-600 focus:border-purple-800 h-10 px-4 focus:outline-none"
                  placeholder="Name your new category folder"
                  value={newFolderName}
                  onChange={handleFolderName}
                />
                <AiFillCheckCircle
                  onClick={addNewFolder}
                  color="#7438FF"
                  size={30}
                  className="mt-2 cursor-pointer w-1/5"
                />
              </div>
            )}
          </div>
          <div className="w-1/2 text-right ml-3 flex items-center md:mt-5">
            <button
              style={{ border: "1px solid #CC0000", color: "#CC0000" }}
              className="mr-3 py-2 px-5 rounded-full text-md"
              onClick={() => setShowSavedIdeaCategoryPanel(false)}
            >
              Cancel
            </button>
            <div className="flex items-center justify-center">
              <button
                style={{
                  background:
                    fetchedSavedIdeas === false
                      ? "#7438FF"
                      : "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                  color: "white",
                }}
                className="text-center text-md text-white py-2 px-5 rounded-full flex items-center justify-center gap-2"
                onClick={addSavedIdea}
                disabled={fetchedSavedIdeas === false}
              >
                Done
                {savingKeywordIdea && (
                  <BiLoaderCircle
                    className="animate-spin ml-2"
                    color="white"
                    size={20}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeasCategoryView;
