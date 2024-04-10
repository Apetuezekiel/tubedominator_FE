import axios from "axios";

// VIDEO GENERATION
export async function getActorVoices() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/listVoices`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
        },
      },
    );

    console.log("VOOIIIIICCCEEEESSSSS", response.data.items);

    if (response.data.items) {
      const newData = response.data.items;

      console.log("actor Voices", newData);
      return newData;
    } else {
      console.error("Error fetching actor voices:", response);
      return null;
    }
  } catch (error) {
    console.error("Error fetching actor voices:", error);
    return null;
  }
}

export async function getActors() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/listActors`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
        },
      },
    );

    console.log("ACCCTTTOOOOSSS", response.data.items);

    if (response.data.items) {
      const newData = response.data.items;

      console.log("ACTORS", newData);
      return newData;
    } else {
      console.error("Error fetching actors:", response);
      return null;
    }
  } catch (error) {
    console.error("Error fetching actors:", error);
    return null;
  }
}

export async function retrieveClip(videoId) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/retrieveClip?videoId=${videoId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
        },
      },
    );

    console.log("RETRIEVED VIDEO", response.data);

    if (response.data) {
      const newData = response.data;

      console.log("RETRIEVED VIDEO", newData);
      return newData;
    } else {
      console.error("Error fetching finished video:", response);
      return null;
    }
  } catch (error) {
    console.error("Error fetching finished video:", error);
    return null;
  }
}

export async function generateClip(
  actorId,
  language,
  script,
  transparent = true,
) {
  const scriptWithoutNewlines = script.replace(/\n/g, "");
  // console.log(`actorId ${actorId}`, `language: ${language}`, `script: ${scriptWithoutNewlines}`);
  // return;
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/generateClip`,
      {
        actorId: actorId,
        language: language,
        script: scriptWithoutNewlines,
        transparent: transparent,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
        },
      },
    );

    console.log("Generation fired", response);

    if (response.data) {
      const newData = response.data;

      console.log("Generation Clip Data", newData);
      return newData;
    } else {
      console.error("Error fetching actors:", response);
      return null;
    }
  } catch (error) {
    console.error("Error fetching actors:", error);
    return null;
  }
}
