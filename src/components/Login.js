/* eslint-disable */
import { GoogleLogin } from "react-google-login";

const clientId =
  "372673946018-lu1u3llu6tqi6hmv8m2226ri9qev8bb8.apps.googleusercontent.com";

const Login = () => {
  const onFailure = (res) => {
    console.log("Login Failed, res:", res);
  };
  const onSuccess = (res) => {
    console.log("Login Success, res:", res.profileObj);
  };
  return (
    <div id="signinButton">
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy="single_host_origin"
        isSignedIn={true}
      ></GoogleLogin>
    </div>
  );
};

export default Login;
