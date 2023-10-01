/* eslint-disable */

import React, { useEffect, useState } from "react";

const Keywords = () => {
  const [keywordInsights, setKeywordInsights] = useState([]);
  const keywordText = "Web Development";
  const locationId = "2840"; // The location where you want to get keyword insights

  useEffect(() => {
    // Step 3: Authenticate with Google Ads API
    const accessToken =
      "ya29.a0AbVbY6NaYOpq8VKX7GjhRrVCKzl712k7yjywYMvGSyYpZOxG96Wveg7cZlSW0-5I7C_j-Y58saWu0fR5A1_XWK2N-FrGiddtAkxuvtf2RWskbzVRsRdsnhRj8T5NlRmLWpiNrX67BTaNxukejpJeIDyBXuVeaCgYKAVASARMSFQFWKvPl2o7RB2gevIxJJJQzBkXlqA0163"; // Replace with your access token

    // Step 4: Make a call to get insights on a keyword
    const fetchKeywordInsights = async () => {
      try {
        const response = await fetch(
          `https://googleads.googleapis.com/v7/customers/${locationId}/keywordInsights`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              keyword: keywordText,
            }),
          },
        );

        const data = await response.json();
        setKeywordInsights(data);
      } catch (error) {
        // Handle API errors here
        console.error("Error occurred:", error);
      }
    };

    fetchKeywordInsights();
  }, [keywordText, locationId]);

  return (
    <div>
      <h1>Keyword Insights</h1>
      <ul>
        {keywordInsights.map((insight, index) => (
          <li key={index}>
            {/* Display the keyword insights data here */}
            <pre>{JSON.stringify(insight, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Keywords;
