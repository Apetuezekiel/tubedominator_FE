/* eslint-disable */
import React, { useState } from "react";
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
import { Header } from "../components";
import { BiSearch, BiWorld, BiStar } from "react-icons/bi";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

const contextMenuItems = [
  "AutoFit",
  "AutoFitAll",
  "SortAscending",
  "SortDescending",
  "Copy",
  "Edit",
  "Delete",
  "Save",
  "Cancel",
  "PdfExport",
  "ExcelExport",
];

const Sortting = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [keywordData, setKeywordData] = useState([]);
  const [favorites, setFavorites] = useState({});

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const gridOrderStars = (props) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const makeFavorite = (rowData) => {
      setIsFavorite(!isFavorite);
      props.onFavoriteToggle(rowData.keyword);
    };

    return (
      <div
        className="flex items-center justify-center"
        onClick={() => makeFavorite(props.rowData)}
      >
        {isFavorite ? <AiFillStar /> : <AiOutlineStar />}
      </div>
    );
  };

  const handleRowClick = (rowData) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [rowData.keyword]: !prevFavorites[rowData.keyword],
    }));
    console.log(favorites);
  };

  const getCostPerClickDisplay = (costPerClick) => {
    if (costPerClick >= 70 && costPerClick <= 100) {
      return "hard";
    } else if (costPerClick >= 40 && costPerClick <= 69) {
      return "medium";
    } else {
      return "easy";
    }
  };

  const handleGetIdeasClick = () => {
    if (!searchQuery.trim()) {
      return;
    }

    // Make the API call here
    fetch(
      `http://localhost:8080/api/fetchKeywordStat??keywords=${searchQuery}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ keyword: searchQuery }),
      },
    )
      .then((response) => response.json())
      .then((data) => {
        // Update the keywordData state with the API response
        setKeywordData(data.response.results);
        console.log(keywordData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const isSearchEmpty = searchQuery.trim() === "";

  const editing = { allowDeleting: true, allowEditing: true };
  // Filter the keywordData array based on the searchQuery
  const filteredData = keywordData.filter(
    (item) => item.keyword === searchQuery,
  );

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex items-center justify-center h-full mb-5">
        <div className="flex items-center flex-col ">
          <div className="w-full max-w-xs flex items-center p-2 pl-4 pr-4 border border-gray-300 bg-white rounded-full">
            <input
              type="text"
              placeholder="Enter a topic, brand, or product"
              className="flex-grow bg-transparent outline-none pr-2 text-xs"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <BiSearch className="text-gray-500 text-xs" />
          </div>
        </div>

        <div className="relative ml-4">
          <select className="rounded-full py-2 pl-4 pr-8 border border-gray-300 bg-white text-xs">
            <option value="en">Global (English)</option>
            <option value="es">Español </option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        <button
          className={`text-white rounded-full px-4 py-2 ml-4 text-xs ${
            isSearchEmpty
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-purple-500 cursor-pointer"
          }`}
          onClick={handleGetIdeasClick}
          disabled={isSearchEmpty}
        >
          GET IDEAS
        </button>
      </div>

      <Header title="Keywords you provided" size="text-1xl" />
      <GridComponent
        id="gridcomp"
        dataSource={filteredData}
        allowExcelExport
        allowPdfExport
        contextMenuItems={contextMenuItems}
        editSettings={editing}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="isFavorite"
            headerText=""
            width="40"
            // template={(rowData) => <gridOrderStars rowData={rowData} onFavoriteToggle={handleRowClick} />}
          />
          <ColumnDirective
            field="isFavorite"
            headerText=""
            width="40"
            template={(rowData) => (
              <div onClick={() => handleRowClick(rowData)}>
                {rowData.isFavorite ? (
                  <BiStar className="text-yellow-500 cursor-pointer" />
                ) : (
                  <AiFillStar className="cursor-pointer" />
                )}
              </div>
            )}
          />

          <ColumnDirective field="keyword" headerText="Video ideas" />
          <ColumnDirective
            field="monthlysearch"
            headerText="Seach Volume on youtube"
          />
          <ColumnDirective
            field="competition"
            headerText="Keyword Difficulty"
          />
          <ColumnDirective
            field="competition"
            headerText="Keyword Difficulty"
          />
          <ColumnDirective
            field="cost_per_click"
            headerText="Cost per click"
          />
          <ColumnDirective
            field="avg_volume"
            headerText="Potential views on youtube"
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

      <Header title="Sort" size="text-1xl" />
      <GridComponent
        id="gridcomp"
        dataSource={keywordData}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        contextMenuItems={contextMenuItems}
        editSettings={editing}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="isFavorite"1
            headerText=""
            width="40"
            // template={(rowData) => (
            //   <div onClick={() => handleRowClick(rowData)}>
            //     {favorites[rowData.keyword] ? (
            //       <BiStar className="text-yellow-500 cursor-pointer" />
            //     ) : (
            //       <AiFillStar className="cursor-pointer" />
            //     )}
            //   </div>
            // )}
            // template={(rowData) => <gridOrderStars rowData={rowData} onFavoriteToggle={handleRowClick} />}
            template={gridOrderStars}
          />
          <ColumnDirective field="keyword" headerText="Video ideas" />
          <ColumnDirective
            field="avg_volume"
            headerText="Seach Volume on Youtube"
            template={(rowData) => <span>{rowData.avg_volume}</span>}
          />
          <ColumnDirective
            field="competition"
            headerText="Keyword Difficulty"
            template={(rowData) => <span>{rowData.competition}%</span>}
          />
          <ColumnDirective
            field="cost_per_click"
            headerText="Cost per click"
            template={(rowData) => <span>${rowData.cost_per_click}</span>}
          />
          <ColumnDirective
            field="avg_volume"
            headerText="Potential views on Youtube"
            template={(rowData) => <span>{rowData.avg_volume}</span>}
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
    </div>
  );
};

export default Sortting;
