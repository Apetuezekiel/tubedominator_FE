import React, { useEffect, useState } from "react";
import { FaFolderPlus } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { getSavedIdeas, userFullDataDecrypted } from "../data/api/calls";
import { BiLoaderCircle } from "react-icons/bi";
import { AiFillCheckCircle } from "react-icons/ai";
import axios from "axios";
import showToast from "../utils/toastUtils";

const IdeasCategoryDelete = ({
  dataSet,
  setShowSavedIdeaCategoryPanel,
  setUpdatedSavedIdea,
}) => {
  console.log("dataSet", dataSet);
  const [categories, setCategories] = useState(["Uncategorized Ideas"]);
  const [fetchedSavedIdeas, setFetchedSavedIdeas] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showInputTag, setShowInputTag] = useState(false);
  const [addingNewFolder, setAddingNewFolder] = useState(false);
  const [addedNewFolder, setAddedNewFolder] = useState(false);
  const [deletingKeywordIdea, setDeletingKeywordIdea] = useState(false);
  const [savingKeywordIdea, setSavingKeywordIdea] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(dataSet.category);
  const decryptedFullData = userFullDataDecrypted();

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
        setFetchedSavedIdeas(false); // Handle the error
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

  const removeSavedIdea = async () => {
    setDeletingKeywordIdea(true);
    const responseDelete = await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/deleteSavedIdea/${dataSet.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          Authorization: `Bearer ${decryptedFullData.token}`,
        },
        params: {
          email: decryptedFullData.email,
        },
      },
    );
    console.log(" and response:", responseDelete);
    if (responseDelete.data.success) {
      setUpdatedSavedIdea((prevState) => !prevState);
      setDeletingKeywordIdea(false);
      localStorage.removeItem('savedIdeasData');
      showToast("success", "Idea removed successfully", 2000);
      setShowSavedIdeaCategoryPanel(false);
    } else {
      setDeletingKeywordIdea(false);
      showToast("error", "Idea wasn't removed. Try again", 2000);
      setShowSavedIdeaCategoryPanel(false);
    }
  };

  const addSavedIdea = async () => {
    setSavingKeywordIdea(true);
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/addToSavedIdeas`,
      {
        video_ideas: dataSet.video_ideas,
        search_volume: dataSet.search_volume,
        keyword_diff: dataSet.keyword_diff,
        potential_views: dataSet.potential_views,
        trend: dataSet.trend,
        email: decryptedFullData.email,
        category: selectedCategory,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          Authorization: `Bearer ${decryptedFullData.token}`,
        },
      },
    );

    console.log(" and response:", response);
    if (response.data.success) {
      localStorage.removeItem('savedIdeasData');
      setUpdatedSavedIdea((prevState) => !prevState);
      setSavingKeywordIdea(false);
      showToast("success", "Idea saved successfully", 2000);
      setShowSavedIdeaCategoryPanel(false);
    } else {
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
      <div className="w-2/4 border border-gray-200 rounded-lg p-4 bg-white relative">
        <button
          className="absolute top-0 right-0 m-3 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={() => setShowSavedIdeaCategoryPanel(false)}
        >
          <MdCancel color="red" size={20} />
        </button>
        <h2 className="text-lg font-semibold mb-3">Manage Saved Ideas</h2>
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
            {dataSet.video_ideas}
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
        <div className="flex mt-5">
          <div className="w-1/2">
            <button
              onClick={() => setShowInputTag(true)}
              className="text-left flex items-center w-3/4 text-md py-2 px-5 rounded-full mr-3 border border-purple-600 text-purple-600"
            >
              New Folder <FaFolderPlus className="ml-3" color="#7438FF" />
            </button>
            {showInputTag && (
              <div className="flex items-center">
                <input
                  type="text"
                  className="rounded-full border mt-3 mr-3 border-purple-600 focus:border-purple-800 h-10 pl-4 pr-20 focus:outline-none"
                  placeholder="Name your new category folder"
                  value={newFolderName}
                  onChange={handleFolderName}
                />
                <AiFillCheckCircle
                  onClick={addNewFolder}
                  color="#7438FF"
                  size={30}
                  className="mt-2 cursor-pointer"
                />
              </div>
            )}
          </div>
          <div className="w-1/2 text-right ml-3 flex items-center">
            <div className="flex items-center mr-2">
              <button
                style={{ border: "1px solid #CC0000", color: "#CC0000" }}
                className=" py-2 px-5 rounded-full text-md"
                onClick={removeSavedIdea}
              >
                Remove Idea
              </button>
              {deletingKeywordIdea && (
                <BiLoaderCircle
                  className="animate-spin ml-1"
                  color="red"
                  size={20}
                />
              )}
            </div>
            <div className="flex items-center ml-2">
              <button
                style={{
                  backgroundColor:
                    fetchedSavedIdeas === false ? "gray" : "#7438FF",
                }}
                className="text-center text-md text-white py-2 px-5 rounded-full"
                onClick={addSavedIdea}
                disabled={fetchedSavedIdeas === false}
              >
                Done
              </button>
              {savingKeywordIdea && (
                <BiLoaderCircle
                  className="animate-spin ml-2"
                  color="#7352FF"
                  size={20}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeasCategoryDelete;
