import React from "react";
import { GoogleOAuthProvider } from "react-oauth-google";

const OAuthConsent = () => {
  const onSuccess = (response) => {
    // Handle successful authentication here, e.g., save tokens, redirect, etc.
    console.log("Authentication successful!", response);
  };

  const onFailure = (error) => {
    // Handle authentication failure here, e.g., show error message, redirect, etc.
    console.error("Authentication failed!", error);
  };

  return (
    <div>
      <h1>OAuth Consent Screen</h1>
      <GoogleOAuthProvider
        clientId="474658692868-0vdqjoion0anro7mejqgt7lcs7qieecg.apps.googleusercontent.com"
        responseType="code"
        onSuccess={onSuccess}
        onFailure={onFailure}
        scope="email profile"
        redirectUri="https://developers.google.com/oauthplayground"
      >
        <button>Sign in with Google</button>
      </GoogleOAuthProvider>
    </div>
  );
};

export default OAuthConsent;
