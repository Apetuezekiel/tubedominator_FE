import { IoFolderOpenOutline } from "react-icons/io5";
import { MdMoreHoriz } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Folder = ({ userType, route }) => {
  const navigate = useNavigate();

  const handleMoreClick = (item) => {
    // Navigate to /saved-ideas and pass the value of 'item'
    navigate(`/${route}`, { state: { customData: item } });
  };
  return (
    <div
      className="m-2 flex flex-col items-center justify-center cursor-pointer"
      onClick={() => handleMoreClick(`${userType}`)}
    >
      <div
        className="rounded-md p-2 w-40"
        style={{ backgroundColor: "#EAEAF5" }}
      >
        <div className="flex items-center justify-end">
          <span className="py-1 px-1 rounded-full bg-white flex items-center justify-center cursor-pointer">
            <MdMoreHoriz color="black" className="m-auto" />
          </span>
        </div>
        <div className="w-full text-center">
          <div className="flex folder-container items-center justify-center">
            <IoFolderOpenOutline
              color="#C8C8DD"
              size={48}
              className="folder-container mt-5 mb-5"
            />
          </div>
        </div>
        <div className="py-1 text-xs font-bold">{userType}</div>
      </div>
    </div>
  );
};

export default Folder;
