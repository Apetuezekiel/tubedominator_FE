/* eslint-disable */

import React from "react";
import { useState } from "react";

import { BsCurrencyDollar } from "react-icons/bs";
import { GoPrimitiveDot } from "react-icons/go";
import { IoIosMore } from "react-icons/io";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";

import { Stacked, Pie, Button, LineChart, SparkLine } from "../components";
import {
  earningData,
  medicalproBranding,
  recentTransactions,
  weeklyStats,
  dropdownData,
  SparklineAreaData,
  ecomPieChartData,
} from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import product9 from "../data/product9.jpg";

const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent
      id="time"
      fields={{ text: "Time", value: "Id" }}
      style={{ border: "none", color: currentMode === "Dark" && "white" }}
      value="1"
      dataSource={dropdownData}
      popupHeight="220px"
      popupWidth="120px"
    />
  </div>
);

const Reporting = () => {
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [activeAccordion2, setActiveAccordion2] = useState(0);
  const { currentColor, currentMode } = useStateContext();

  const toggleAccordion = (index) => {
    setActiveAccordion(index === activeAccordion ? null : index);
  };
  const toggleAccordion2 = (index) => {
    setActiveAccordion2(index === activeAccordion2 ? null : index);
  };

  return (
    <div className="p-5">
      <div className="w-full">
        <div className="text-sm mb-3">How is your Organic view growth?</div>
        <div className="grid grid-cols-3 w-full">
          <div className={``} onClick={() => toggleAccordion(0)}>
            <div
              className={`flex flex-col items-center justify-center border border-gray-300 ${
                activeAccordion === 0 ? "bg-white" : "bg-gray-200"
              }`}
            >
              <div className="mt-2 text-purple-600 text-xs">
                views on youtube search
              </div>
              <div className="mt-2 text-xs">
                0 <small className="text-green-400">0%</small>
              </div>
              <div className="mt-2 text-purple-600 text-xs">last month</div>
            </div>
          </div>
          <div className={``} onClick={() => toggleAccordion(1)}>
            <div
              className={`flex flex-col items-center justify-center border border-gray-300 ${
                activeAccordion === 1 ? "bg-white" : "bg-gray-200"
              }`}
            >
              <div className="mt-2 text-purple-600 text-xs">
                views on youtube search
              </div>
              <div className="mt-2 text-xs">
                0 <small className="text-green-400">0%</small>
              </div>
              <div className="mt-2 text-purple-600 text-xs">last month</div>
            </div>
          </div>
          <div className={``} onClick={() => toggleAccordion(2)}>
            <div
              className={`flex flex-col items-center justify-center border border-gray-300 ${
                activeAccordion === 2 ? "bg-white" : "bg-gray-200"
              }`}
            >
              <div className="mt-2 text-purple-600 text-xs">
                views on youtube search
              </div>
              <div className="mt-2 text-xs">
                0 <small className="text-green-400">0%</small>
              </div>
              <div className="mt-2 text-purple-600 text-xs">last month</div>
            </div>
          </div>

          {activeAccordion === 0 && (
            <div className="col-span-3 p-4 mt-4 bg-white">
              <div className="flex gap-10 m-4 flex-wrap justify-center">
                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
                  <div className="flex justify-between items-center gap-2 mb-10">
                    <p className="text-xs font-semibold">Views Overview</p>
                    <DropDown currentMode={currentMode} />
                  </div>
                  <div className="w-full overflow-auto">
                    <LineChart />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeAccordion === 1 && (
            <div className="col-span-3  p-4 mt-4 bg-white">
              <div className="flex gap-10 m-4 flex-wrap justify-center">
                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
                  <div className="flex justify-between items-center gap-2 mb-10">
                    <p className="text-xs font-semibold">Views Overview</p>
                    <DropDown currentMode={currentMode} />
                  </div>
                  <div className="md:w-full overflow-auto">
                    <LineChart />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeAccordion === 2 && (
            <div className="col-span-3  p-4 mt-4 bg-white">
              <div className="flex gap-10 m-4 flex-wrap justify-center">
                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
                  <div className="flex justify-between items-center gap-2 mb-10">
                    <p className="text-xs font-semibold">Views Overview</p>
                    <DropDown currentMode={currentMode} />
                  </div>
                  <div className="md:w-full overflow-auto">
                    <LineChart />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full">
        <div className="text-sm mb-3">
          How is your watch time growing organically?
        </div>
        <div className="grid grid-cols-3 w-full">
          <div className={``} onClick={() => toggleAccordion2(0)}>
            <div
              className={`flex flex-col items-center justify-center border border-gray-300 ${
                activeAccordion2 === 0 ? "bg-white" : "bg-gray-200"
              }`}
            >
              <div className="mt-2 text-purple-600 text-xs">
                views on youtube search
              </div>
              <div className="mt-2 text-xs">
                0 <small className="text-green-400">0%</small>
              </div>
              <div className="mt-2 text-purple-600 text-xs">last month</div>
            </div>
          </div>
          <div className={``} onClick={() => toggleAccordion2(1)}>
            <div
              className={`flex flex-col items-center justify-center border border-gray-300 ${
                activeAccordion2 === 1 ? "bg-white" : "bg-gray-200"
              }`}
            >
              <div className="mt-2 text-purple-600 text-xs">
                views on youtube search
              </div>
              <div className="mt-2 text-xs">
                0 <small className="text-green-400">0%</small>
              </div>
              <div className="mt-2 text-purple-600 text-xs">last month</div>
            </div>
          </div>
          <div className={``} onClick={() => toggleAccordion2(2)}>
            <div
              className={`flex flex-col items-center justify-center border border-gray-300 ${
                activeAccordion2 === 2 ? "bg-white" : "bg-gray-200"
              }`}
            >
              <div className="mt-2 text-purple-600 text-xs">
                views on youtube search
              </div>
              <div className="mt-2 text-xs">
                0 <small className="text-green-400">0%</small>
              </div>
              <div className="mt-2 text-purple-600 text-xs">last month</div>
            </div>
          </div>

          {activeAccordion2 === 0 && (
            <div className="col-span-3 p-4 mt-4 bg-white">
              <div className="flex gap-10 m-4 flex-wrap justify-center">
                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
                  <div className="flex justify-between items-center gap-2 mb-10">
                    <p className="text-xs font-semibold">Views Overview</p>
                    <DropDown currentMode={currentMode} />
                  </div>
                  <div className="w-full overflow-auto">
                    <LineChart />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeAccordion2 === 1 && (
            <div className="col-span-3  p-4 mt-4 bg-white">
              <div className="flex gap-10 m-4 flex-wrap justify-center">
                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
                  <div className="flex justify-between items-center gap-2 mb-10">
                    <p className="text-xs font-semibold">Views Overview</p>
                    <DropDown currentMode={currentMode} />
                  </div>
                  <div className="md:w-full overflow-auto">
                    <LineChart />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeAccordion2 === 2 && (
            <div className="col-span-3  p-4 mt-4 bg-white">
              <div className="flex gap-10 m-4 flex-wrap justify-center">
                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
                  <div className="flex justify-between items-center gap-2 mb-10">
                    <p className="text-xs font-semibold">Views Overview</p>
                    <DropDown currentMode={currentMode} />
                  </div>
                  <div className="md:w-full overflow-auto">
                    <LineChart />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reporting;
