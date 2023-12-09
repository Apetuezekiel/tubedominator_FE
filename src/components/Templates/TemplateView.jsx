import { AiFillCheckCircle } from "react-icons/ai";
import { BiCopy, BiLoaderCircle } from "react-icons/bi";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { IoPencil } from "react-icons/io5";
import { MdDeleteSweep } from "react-icons/md";
import showToast from "../../utils/toastUtils";
import axios from "axios";
import { userFullDataDecrypted } from "../../data/api/calls";

const TemplatesView = ({
  addTemplateBox,
  setAddTemplateBox,
  newTemplateData,
  saveUserTemplateSuccess,
  userChannelTemplates,
  fetchingUserTemplates,
  editUserTemplate,
  updateUserTemplate,
  deleteUserTemplate,
  setEditUserTemplate,
  setUserChannelTemplates,
  setNewTemplateData,
  setSaveUserTemplateSuccess,
  setUpdateUserTemplate,
  setUpdateUserTemplateSuccess,
  setDeleteUserTemplate,
  setDeleteUserTemplateSuccess,
}) => {
  const decryptedFullData = userFullDataDecrypted();
  const handleTemplateTitleChange = (index, value) => {
    const updatedTemplates = [...userChannelTemplates];
    updatedTemplates[index].title = value;
    setUserChannelTemplates(updatedTemplates);
  };

  const handleTemplateContentChange = (index, value) => {
    const updatedTemplates = [...userChannelTemplates];
    updatedTemplates[index].content = value;
    setUserChannelTemplates(updatedTemplates);
  };

  const handleNewTemplateChange = (e) => {
    const { name, value } = e.target;
    setNewTemplateData({ ...newTemplateData, [name]: value });
  };

  const clearNewTemplateData = () => {
    setNewTemplateData({
      title: "",
      content: "",
    });
  };

  const addNewUserTemplate = async () => {
    setSaveUserTemplateSuccess(true);
    if (newTemplateData.title === "" || newTemplateData.content === "") {
      console.log("Template is empty. Please provide a Template.");
      showToast("error", "Template title and content must not be empty", 2000);
      return;
    }
    // showToast("success", `newTemplateData ${newTemplateData.title}`, 2000);
    console.log("newTemplateData", newTemplateData);

    // setIsAddKeyword(false);

    try {
      const saveUserTemplateResponse = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/saveUserTemplate`,
        {
          title: newTemplateData.title,
          content: newTemplateData.content,
          email: decryptedFullData.email,
          user_id: decryptedFullData.user_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            Authorization: `Bearer ${decryptedFullData.token}`,
          },
        },
      );

      console.log("API response:", saveUserTemplateResponse.data);
      if (saveUserTemplateResponse.data.success) {
        setSaveUserTemplateSuccess(false);
        setAddTemplateBox(false);
        showToast("success", "Template saved successfully", 2000);
      }
    } catch (error) {
      setSaveUserTemplateSuccess(false);
      console.error("Error while making API call:", error);
      showToast(
        "error",
        "could not add keyword. Please try again. Dont refresh so information isn't lost",
        5000,
      );
    }

    // setUserKeyword(""); // Clear the userKeyword after successful submission
  };

  const updateUserTemplateFunc = async (index) => {
    setUpdateUserTemplate(true);
    if (
      userChannelTemplates[index].title === "" ||
      userChannelTemplates[index].content === ""
    ) {
      console.log("Template is empty. Please provide a Template.");
      showToast("error", "Template title and content must not be empty", 2000);
      return;
    }
    // showToast(
    //   "success",
    //   `newTemplateData ${userChannelTemplates[index].title}`,
    //   2000,
    // );
    console.log("userChannelTemplates[index]", userChannelTemplates[index]);

    try {
      const templateId = userChannelTemplates[index].id;
      const updateUserTemplateResponse = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/updateUserTemplate`,
        {
          title: userChannelTemplates[index].title,
          content: userChannelTemplates[index].content,
          email: decryptedFullData.email,
          template_id: templateId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            Authorization: `Bearer ${decryptedFullData.token}`,
          },
        },
      );

      console.log("API response:", updateUserTemplateResponse.data);

      if (updateUserTemplateResponse.data.success) {
        setUpdateUserTemplate(false);
        setUpdateUserTemplateSuccess(true);
        setEditUserTemplate(-1);
        setAddTemplateBox(false);
        showToast("success", "Template updated successfully", 2000);
      }
    } catch (error) {
      setUpdateUserTemplate(false);
      console.error("Error while making API call:", error);
      showToast(
        "error",
        "Could not update Template. Please try again. Don't refresh so information isn't lost",
        5000,
      );
    }
  };

  const deleteUserTemplateFunc = async (index) => {
    setDeleteUserTemplate(index);

    const templateId = userChannelTemplates[index].id;

    try {
      const deleteUserTemplateResponse = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/deleteUserTemplate`,
        {
          email: decryptedFullData.email,
          template_id: templateId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_X_API_KEY,
            Authorization: `Bearer ${decryptedFullData.token}`,
          },
        },
      );

      console.log("API response:", deleteUserTemplateResponse.data);

      if (deleteUserTemplateResponse.data.success) {
        setDeleteUserTemplate(-1);
        setDeleteUserTemplateSuccess(true);
        showToast("success", "Template deleted successfully", 2000);
      }
    } catch (error) {
      setDeleteUserTemplate(-1);
      console.error("Error while making API call:", error);
      showToast(
        "error",
        "Could not delete Template. Please try again. Don't refresh so information isn't lost",
        5000,
      );
    }
  };

  return (
    <div className="w-1/2 h-full overflow-y-auto p-4">
      <div className="p-4">
        <div className="flex flex-col items-center justify-center h-full mb-5">
          <div className="p-4 w-full">
            <div className="mb-4 flex items-center justify-between">
              <span>Template</span>
              {addTemplateBox === false && (
                <button
                  onClick={() => {
                    clearNewTemplateData();
                    setAddTemplateBox(true);
                  }}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px #4F4EB1 solid",
                  }}
                  className="text-md py-2 px-5 rounded-full ml-10 mr-3 flex items-center"
                >
                  <BsFillPlusCircleFill
                    color="#7438FF"
                    className="mr-2"
                    size={20}
                  />{" "}
                  New Template
                </button>
              )}
            </div>
            {addTemplateBox === true && (
              <div className="new_template bg-white mt-5 border border-gray-300 py-5 px-4 rounded-md">
                <div className="mb-4 flex items-center justify-between">
                  <span> New Template</span>
                  <div className="flex gap-1 items-center">
                    <span
                      className="cursor-pointer"
                      style={{ color: "#7438FF" }}
                      onClick={() => setAddTemplateBox(false)}
                    >
                      CANCEL
                    </span>
                    <button
                      onClick={() => {
                        showToast("message", newTemplateData.title, 2000);
                      }}
                      style={{
                        background:
                          "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                        color: "white",
                      }}
                      className="text-md text-white py-2 px-5 rounded-full ml-10 mr-3"
                    >
                      {/* <span className="flex items-center" onClick={addNewUserTemplate}>Save <AiFillCheckCircle color="white" className="ml-2"/> {saveUserTemplateSuccess === false && <FiLoader/>}</span> */}
                      <span
                        className={`flex items-center rounded-full`}
                        onClick={addNewUserTemplate}
                      >
                        Save{" "}
                        <AiFillCheckCircle color="white" className="ml-2" />
                        {saveUserTemplateSuccess && (
                          <span className={"animate-spin ml-2"}>
                            <BiLoaderCircle color="white" size={20} />
                          </span>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  className="border-b border-gray-300 outline-none focus:border-purple-600 w-full py-1 mb-8"
                  placeholder="Add title for your template"
                  name="title"
                  value={newTemplateData.title}
                  onChange={handleNewTemplateChange}
                />
                <textarea
                  className="border-b border-gray-300 outline-none focus:border-purple-600 w-full py-1"
                  placeholder="Add template content here"
                  rows="5"
                  name="content"
                  value={newTemplateData.content}
                  onChange={handleNewTemplateChange}
                />
              </div>
            )}
            {fetchingUserTemplates ? (
              <div className="w-full flex justify-center">
                <BiLoaderCircle
                  className="animate-spin"
                  color="#7438FF"
                  size={30}
                />
              </div>
            ) : userChannelTemplates.length >= 1 ? (
              userChannelTemplates.map((item, index) => (
                <div key={index}>
                  {editUserTemplate === index ? (
                    <div className="edit_template bg-white mt-5 border border-gray-300 py-5 px-4 rounded-md">
                      <div className="mb-4 flex items-center justify-between">
                        <span>Edit Template</span>
                        <div className="flex gap-1 items-center">
                          <span style={{ color: "#7438FF" }}>CANCEL</span>
                          <button
                            onClick={updateUserTemplate}
                            style={{
                              background:
                                "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                              color: "white",
                            }}
                            className="text-md text-white py-2 px-5 rounded-full ml-10 mr-3"
                          >
                            <span
                              className={`flex items-center`}
                              onClick={() => updateUserTemplateFunc(index)}
                            >
                              Save{" "}
                              <AiFillCheckCircle
                                color="white"
                                className="ml-2"
                              />
                              {updateUserTemplate && (
                                <span className={"animate-spin ml-2"}>
                                  <BiLoaderCircle color="white" size={20} />
                                </span>
                              )}
                            </span>
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        className="border-b border-gray-300 outline-none focus:border-purple-600 w-full py-1 mb-8"
                        placeholder="Add title for your template"
                        value={item.title}
                        onChange={(e) =>
                          handleTemplateTitleChange(index, e.target.value)
                        }
                      />
                      <textarea
                        className="border-b border-gray-300 outline-none focus-border-purple-600 w-full py-1"
                        placeholder="Add template content here"
                        rows="5"
                        value={item.content}
                        onChange={(e) =>
                          handleTemplateContentChange(index, e.target.value)
                        }
                      />
                    </div>
                  ) : (
                    <div className="saved_template bg-white mt-5 border border-gray-300 py-5 px-4 rounded-md">
                      <div className="mt-2 mb-4 flex items-center justify-between">
                        <span>{item.title}</span>
                        <span className="flex items-center mr-3">
                          {deleteUserTemplate === index ? (
                            <span className="animate-spin ml-2">
                              <BiLoaderCircle color="#7438FF" size={20} />
                            </span>
                          ) : (
                            <MdDeleteSweep
                              onClick={() => deleteUserTemplateFunc(index)}
                              color="#7438FF"
                              size={25}
                              className="cursor-pointer"
                            />
                          )}
                          <IoPencil
                            onClick={() => setEditUserTemplate(index)}
                            color="#7438FF"
                            className="ml-2"
                            size={25}
                          />
                        </span>
                      </div>
                      <hr />
                      <div className="mt-2 mb-4 flex items-center justify-between">
                        <span>{item.content}</span>
                        <span className="flex items-center mr-3">
                          <BiCopy color="#7438FF" size={25} />
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="w-full flex justify-center">
                You have no Templates. Add one
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesView;
