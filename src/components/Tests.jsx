/* eslint-disable */

import React, { useState, useEffect } from "react";

function MyTableComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetchDataFromAPI();
  }, []);

  const fetchDataFromAPI = async () => {
    // Make an API call to fetch data
    try {
      const response = await fetch("API_URL");
      const result = await response.json();
      setData(result);
    } catch (error) {
      // Handle API fetch error
      console.error("Error fetching data:", error);
    }
  };

  const handleBookmark = async (item) => {
    // Make an API call to toggle bookmark status
    try {
      // Assuming your API endpoint supports toggling the bookmark status
      const response = await fetch(`API_URL/bookmark/${item.id}`, {
        method: "PUT",
      });
      const result = await response.json();

      // Update the local state with the new data
      setData((prevData) =>
        prevData.map((d) =>
          d.id === item.id ? { ...d, bookmarked: result.bookmarked } : d,
        ),
      );
    } catch (error) {
      // Handle API error
      console.error("Error bookmarking item:", error);
    }
  };

  const handleDelete = async (item) => {
    // Make an API call to delete the item
    try {
      await fetch(`API_URL/delete/${item.id}`, {
        method: "DELETE",
      });

      // Update the local state by removing the deleted item
      setData((prevData) => prevData.filter((d) => d.id !== item.id));
    } catch (error) {
      // Handle API error
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      <table>
        <thead>{/* Table headers */}</thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {/* Render table row with data */}
              <td>{item.name}</td>
              <td>
                <button onClick={() => handleBookmark(item)}>
                  {item.bookmarked ? "Unbookmark" : "Bookmark"}
                </button>
              </td>
              <td>
                <button onClick={() => handleDelete(item)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyTableComponent;
