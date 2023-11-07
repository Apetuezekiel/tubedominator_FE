/* eslint-disable */

import { React, useEffect, useState } from "react";
import { MdCancel, MdOutlineCancel } from "react-icons/md";
import { BiLinkExternal, BiLoaderCircle } from "react-icons/bi";
import { Button } from ".";
import { userProfileData } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import avatar from "../data/avatar.jpg";
import { useDisplayPreviewKeyword, useUserData } from "../state/state";
import { SignOutButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
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
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import Header from "./Header";
import { useKeywordVideosInfo } from "../state/state";
import axios from "axios";
import { Link } from "react-router-dom";
import { userFullDataDecrypted } from "../data/api/calls";
import Spinner from "./Spinner";
import showToast from "../utils/toastUtils";
import { FaYoutube } from "react-icons/fa";
import { formatNumberToKMBPlus } from "../data/helper-funtions/helper";

const PreviewKeyword = ({ keywordd, setDisplayPreviewKeyword }) => {
  showToast("warning", `keyword ${keywordd}`, 2000);
  const { currentColor } = useStateContext();
  const userData = useUserData((state) => state.userData);
  const setUserData = useUserData((state) => state.setUserData);
  const keywordVideosInfo = useKeywordVideosInfo(
    (state) => state.keywordVideosInfo,
  );
  const setKeywordVideosInfo = useKeywordVideosInfo(
    (state) => state.setKeywordVideosInfo,
  );
  const decryptedFullData = userFullDataDecrypted();
  const [isSearchLoaded, setIsResultLoaded] = useState(true);
  const toolbarOptions = [
    "Add",
    "Edit",
    "Delete",
    "Update",
    "Cancel",
    "Search",
  ];
  const filterOptions = { type: "CheckBox" };
  const editSettings = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: "Normal",
  };
  // const displayPreviewKeyword = useDisplayPreviewKeyword(
  //   (state) => state.displayPreviewKeyword,
  // );
  // const setDisplayPreviewKeyword = useDisplayPreviewKeyword(
  //   (state) => state.setDisplayPreviewKeyword,
  // );
  const settings = { persistSelection: true };

  useEffect(() => {
    let isMounted = true;
    // Define the API URL you want to fetch data from
    console.log("keyword", keywordd);
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/fetchSerpYoutubeVideos`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
          Authorization: `Bearer ${decryptedFullData.token}`,
        },
        params: {
          keyword: keywordd ?? "Football",
        },
      })
      .then((response) => {
        if (isMounted) {
          const keywordVideosInfo = response.data.map((item, index) => ({
            ...item,
            index: index + 1,
          }));
          console.log("keywordVideosInfo", keywordVideosInfo);
          setKeywordVideosInfo(keywordVideosInfo);
          setIsResultLoaded(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (props) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return (
      <div>
        {new Date(props.publishedAt).toLocaleDateString("en-US", options)}
      </div>
    );
  };

  // Custom header template for Channel Title colum

  const ThumbnailTitleTemplate = (props) => {
    return (
      <div className="flex">
        <img
          src={props.thumbnail.static}
          alt="Thumbnail"
          style={{ width: "100px", height: "80px" }}
          className="ml-5 rounded"
        />
        <Link to={props.link}>
          <div className="ml-4 cursor-pointer whitespace-normal underline flex items-top">
            {props.title}{" "}
            {/* <BiLinkExternal className="ml-1" color="#7352FF" size={10} /> */}
          </div>
        </Link>
      </div>
    );
  };

  // const ThumbnailTitleTemplate = (props) => {
  //   const playerHtml = { __html: props.player };

  //   return (
  //     <div className="flex">
  //       <div dangerouslySetInnerHTML={playerHtml} style={{ width: '100px', height: '100px' }}></div>
  //     </div>
  //   );
  // };

  const videoChannelTemplate = (props) => {
    return (
      <Link to={props.link}>
        <div className="ml-4 cursor-pointer underline flex items-top justify-start">
          {props.channel.name}{" "}
          {/* <BiLinkExternal className="ml-1" color="#7352FF" size={10} />{" "} */}
        </div>
      </Link>
    );
  };

  const formatViews = (props) => {
    const estimatedViews = parseInt(props.views);
    const formatedNumber = formatNumberToKMBPlus(estimatedViews);
    // const formattedViews = estimatedViews.toLocaleString() + "+";
    return (
      <span className="flex items-center justify-start">{formatedNumber}</span>
    );
  };

  const gridOrderOptimizationLevel = (props) => {
    return (
      <div className="h-2 w-full rounded-full flex flex-row items-center justify-between">
        <div className="h-full bg-gray-300 w-full rounded-full mr-2">
          <div className="h-full w-10 bg-purple-600 rounded-full"></div>
        </div>
        <span className="w-20 text-xs text-purple-600">20%</span>
      </div>
    );
  };

  const gridOrderOptimizationImpact = (props) => {
    return (
      <div className="h-5 w-full rounded-full flex flex-row items-center justify-between">
        <div className="h-full w-80 bg-gray-300 rounded-full mr-2">
          <div className="h-full w-10 bg-purple-600 rounded-full">
            <span className="w-20 text-xs ml-3 text-white">Low</span>
          </div>
        </div>
      </div>
    );
  };
  const editing = { allowDeleting: true, allowEditing: true };

  return (
    // <div className="flex justify-center items-center w-full" style={{backgroundColor: "black"}}>
    // <div className="nav-item absolute left-1/2 top-52 bg-white dark:bg-[#42464D] p-8 rounded-lg w-4/6 transform -translate-x-1/2">
    <div
      className={`nav-item fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-60 z-50 overflow-auto ${
        isSearchLoaded === false && "pt-96"
      }`}
    >
      <div
        className={`bg-white dark:bg-[#42464D] p-8 my-20 rounded-lg w-5/6 ${
          isSearchLoaded === false && "pt-40"
        } `}
      >
        <div className="flex justify-between items-center mb-5">
          <div className="font-semibold text-lg dark:text-gray-200">
            <div className="flex items-center gap-3">
              Search Result from Youtube <FaYoutube color="red" />{" "}
            </div>
            <div className="text-sm capitalize underline">{keywordd}</div>
          </div>
          {/* <Button
            icon={<MdOutlineCancel />}
            color="rgb(153, 171, 180)"
            bgHoverColor="light-gray"
            size="2xl"
            borderRadius="50%"
            
          /> */}
          <MdCancel
            onClick={() => setDisplayPreviewKeyword(false)}
            size={20}
            color="red"
            className="cursor-pointer"
          />
        </div>
        {isSearchLoaded ? (
          <div className="flex flex-col justify-center items-center w-full mt-20">
            <BiLoaderCircle
              className="animate-spin text-center"
              color="#7352FF"
              size={30}
            />
            <div>Loading up Keyword Insights for you</div>
          </div>
        ) : (
          <GridComponent
            dataSource={keywordVideosInfo}
            // id="gridcomp"
            allowExcelExport
            allowPdfExport
            allowPaging
            allowSorting
            // contextMenuItems={contextMenuItems}
            // editSettings={editing}
            // ref={gridInstance}
            // toolbar={toolbarOptions}
            // editSettings={editSettings}
            // selectionSettings={settings}
            // filterSettings={filterOptions}
          >
            <ColumnsDirective>
              <ColumnDirective field="index" headerText="Rank" width="100" />
              <ColumnDirective
                field="title"
                headerText="Videos"
                template={ThumbnailTitleTemplate}
                width="600"
              />
              <ColumnDirective
                field="channelTitle"
                headerText="Channels"
                template={videoChannelTemplate}
                // width="200"
              />
              <ColumnDirective
                field="views"
                headerText="Views"
                // width="150"
                template={formatViews}
              />
              <ColumnDirective
                field="published_date"
                headerText="Date published"
                // width="150"
                // template={formatDate}
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
                Toolbar,
              ]}
            />
          </GridComponent>
        )}
      </div>
    </div>
  );
};

export default PreviewKeyword;
