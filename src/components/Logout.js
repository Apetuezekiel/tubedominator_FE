/* eslint-disable */
import { GoogleLogout } from "react-google-login";

const clientId =
  "372673946018-lu1u3llu6tqi6hmv8m2226ri9qev8bb8.apps.googleusercontent.com";

const Logout = () => {
  const onSuccess = (res) => {
    console.log("Logout Success, res:", res);
  };
  return (
    <div id="signoutButton">
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      ></GoogleLogout>
    </div>
  );
};

export default Logout;
