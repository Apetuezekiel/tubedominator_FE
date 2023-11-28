// import {
//     HiOutlineChevronDown,
//     HiOutlineTrendingDown,
//     HiOutlineTrendingUp,
//     HiSearch,
//   } from "react-icons/hi";
//   import { HiOutlineRefresh } from "react-icons/hi";
//   import { AiOutlineStar, AiFillStar } from "react-icons/ai";
//   import {
//     FaYoutube,
//     FaGoogle,
//     FaPlus,
//     FaVideo,
//     FaFolderPlus,
//   } from "react-icons/fa";
//   import { BiSearch, BiWorld, BiStar, BiLoaderCircle } from "react-icons/bi";
//   import { FiEye, FiSearch, FiTrendingUp } from "react-icons/fi";
//   import {
//     BsArrowDownShort,
//     BsArrowUpShort,
//     BsDot,
//     BsLightningChargeFill,
//   } from "react-icons/bs";
//   import { RiKey2Fill } from "react-icons/ri";

// export const youtubeGooglePlusIcons = [FiSearch];
// export const videoIcon = [FaYoutube];

// export function IconsWithTitle({ title, icons, color }) {
//   return (
//     <div className="flex items-center">
//       {title}
//       {icons.map((Icon, index) => (
//         <span key={index} style={{ marginLeft: "5px", display: "flex" }}>
//           <Icon color={`${color && color}`} />
//         </span>
//       ))}
//     </div>
//   );
// }

// export const VolumeTitleTemplate = (props) => {
//   return (
//     <div className="flex items-center justify-center">
//       <IconsWithTitle
//         title={props.headerText}
//         icons={youtubeGooglePlusIcons}
//         color={"#9967FF"}
//       />
//     </div>
//   );
// };

// export const TrendsTitleTemplate = (props) => {
//   const trendIcon = <FiTrendingUp size={15} color="green" />;
//   return (
//     <div className="flex items-center justify-center">
//       {props.headerText}
//       <div className="ml-2">{trendIcon}</div>
//     </div>
//   );
// };

// export const keywordDiffTitleTemplate = (props) => {
//   const diffIcon = <RiKey2Fill size={15} color="grey" />;
//   return (
//     <div className="flex items-center justify-center">
//       {props.headerText}
//       <div className="ml-2">{diffIcon}</div>
//     </div>
//   );
// };

// export const PotentialViewsTitleTemplate = (props) => {
//   const icon = <FiEye size={15} color="#E87A00" />;
//   return (
//     <div className="flex items-center justify-center">
//       {props.headerText}
//       <div className="ml-2">{icon}</div>
//     </div>
//   );
// };

// export const VideoIconTitleTemplate = (props) => {
//   return (
//     <div className="tooltip-container flex items-center justify-center break-words">
//       <IconsWithTitle
//         title={props.headerText}
//         icons={videoIcon}
//         color={"red"}
//       />
//       <div className="tooltip-text text-black">
//         Information about potential views
//       </div>
//     </div>
//   );
// };

// export const VideoIconTemplate = (props, setShowInsights, setIdeasDataSet) => {
//   return (
//     <div
//       className="flex flex-col break-words"
//       onClick={() => {
//         setShowInsights(true);
//         setIdeasDataSet(props);
//       }}
//     >
//       <span className="text-md capitalize">{props.keyword}</span>
//       <span
//         className="text-xs text cursor-pointer"
//         style={{ color: "#7352FF" }}
//       >
//         More Insights
//       </span>
//     </div>
//   );
// };
