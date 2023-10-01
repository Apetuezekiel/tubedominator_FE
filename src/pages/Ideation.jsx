/* eslint-disable */

import React from "react";
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

import {
  IdeationPageData,
  contextMenuItems,
  IdeationPageGrid,
  KeywordsProvidedData,
  KeywordsProvidedGrid,
} from "../data/dummy";
import { Header } from "../components";
import { BiSearch, BiWorld } from "react-icons/bi";

const Optimization = () => {
  const editing = { allowDeleting: true, allowEditing: true };
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex items-center justify-center h-full mb-5">
        <div className="flex items-center flex-col ">
          <div className="w-full max-w-xs flex items-center p-2 pl-4 pr-4 border border-gray-300 bg-white rounded-full">
            <input
              type="text"
              placeholder="Enter a topic, brand, or product"
              className="flex-grow bg-transparent outline-none pr-2 text-xs"
            />
            <BiSearch className="text-gray-500 text-xs" />
          </div>
          {/* <small>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, voluptates.</small> */}
        </div>

        <div className="relative ml-4">
          <select className="rounded-full py-2 pl-4 pr-8 border border-gray-300 bg-white text-xs">
            <option value="en">Global (English)</option>
            <option value="es">Español </option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        <button className="bg-gray-300 text-gray-500 rounded-full px-4 py-2 ml-4 cursor-not-allowed text-xs">
          GET IDEAS
        </button>
      </div>

      <Header title="Keywords you provided" size="text-1xl" />
      <GridComponent
        id="gridcomp"
        dataSource={KeywordsProvidedData}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        contextMenuItems={contextMenuItems}
        editSettings={editing}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {KeywordsProvidedGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
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

      <Header title="Optimization" size="text-1xl" />
      <GridComponent
        id="gridcomp"
        dataSource={IdeationPageData}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        contextMenuItems={contextMenuItems}
        editSettings={editing}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {IdeationPageGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
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
export default Optimization;
