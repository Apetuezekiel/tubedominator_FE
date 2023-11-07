import { BiLoaderCircle } from "react-icons/bi";

const Loader = ({message, size, iconColor, messageColor, marginTop}) => {

    return (
        <div className={`flex flex-col items-center justify-center w-full mt-${marginTop || 20} animate-pulse`}>
        <BiLoaderCircle
          className="animate-spin text-center"
          color={`${iconColor || "#7352FF"}`}
          size={size || 20}
        />
        <div className="text-xs" style={{ color: messageColor || "black" }}>
            {message || "Hold tight while we load up Insights."}
        </div>
      </div>
    )
}

export default Loader;