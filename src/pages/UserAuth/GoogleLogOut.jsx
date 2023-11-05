import { GoogleLogout } from "react-google-login";
import { useNavigate } from "react-router-dom";
import { useUserLoggedin } from "../../state/state";

const clientId =
  "372673946018-lu1u3llu6tqi6hmv8m2226ri9qev8bb8.apps.googleusercontent.com";

const GoogleLogOut = () => {
  const setUserLoggedIn = useUserLoggedin((state) => state.setUserLoggedIn);

  const navigate = useNavigate();
  const onLogoutSuccess = (res) => {
    console.log("Logout Success, res:", res);
    localStorage.clear();
    setUserLoggedIn(false)
    navigate("/");
  };
  return (
    <div id="signoutButton">
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onLogoutSuccess}
      ></GoogleLogout>
    </div>
  );
};

export default GoogleLogOut;
