import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { GoogleLogin } from "react-google-login";
import GoogleApiInitializer from "../../utils/GoogleApiInitializer";
import showToast from "../../utils/toastUtils";
import { gapi } from "gapi-script";

const GoogleAccessToken = forwardRef(({ setIsGapiInitialized }, ref) => {
  const internalRef = useRef(null);
  const [authInfo, setAuthInfo] = useState({
    access_token: null,
    expires_in: null,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useImperativeHandle(ref, () => ({
    click: () => {
      internalRef.current.click();
    },
    getAuthInfo: () => authInfo,
    isGapiInitialized: () => isAuthenticated,
  }));

  useEffect(() => {
    const fetchDataAndInitGAPI = async () => {
      try {
        // Initialize gapi.client inside the try
        await new Promise((resolve, reject) => {
          gapi.load("client:auth2", () => {
            gapi.client
              .init({
                apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
                clientId: process.env.REACT_APP_CLIENT_ID,
                scope:
                  "https://www.googleapis.com/auth/youtube.readonly " +
                  "https://www.googleapis.com/auth/youtube.force-ssl " +
                  "https://www.googleapis.com/auth/youtube " +
                  "https://www.googleapis.com/auth/youtube.upload",
              })
              .then(() => {
                resolve();
              })
              .catch(reject);
          });
        });
        setIsAuthenticated(true);
        setIsGapiInitialized(true);
      } catch (error) {
        console.error("Error initializing gapi.client:", error);
      }
    };

    fetchDataAndInitGAPI();
  }, [setIsGapiInitialized]);

  const onLoginFailure = (res) => {
    console.log("Login Failed, res:", res);
    showToast("error", "Couldn't authenticate you", 2000);
  };

  const onLoginSuccess = (res) => {
    console.log("Login Success, res:", res);
    const { access_token, expires_in } = res.tokenObj;

    setAuthInfo({
      access_token,
      expires_in,
    });

    showToast("success", "Access renewed", 2000);
    // Do any other logic with the authenticated user as needed
  };

  const handleLoginClick = () => {
    internalRef.current.click();
  };

  return (
    <div>
      <GoogleApiInitializer
        apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
        clientId={process.env.REACT_APP_CLIENT_ID}
      />
      <button onClick={handleLoginClick}>
        <GoogleLogin
          buttonText="Login with Google"
          onSuccess={onLoginSuccess}
          onFailure={onLoginFailure}
          cookiePolicy="single_host_origin"
          isSignedIn={true}
          className="google-login-button rounded-full"
        />
      </button>
    </div>
  );
});

export default GoogleAccessToken;
