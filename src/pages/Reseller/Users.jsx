/* eslint-disable */
import React, { useEffect, useState } from "react";
import "../../index.css";
import axios from "axios";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  ContextMenu,
  Filter,
  Page,
  ExcelExport,
  PdfExport,
  Edit,
  Inject,
} from "@syncfusion/ej2-react-grids";
import { Header } from "../../components";
import IdeasCategoryView from "../../components/IdeasCategoryView";
import {
  useUserYoutubeInfo,
  useKeywordStore,
  useSavedIdeasData,
  useUserAuthToken,
  useUserLoggedin,
  useAllUserDeets,
} from "../../state/state";
import { useStateContext } from "../../contexts/ContextProvider";
import { useUser } from "@clerk/clerk-react";
import showToast from "../../utils/toastUtils";
// import { getUserEncryptedData } from "../data/api/calls";
import CryptoJS from "crypto-js";
import {
  deleteResellerUser,
  fetchResellerUsers,
  updateResellerUserStatus,
} from "../../data/api/calls";
import {
  AiOutlineStar,
  AiFillStar,
  AiOutlineInteraction,
} from "react-icons/ai";
import {
  FaUserAlt,
  FaGoogle,
  FaPlus,
  FaVideo,
  FaFolderPlus,
  FaCheckCircle,
} from "react-icons/fa";
import {
  BiSearch,
  BiWorld,
  BiStar,
  BiLoaderCircle,
  BiArrowBack,
} from "react-icons/bi";
import { FiEye, FiSearch, FiTrendingUp } from "react-icons/fi";
import {
  BsArrowDownShort,
  BsArrowUpShort,
  BsCalendarDateFill,
  BsDot,
  BsLightningChargeFill,
} from "react-icons/bs";
import { RiAccountCircleFill, RiKey2Fill } from "react-icons/ri";
import { formatNumberToKMBPlus } from "../../data/helper-funtions/helper";
import Insights from "../keywords/Insights";
import Competition from "../keywords/Competition";
import Loader from "../../components/Loader";
import GenerateIdeasPanel from "../../components/GenerateIdeasPanel";
import LoaderPanel from "../../components/LoaderPanel";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import AddUserPanel from "../../components/AddUserPanel";
import EditUserPanel from "../../components/EditUserPanel";
import {
  MdOutlineMail,
  MdOutlineSkipNext,
  MdOutlineSkipPrevious,
} from "react-icons/md";
// import { statusTitleTemplate, accountTypeTitleTemplate, nameTitleTemplate, emailTitleTemplate, dateTitleTemplate } from "../data/api/tableHelper";

