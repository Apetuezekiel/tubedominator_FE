import axios from "axios";

export function generateChatID() {
  const userEmail = localStorage.getItem("userRegEmail");
  const currentYear = new Date().getFullYear(); // Get current year
  const currentTime = new Date().toISOString().slice(11, 19).replace(/:/g, ""); // Get current time in format HHMMSS

  return userEmail + currentYear + currentTime;
}

export async function chatWithAI(messages, id) {
  // const userEmail = localStorage.getItem('userRegEmail');
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/chatWithAI`,
      {
        // userEmail,
        // chatId: id,
        messages: messages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
        },
      },
    );

    console.log("chatWithAI", response);

    if ((response.data.success = true)) {
      const newData = response.data.message;

      console.log("chatWithAI data", newData);
      return newData;
    } else {
      console.error("Error fetching chat response:", response);
      return null;
    }
  } catch (error) {
    console.error("Error fetching chat response:", error);
    return null;
  }
}

export async function storeChatWithAI(title, messages, id) {
  const userEmail = localStorage.getItem("userRegEmail");
console.log("JSON.stringify(messages)", JSON.stringify(messages));
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/storeChatWithAI`,
      {
        email: userEmail,
        title,
        chatId: id,
        messageArray: JSON.stringify(messages),
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
        },
      },
    );

    console.log("chatWithAI", response);

    if (response.data.success === true) {
      const newData = response.data.message;

      console.log("chatWithAI data", newData);
      return newData;
    } else {
      console.error("Error fetching chat response:", response);
      return null;
    }
  } catch (error) {
    console.error("Error fetching chat response:", error);
    return null;
  }
}

export async function getChatWithAI(chatId) {
  const userEmail = localStorage.getItem("userRegEmail");

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/getChatWithAI`,
      {
        params: {
          chatId: chatId,
          email: userEmail,
        },
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
        },
      },
    );

    if (response.data.success) {
      const chatData = response.data.chat;
      console.log("Chat with AI retrieved successfully:", chatData);
      return chatData;
    } else {
      console.error("Failed to retrieve chat:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching chat:", error);
    return null;
  }
}

export async function getAllChatsForUser() {
  const userEmail = localStorage.getItem("userRegEmail");

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/getAllChatsForUser`,
      {
        params: {
          email: userEmail,
        },
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_X_API_KEY,
        },
      },
    );

    console.log("getAllChatsForUser", response);

    if (response.data.success) {
      const allChats = response.data.chats;
      console.log("All chats retrieved successfully:", allChats);
      return allChats;
    } else {
      console.error("Failed to retrieve all chats:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching all chats:", error);
    return null;
  }
}
