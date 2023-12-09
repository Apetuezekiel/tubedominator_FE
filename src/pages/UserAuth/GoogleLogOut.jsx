import { GoogleLogout } from "react-google-login";
import { useNavigate } from "react-router-dom";
import {
  useUserAccessLevel,
  useUserData,
  useUserLoggedin,
} from "../../state/state";
import { useStateContext } from "../../contexts/ContextProvider";

const GoogleLogOut = () => {
  const { setIsClicked, initialState } = useStateContext();
  const setUserLoggedIn = useUserLoggedin((state) => state.setUserLoggedIn);
  const setAccessLevel = useUserAccessLevel((state) => state.setAccessLevel);
  const setUserData = useUserData((state) => state.setUserData);

  const navigate = useNavigate();
  const onLogoutSuccess = (res) => {
    console.log("Logout Success, res:", res);
    setIsClicked(initialState);
    localStorage.clear();
    setUserLoggedIn("");
    setAccessLevel("");
    setUserData(null);
    navigate("/");
  };
  return (
    <div id="signoutButton">
      <GoogleLogout
        clientId={process.env.REACT_APP_CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={onLogoutSuccess}
      ></GoogleLogout>
    </div>
  );
};

export default GoogleLogOut;
