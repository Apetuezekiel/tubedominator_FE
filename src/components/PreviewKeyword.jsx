/* eslint-disable */

import { React, useEffect, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";

import { Button } from ".";
import { userProfileData } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import avatar from "../data/avatar.jpg";
import { useUserData } from "../state/state";
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

const PreviewKeyword = ({ keyword }) => {
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
  const settings = { persistSelection: true };

  useEffect(() => {
    let isMounted = true;
    // Define the API URL you want to fetch data from
    console.log("keyword", keyword);
    axios
      .get(`http://localhost:8080/api/getKeywordVideos`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "27403342c95d1d83a40c0a8523803ec1518e2e5!@@+=",
          Authorization: `Bearer ${decryptedFullData.token}`,
        },
        params: {
          query: keyword,
        },
      })
      .then((response) => {
        if (isMounted) {
          const keywordVideosInfo = response.data.map((item, index) => ({
            ...item,
            index: index + 1,
          }));
          setKeywordVideosInfo(keywordVideosInfo);
          setIsResultLoaded(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    return () => {
      // Cleanup function to be called when the component is unmounted
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
          src={props.thumbnails.url}
          alt="Thumbnail"
          style={{ width: "100px", height: "80px" }}
          className="ml-5 rounded"
        />
        {/* <Link to={}> */}
        <div className="ml-4">{props.title}</div>
        {/* </Link> */}
      </div>
    );
  };

  const gridOrderOptimizationLevel = (props) => {
    return (
      <div className="h-2 w-full rounded-full flex flex-row items-center justify-between">
        <div className="h-full w-80 bg-gray-300 w-full ro unded-full mr-2">
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
    <div className="nav-item fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-60 z-50">
      <div className="bg-white dark:bg-[#42464D] p-8 my-20 rounded-lg w-4/6">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg dark:text-gray-200">
            Search Result from Youtube
          </p>
          <Button
            icon={<MdOutlineCancel />}
            color="rgb(153, 171, 180)"
            bgHoverColor="light-gray"
            size="2xl"
            borderRadius="50%"
          />
        </div>
        {isSearchLoaded ? (
          <div className="loading-container my-10">
            <Spinner />
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
            toolbar={toolbarOptions}
            editSettings={editSettings}
            selectionSettings={settings}
            filterSettings={filterOptions}
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
                // template={gridOrderOptimizationLevel}
                // width="200"
              />
              <ColumnDirective
                field="viewCount"
                headerText="Views"
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