const Users = ({ userCat, addUserCTA, userPageTitle, userPageTag }) => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const decryptAndRetrieveData = (data) => {
    const secretKey = "+)()^77---<@#$>";

    if (data) {
      const decryptedBytes = CryptoJS.AES.decrypt(data, secretKey);
      const decryptedData = JSON.parse(
        decryptedBytes.toString(CryptoJS.enc.Utf8),
      );
      return decryptedData;
    }
    return null;
  };

  const userAuthToken = useUserAuthToken((state) => state.userAuthToken);
  const setUserAuthToken = useUserAuthToken((state) => state.setUserAuthToken);
  // const { user } = useUser();
  const userYoutubeData = useUserYoutubeInfo((state) => state.userYoutubeData);
  const setUserYoutubeData = useUserYoutubeInfo(
    (state) => state.setUserYoutubeData,
  );
  const { savedIdeasData, setSavedIdeasData, fetchSavedIdeasData } =
    useSavedIdeasData();

  const exactKeywordData = useKeywordStore((state) => state.exactKeywordData);
  const setExactKeywordData = useKeywordStore(
    (state) => state.setExactKeywordData,
  );
  const relatedKeywordData = useKeywordStore(
    (state) => state.relatedKeywordData,
  );
  const setRelatedKeywordData = useKeywordStore(
    (state) => state.setRelatedKeywordData,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [fetchingUsersData, setFetchingUsersData] = useState(true);
  const [isLoading, setIsLoading] = useState(null);
  const [loadedLocalStorage, setLoadedLocalStorage] = useState(false);
  const [ideasDataSet, setIdeasDataSet] = useState(false);
  const [showSavedIdeaCategoryPanel, setShowSavedIdeaCategoryPanel] =
    useState(false);
  const [savingKeywordIdea, setSavingKeywordIdea] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const userLoggedIn = useUserLoggedin((state) => state.userLoggedIn);
  const setUserLoggedIn = useUserLoggedin((state) => state.setUserLoggedIn);
  const allUserDeets = useAllUserDeets((state) => state.allUserDeets);
  const setAllUserDeets = useAllUserDeets((state) => state.setAllUserDeets);
  const encryptedGData = localStorage.getItem("encryptedGData");
  // const decryptedFullData = userFullDataDecrypted();
  const [keywordSuggestionRemark, setKeywordSuggestionRemark] = useState("");
  const [showCompetition, setShowCompetition] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [showLoaderPanelDelete, setShowLoaderPanelDelete] = useState(false);
  const [showLoaderPanelBlock, setShowLoaderPanelBlock] = useState(false);
  const [showLoaderPanelUnblock, setShowLoaderPanelUnblock] = useState(false);
  const [reloadUsersData, setReloadUsersData] = useState(false);
  const [searchQueryComplete, setSearchQueryComplete] = useState("");
  const [selectedUserProps, setSelectedUserProps] = useState({});
  const [showEditUserPanel, setShowEditUserPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const userType = userCat.toLowerCase();
    console.log("userType", userType);
    const fetchData = async (page) => {
      try {
        const result = await fetchResellerUsers(userType, page);
        console.log("Resellers Data", result.data);
        setUsersData(result.data);
        setTotalPages(result.totalPages);
        setCurrentPage(result.currentPage);
        setFetchingUsersData(false);
        // setFetchedSavedIdeas(true);
      } catch (error) {
        setFetchingUsersData(false);
        // setFetchedSavedIdeas(false);
        console.error("Error fetching saved ideas:", error);
      }
    };

    fetchData(currentPage);
  }, [reloadUsersData, currentPage]);

  const refetchUsersData = async (action) => {
    const loaderState =
      action === "block"
        ? setShowLoaderPanelBlock
        : action === "delete"
        ? setShowLoaderPanelDelete
        : setShowLoaderPanelUnblock;

    try {
      const userType = userCat.toLowerCase();

      const result = await fetchResellerUsers(userType, currentPage);
      setUsersData(result.data);
      loaderState(false);
    } catch (error) {
      console.error("Error re-fetching users data:", error);
    }
  };

  const loaderPanelFunc = (message) => {
    return <LoaderPanel message={`${message}`} />;
  };

  const dateTemplate = (props) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return (
      <div className="flex justify-center items-center">
        {new Date(props.created_at).toLocaleDateString("en-US", options)}
      </div>
    );
  };

  const updateUserStatusApi = async (action, id) => {
    const loaderState =
      action === "block" ? setShowLoaderPanelBlock : setShowLoaderPanelUnblock;

    loaderState(true);

    console.log("caught this id", id);
    try {
      const response = await updateResellerUserStatus(action, id);

      if (response.success === true) {
        showToast(
          "success",
          `user ${action === "block" ? "Blocked" : "Unblocked"}`,
          2000,
        );
        // setReloadUsersData(true);
        refetchUsersData(action);
      } else {
        showToast("error", response.message || "An error occurred", 2000);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      showToast("error", "An error occurred", 2000);
    } finally {
      loaderState(false);
    }
  };

  const deleteUserApi = async (id) => {
    setShowLoaderPanelDelete(true);
    try {
      const response = await deleteResellerUser(id);

      if (response.success === true) {
        showToast("success", `User Deleted`, 2000);
        setShowLoaderPanelDelete(false);
        refetchUsersData("delete");
      } else {
        setShowLoaderPanelDelete(false);
        showToast("error", response.message || "An error occurred", 2000);
      }
    } catch (error) {
      setShowLoaderPanelDelete(false);
      console.error("Error deleting user:", error);
      showToast("error", "An error occurred", 2000);
    }
  };

  const statusTemplate = (props) => {
    const status = props.status || "active"; // Default to "active" if status is null or undefined

    return (
      <button
        type="button"
        style={{
          backgroundColor:
            status === "blocked"
              ? "#FBDBC8"
              : status === "active"
              ? "#D2E7D0"
              : "transparent",
        }}
        className="px-2 capitalize rounded-2xl text-xs py-0.5 KwDiffButtonSize flex items-center justify-center"
      >
        {status}
      </button>
    );
  };

  // const actionTemplate = (props) => {
  //   return actionTemplateFunc(
  //     props,
  //     setShowLoaderPanelBlock,
  //     setShowLoaderPanelDelete,
  //     setShowLoaderPanelUnblock,
  //     refetchUsersData,
  //   );
  // };

  const actionTemplate = (props) => {
    const status = props.status || "active";
    const actionText = status === "active" ? "block" : "unblock";

    return (
      <span className="flex items-center justify-start gap-2 text-xs">
        <span
          onClick={() =>
            // editUserApi(
            //   props
            // )
            {
              setSelectedUserProps(props);
              setShowEditUserPanel(true);
            }
          }
          style={{
            backgroundColor: "#D2E7D0",
          }}
          className="px-2 capitalize rounded-2xl text-xs py-1 KwDiffButtonSize flex items-center justify-center cursor-pointer"
        >
          {"Edit"}
        </span>
        <span>|</span>
        <span
          onClick={() => updateUserStatusApi(actionText, props.id)}
          style={{
            backgroundColor:
              actionText === "block"
                ? "#FBDBC8"
                : actionText === "unblock"
                ? "#D2E7D0"
                : "transparent",
          }}
          className="px-2 capitalize rounded-2xl text-xs py-1 KwDiffButtonSize flex items-center justify-center cursor-pointer"
        >
          {actionText}
        </span>
        <span>|</span>
        <span
          onClick={() => deleteUserApi(props.id)}
          className="px-2 capitalize rounded-2xl text-xs py-1 KwDiffButtonSize flex items-center justify-center cursor-pointer"
          style={{
            backgroundColor: "#FBDBC8",
          }}
        >
          delete
        </span>
      </span>
    );
  };

  const emailTemplate = (props) => {
    return <span className="">{props.email}</span>;
  };

  const accountTypeTemplate = (props) => {
    return (
      <span className="flex items-center justify-center">
        {props.accountType}
      </span>
    );
  };

  const MailIcon = [MdOutlineMail];
  const profileIcon = [FaUserAlt];

  function IconsWithTitle({ title, icons, color }) {
    return (
      <div className="flex items-center">
        {title}
        {icons.map((Icon, index) => (
          <span key={index} style={{ marginLeft: "5px", display: "flex" }}>
            <Icon color={`${color && color}`} />
          </span>
        ))}
      </div>
    );
  }

  const emailTitleTemplate = (props) => {
    return (
      <div className="flex items-center">
        <IconsWithTitle
          title={props.headerText}
          icons={MailIcon}
          color={"#9967FF"}
        />
      </div>
    );
  };

  const accountTypeTitleTemplate = (props) => {
    const trendIcon = <RiAccountCircleFill size={15} color="green" />;
    return (
      <div className="flex items-center justify-center">
        {props.headerText}
        <div className="ml-2">{trendIcon}</div>
      </div>
    );
  };

  const dateTitleTemplate = (props) => {
    const diffIcon = <BsCalendarDateFill size={15} color="#9967FF" />;
    return (
      <div className="flex items-center justify-center">
        {props.headerText}
        <div className="ml-2">{diffIcon}</div>
      </div>
    );
  };

  const statusTitleTemplate = (props) => {
    const icon = <FaCheckCircle size={15} color="#E87A00" />;
    return (
      <div className="flex items-center justify-center">
        {props.headerText}
        <div className="ml-2">{icon}</div>
      </div>
    );
  };

  const actionTitleTemplate = (props) => {
    const icon = <AiOutlineInteraction size={15} color="#E87A00" />;
    return (
      <div className="flex items-center justify-center">
        {props.headerText}
        <div className="ml-2">{icon}</div>
      </div>
    );
  };

  const nameTitleTemplate = (props) => {
    return (
      <div className="tooltip-container flex items-center justify-center break-words">
        <IconsWithTitle
          title={props.headerText}
          icons={profileIcon}
          color={"green"}
        />
      </div>
    );
  };

  const nameTemplate = (props) => {
    // console.log("proppsssss", props);
    return (
      <div className="flex flex-col break-words">
        <span className="text-md capitalize">{props.fullName}</span>
      </div>
    );
  };

  const gridInstance = React.createRef();

  const exportToExcel = () => {
    if (gridInstance.current) {
      gridInstance.current.excelExport();
    }
  };

  const filterBySearchQuery = (keywordsArray, searchQuery) => {
    const filteredKeywords = keywordsArray.filter((keywordObj) => {
      const lowerSearchQuery = searchQuery.toLowerCase();
      const lowerKeyword = keywordObj.keyword.toLowerCase();

      return lowerKeyword.includes(lowerSearchQuery);
    });

    setRelatedKeywordData(filteredKeywords);
  };

  const serveAllVideoIdeas = () => {
    let savedData = JSON.parse(localStorage.getItem("lastVideoIdeas"));

    setRelatedKeywordData(savedData.related_keywords);
    setExactKeywordData(savedData.exact_keyword);
  };

  const searchFilter = (data, searchString) => {
    const lowerCaseSearch = searchString.toLowerCase();

    if (!lowerCaseSearch) {
      return data; // Return original data if search string is empty
    }

    const filteredData = data.filter((item) => {
      const fullNameMatch = item.fullName
        .toLowerCase()
        .includes(lowerCaseSearch);
      const emailMatch = item.email.toLowerCase().includes(lowerCaseSearch);

      // Return true if either fullName or email contains the search string
      return fullNameMatch || emailMatch;
    });

    return filteredData;
  };

  // const handleSearchChange = (event) => {
  //   const newSearchQuery = event.target.value;
  //   setSearchQuery(newSearchQuery);
  //   const userType = userCat.toLowerCase();

  //   if (!newSearchQuery) {
  //     const originalData = JSON.parse(localStorage.getItem(`${userType}-data`));

  //     // Check if originalData is not null or undefined before assigning to usersData
  //     if (originalData != null) {
  //       console.log("originalData", originalData);
  //       setUsersData(originalData);
  //     }
  //   } else {
  //     // Filter the data based on the new search query
  //     const filteredResults = searchFilter(usersData, newSearchQuery);
  //     setUsersData(filteredResults);
  //   }
  // };

  const handleSearchChange = (event) => {
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);

    if (!newSearchQuery) {
      // Fetch data again if search query is empty
      setReloadUsersData((prev) => !prev);
    } else {
      // Filter the data based on the new search query
      const filteredResults = searchFilter(usersData, newSearchQuery);
      setUsersData(filteredResults);
    }
  };

  const isSearchEmpty = searchQuery.trim() === "";

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <section>
      <div
        className={`m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl ${
          (showInsights || showCompetition) && "hidden"
        }`}
      >
        <div className="w-full flex mb-5">
          <div className="w-1/2 flex py-2">
            <div className="flex items-center justify-between mb-5">
              <span
                className="mr-3 flex items-center cursor-pointer"
                onClick={() => navigate("/reseller-users")}
              >
                <BiArrowBack color="#7472C2" className="mr-2" /> Back to list
              </span>
            </div>
          </div>
          <div className="w-1/2 flex justify-end py-2">
            <div className="w-full max-w-xs flex items-center p-2 pl-4 pr-4 border border-gray-300 bg-white rounded-full">
              <input
                type="text"
                placeholder="Enter name/email of user"
                className="flex-grow bg-transparent outline-none pr-2 text-xs"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <HiSearch className="text-gray-500 text-xs" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between h-full mb-5 relative">
          <div className="">
            <div className="pageTitle text-3xl font-semibold">
              {userPageTitle}
            </div>
            <div className="tag text-md mt-2 text-xs font-thin">
              {userPageTag}
            </div>
          </div>

          {userCat.toLowerCase() !== "all" && (
            <button
              className={`text-white rounded-md px-4 py-2 ml-4 flex items-center text-xs getIdeasBtn`}
              onClick={() => {
                setShowPanel(true);
              }}
              // disabled={isSearchEmpty}
              style={{
                background: "var(--special-background)",
              }}
            >
              <FaPlus className="mr-2" color="white" />
              {addUserCTA}
            </button>
          )}

          {showPanel && (
            <AddUserPanel
              setShowPanel={setShowPanel}
              setReloadUsersData={setReloadUsersData}
              userCat={userCat}
              resellerUser={"true"}
            />
          )}
          {showEditUserPanel && (
            <EditUserPanel
              setShowEditUserPanel={setShowEditUserPanel}
              setReloadUsersData={setReloadUsersData}
              props={selectedUserProps}
            />
          )}
          {showLoaderPanelDelete && loaderPanelFunc(`Deleting selected user`)}
          {showLoaderPanelBlock && loaderPanelFunc(`Blocking selected user`)}
          {showLoaderPanelUnblock &&
            loaderPanelFunc(`Unblocking selected user`)}
        </div>
        {isLoading ? (
          <Loader message={"Gathering Insights for your Keyword."} />
        ) : (
          <div className=""></div>
        )}
        <div>
          <div className="bg-white px-5 pb-5 rounded-md">
            <div className="flex justify-start items-center">
              <Header
                title={`${usersData.length} ${userCat} user(s)`}
                size="text-1xl"
              />
            </div>
            {fetchingUsersData && (
              <Loader message={`Loading / Updating users data. Hold on`} />
            )}
            <GridComponent
              dataSource={usersData}
              allowExcelExport
              allowPdfExport
              // allowPaging
              allowSorting
            >
              <ColumnsDirective>
                <ColumnDirective
                  field="fullName"
                  headerText="Name"
                  headerTemplate={nameTitleTemplate}
                  template={nameTemplate}
                />
                <ColumnDirective
                  field="email"
                  headerText="Email"
                  headerTemplate={emailTitleTemplate}
                  template={emailTemplate}
                />
                <ColumnDirective
                  field="accountType"
                  headerText="Type"
                  headerTemplate={accountTypeTitleTemplate}
                  template={accountTypeTemplate}
                />
                <ColumnDirective
                  field="date"
                  headerText="Date Joined"
                  headerTemplate={dateTitleTemplate}
                  template={dateTemplate}
                />
                <ColumnDirective
                  field="status"
                  headerText="Status"
                  headerTemplate={statusTitleTemplate}
                  template={statusTemplate}
                />
                <ColumnDirective
                  field="actions"
                  headerText="Actions"
                  headerTemplate={actionTitleTemplate}
                  template={actionTemplate}
                />
              </ColumnsDirective>
              <Inject
                services={[
                  Resize,
                  Sort,
                  ContextMenu,
                  Filter,
                  Page,
                  ExcelExport,
                  Edit,
                  PdfExport,
                ]}
              />
            </GridComponent>
            <div className="text-xs w-full justify-center flex mt-3 gap-2">
              <button
                className="px-2 text-md rounded-full"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  backgroundColor: usersData.length < 10 ? "grey" : "#D2E7D0",
                }}
              >
                <MdOutlineSkipPrevious />
              </button>
              <span>{`${currentPage} / ${totalPages}`}</span>
              <button
                className="px-2 text-md rounded-full"
                style={{
                  backgroundColor: usersData.length < 10 ? "grey" : "#D2E7D0",
                }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <MdOutlineSkipNext />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Users;
