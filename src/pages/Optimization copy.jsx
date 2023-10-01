import React, { useEffect, useState } from "react";
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
import { HiOutlineChevronDown, HiSearch } from "react-icons/hi";
// import { OptimizationPageGrid, contextMenuItems, OptimizationPageData } from '../data/dummy';
import { Header } from "../components";
import { FaYoutube } from "react-icons/fa";

const Ideation = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Define the API URL you want to fetch data from
    const apiUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UCIaJua9IU_Db15LKAaq_ZYw&maxResults=10&order=date&key=${API_}`;

    // Set headers and authorization
    const headers = {
      Authorization: env(ACCESS_TOKEN), // Replace with your access token if required
    };

    // Make the GET request using Axios
    axios
      .get(apiUrl, { headers })
      .then((response) => {
        // Extract the required data from the response
        const totalResults = response.data.pageInfo.totalResults;
        const items = response.data.items.map((item) => ({
          publishedAt: item.snippet.publishedAt,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnailUrl: item.snippet.thumbnails.high.url,
          channelTitle: item.snippet.channelTitle,
        }));

        // Store the extracted data in the component's state
        setData({ totalResults, items });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const editing = { allowDeleting: true, allowEditing: true };

  const ThumbnailTemplate = (props) => {
    return (
      <div>
        <img
          src={props.thumbnailUrl}
          alt="Thumbnail"
          style={{ width: "100px", height: "80px" }}
        />
      </div>
    );
  };
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="w-full flex">
        <div className="w-3/4 flex py-2">
          <div className="flex justify-start items-center">
            <div className="bg-white rounded-full border border-gray-300 px-4 py-2 flex items-center mr-4">
              <span className="mr-2 text-xs">Visibility (All)</span>
              <HiOutlineChevronDown />
            </div>
            <div className="bg-white rounded-full border border-gray-300 px-4 py-2 flex items-center mr-4">
              <span className="mr-2 text-xs">Playlists (All)</span>
              <HiOutlineChevronDown />
            </div>
            <div className="bg-white rounded-full border border-gray-300 px-4 py-2 flex items-center mr-4">
              <span className="mr- text-xs">Time (All)</span>
              <HiOutlineChevronDown />
            </div>
            <div className="bg-white rounded-full border border-gray-300 px-4 py-2 flex items-center mr-4">
              <span className="mr-2 text-xs">Updated on YT</span>
              <HiOutlineChevronDown />
            </div>
            <div className="bg-white rounded-full border border-gray-300 px-4 py-2 flex items-center mr-4">
              <span className="mr-2 text-xs">Drafts</span>
              <HiOutlineChevronDown />
            </div>
          </div>
        </div>
        <div className="w-1/4 flex justify-end py-2">
          <div className="flex items-center w-2/4 border border-gray-300 bg-white rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Search"
              className="flex-grow bg-transparent pr-2 text-xs"
            />
            <HiSearch className="text-gray-500 text-xs" />
          </div>
        </div>
      </div>

      <Header title={`${OptimizationPageData.length} videos`} />
      <GridComponent dataSource={data && data.items}>
        <ColumnsDirective>
          <ColumnDirective field="title" headerText="Title" width="200" />
          <ColumnDirective
            field="description"
            headerText="Description"
            width="300"
          />
          <ColumnDirective
            field="publishedAt"
            headerText="Published At"
            width="150"
          />
          <ColumnDirective
            field="channelTitle"
            headerText={
              <span>
                <FaYoutube /> Channel Title
              </span>
            }
            width="200"
          />
          <ColumnDirective
            field="thumbnailUrl"
            headerText="Thumbnail"
            width="150"
            template={ThumbnailTemplate}
          />
        </ColumnsDirective>
      </GridComponent>
    </div>
  );
};
export default Ideation;
