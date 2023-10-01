/* eslint-disable */
import React, { useEffect } from "react";

function GoogleApiInitializer({ apiKey, clientId, initializeOnLoad }) {
  useEffect(() => {
    if (initializeOnLoad) {
      gapi.load("client:auth2", () => {
        gapi.client.init({
          apiKey,
          client_id: clientId,
          scope:
            "https://www.googleapis.com/auth/youtube.readonly " +
            "https://www.googleapis.com/auth/youtube.force-ssl " +
            "https://www.googleapis.com/auth/youtube " +
            "https://www.googleapis.com/auth/youtube.upload " +
            "https://www.googleapis.com/auth/cse",
        });
      });
    }
  }, [apiKey, clientId, initializeOnLoad]);

  return null;
}

export default GoogleApiInitializer;
