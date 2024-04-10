import React, { useEffect, useState } from "react";
import { Header } from "../../components";
import axios from "axios"; // Import Axios for making API requests
import userImage from "../../data/donought.png";
// import systemImage from "../../data/systemImage.png";
import { BiLoaderCircle, BiSearch } from "react-icons/bi";
import { BsLightningChargeFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import {
  chatWithAI,
  generateChatID,
  getAllChatsForUser,
  storeChatWithAI,
} from "./api";
import Loader from "../../components/Loader";
import Tags from "../../components/Tags";
import defaultChannelQuestions from "./data/questions";
import { useUserProfilePic } from "../../state/state";
import { fetchMyYoutubeInfo } from "../Optimization/api";
import { fetchUser } from "../../data/api/calls";
import { IoCheckmarkCircle } from "react-icons/io5";
import { FcCancel } from "react-icons/fc";

const AICoach = () => {
  const [sendingMessage, setSendingMessage] = useState(""); // State to indicate if a message is being sent
  const [inputText, setInputText] = useState(""); // State to store user input text
  const [chatId, setChatId] = useState(""); // State to store the current chat ID
  const [selectedChatId, setSelectedChatId] = useState(""); // State to store the current chat ID
  const [allUserChats, setAllUserChats] = useState([]); // State to store all chats of the user
  const [chatHistory, setChatHistory] = useState([]); // State to store chat history for the current chat session
  const [chatMessages, setChatMessages] = useState([]);
  const [userChannelInfo, setUserChannelInfo] = useState({});
  const [showChat, setShowChat] = useState("new");
  const [loadingAllUserChats, setLoadingAllUserChats] = useState(false);
  const [loadedUserChats, setLoadedUserChats ] = useState(false);
  const [loadingUserInfoIntoAI, setLoadingUserInfoIntoAI] = useState(false);
  const [channelDataLoadedIntoAI, setChannelDataLoadedIntoAI] = useState(false);
  const [chatTitle, setChatTitle] = useState("");
  const [titleSetForChatId, setTitleSetForChatId] = useState({});
  const userProfilePic = useUserProfilePic((state) => state.userProfilePic);

  // Generate new chatID
  useEffect(() => {
    const fetchChatId = async () => {
      const chatId = await generateChatID();
      setChatId(chatId);
    };

    fetchChatId();
  }, []); // Add newChat ID flag to dependency array

  // Fetch and Load All Chats into UI
  useEffect(() => {
    let isMounted = true;
  
    setLoadingAllUserChats(true);
    setLoadedUserChats(true); // Assuming you have a state variable for loaded status
  
    const fetchAllChats = async () => {
      localStorage.removeItem("allUserChats");
      let chatsFromLocalStorage = JSON.parse(
        localStorage.getItem("allUserChats"),
      );
  
      if (chatsFromLocalStorage) {
        if (isMounted) {
          // Serve data from localStorage if available
          setAllUserChats(chatsFromLocalStorage);
          setLoadingAllUserChats(false);
        }
      }
  
      try {
        // Fetch data from the API regardless
        const chats = await getAllChatsForUser();
        console.log("chats gotten", chats);
        if (chats) {
          if (isMounted) {
            // Update localStorage with new data
            console.log("chats returned from API CALL: ", chats);
            localStorage.setItem("allUserChats", chats); // Stringify chats before storing
            // Update the state with the fetched chats
            setAllUserChats(chats);
            setLoadingAllUserChats(false);
          }
        } else {
          // Handle the case when fetching chats fails
          console.error("Failed to fetch user chats");
          if (isMounted) {
            setLoadingAllUserChats(false);
            setLoadedUserChats(false); // Set loaded status to false
          }
        }
      } catch (error) {
        // Handle any errors that occur during fetching
        console.error("Error fetching user chats:", error);
        if (isMounted) {
          setLoadingAllUserChats(false);
          setLoadedUserChats(false); // Set loaded status to false
        }
      }
    };
  
    fetchAllChats();
  
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);
  
  function removeEscapedCharacters(inputString) {
    // Replace escaped characters with their unescaped counterparts
    return inputString.replace(/\\(.)/g, '$1');
  }

  function addEscapeCharacters(inputString) {
    // Define the characters to be escaped and their corresponding escaped versions
    const escapeMap = {
      '"': '\\"',
      '\\': '\\\\',
      '\n': '\\n',
      '\r': '\\r',
      '\t': '\\t'
    };
  
    // Replace each character with its escaped version
    return inputString.replace(/(["\\\n\r\t])/g, (match, char) => escapeMap[char]);
  }

  const sendMessageToAI = async (text, title, chatHistory) => {
    if (!text) {
      console.error("Error: Text parameter is empty or null");
      return;
    }

    try {
      // Send message to AI
      setLoadingUserInfoIntoAI(true);
      const message = await sendMessage(text, true, title, chatHistory);

      // Clear inputText
      // setChatHistory([]);
      setInputText("");

      if (message) {
        console.log("User channel info loaded");
        setLoadingUserInfoIntoAI(false);
        setChannelDataLoadedIntoAI(true);
      } else {
        console.log("User info did not load");
        setLoadingUserInfoIntoAI(false);
      }
    } catch (error) {
      console.error("Error sending message to AI:", error);
      setLoadingUserInfoIntoAI(false);
    }
  };

  // Fetch user's YouTube channel information and send it to AI
  const fetchUserChannelInfoAndSendToAI = async (title) => {
    setLoadingUserInfoIntoAI(true);

    try {
      // Fetch user's YouTube channel information and recent videos
      const [posts, description] = await Promise.all([
        fetchMyYoutubeInfo(),
        fetchUser(),
      ]);

      // Sort posts by combined engagement (viewCount + commentCount) in descending order
      const sortedPosts = posts
        .sort(
          (a, b) =>
            a.viewCount + a.commentCount - (b.viewCount + b.commentCount),
        )
        .reverse();

      // Pick the top three posts with highest engagement
      const topThreePosts = sortedPosts.slice(0, 3);

      // Format the posts
      const formattedPosts = topThreePosts.map((post) => ({
        title: post.title,
        description: post.description,
        viewCount: post.viewCount,
        commentCount: post.commentCount,
      }));

      // Return formatted channel information
      const channelInfo = {
        posts: formattedPosts,
        channelName: description.channelName,
        channelDescription: description.channelDescription,
      };

      // Stringify the channel information
      const stringifiedChannelInfo = JSON.stringify(channelInfo);

      // Set input text for AI
      setInputText((prevInputText) => {
        const newText = `${stringifiedChannelInfo} The above is a stringified object containing my channel details my info of my top channel videos. Use the info for any Subsequent questions I might ask relating to my channel`;

        const chatHistory = [
          { role: "user", content: newText },
          { role: "user", content: "Based off my content, " + title + ". Ensure to add new lines where necessary using the right symbol so my HTML rightly interprets." }
        ];

        // Send message to AI after updating input text
        sendMessageToAI(newText, title, chatHistory);
        return newText;
      });
    } catch (error) {
      console.error("Error fetching user channel information:", error);
    }
  };

  // Function to handle user input change
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // Function to send user message to the API and receive response
  const sendMessage = async (inputText, channelData, title, history) => {
    if (inputText.trim() === "") return;

// Add user message to chat history
const updatedHistory = !history ? 
  [
    ...chatHistory,
    { role: "user", content: `${inputText}. Ensure to add new lines where necessary using the right symbol so my HTML rightly interprets.` }
  ] : 
  history;


if (channelData === false) {
  setSendingMessage(true);
} else {
  setLoadingUserInfoIntoAI(true);
}

setChatHistory(updatedHistory);
setInputText(""); // Clear input field

try {
  // Send the updated chat history to the ChatGPT API
  console.log("chat history BEFORE talking to AI: ", updatedHistory);
  const messageResponse = await chatWithAI(updatedHistory, chatId);
  console.log("chatId", chatId);

  if (messageResponse !== null && messageResponse !== "") {
    // Update chat history with system's response
    const updatedHistoryWithResponse = channelData === true
    ? [
      ...updatedHistory.slice(1),
      { role: "system", content: messageResponse }
      ]
    : [
        ...updatedHistory,
        { role: "system", content: messageResponse },
      ];
  

  console.log("chat history AFTER talking to AI: ", updatedHistoryWithResponse);


    // Add API response to chat history
    const chatNo = allUserChats.length;
    await storeChatWithAI(title ? title : `chat-${chatNo}`, updatedHistoryWithResponse, chatId);
    // setChatTitle(updatedHistory[0].content);
    console.log("updatedHistoryWithResponse", updatedHistoryWithResponse);
    setChatMessages(updatedHistoryWithResponse);
    setChatHistory(updatedHistoryWithResponse);
    // Check if executed for this chatId

    // Find if there is an object in allUserChats with the same chatId
    const oldChat = allUserChats.find((chat) => chat.chatId === chatId);

    // If oldChat is undefined, it means there's no object with the same chatId
    if (!oldChat) {
      // Update allUserChats only once for this chatId
      setAllUserChats((prevChats) => [
        ...prevChats,
        {
          messages: updatedHistoryWithResponse,
          title: `chat-${chatNo}`,
          chatId: chatId, // Assuming chatId should be stored in the allUserChats object
        },  
      ]);
      loadChat(chatId);
    } else {
      // Find the index of the object with the same chatId in allUserChats
      const chatIndex = allUserChats.findIndex((chat) => chat.chatId === chatId);
    
      if (chatIndex !== -1) {
        console.log("Got here, Is this a new chat?");
        // Update the content of the existing chat object
        const updatedChat = {
          ...allUserChats[chatIndex],
          messages: updatedHistoryWithResponse,
        };
    
        // Update allUserChats by replacing the old object with the updated one
        setAllUserChats((prevChats) => [
          ...prevChats.slice(0, chatIndex),
          updatedChat,
          ...prevChats.slice(chatIndex + 1),
        ]);

        loadChat(chatId);
      }
    }
    

    setSendingMessage(false);
    return true;
  }
} catch (error) {
  console.error("Error sending message to API:", error);
  setSendingMessage(false);
  return false;
}

  };

  const sendMessageOnEnter = (inputText) => (event) => {
    if (event.key === "Enter") {
      sendMessage(inputText, false);
    }
  };

  const newChat = async () => {
    console.log("newChattttt");
    try {
      const newChatId = await generateChatID();
      console.log("newChatId: ", newChatId);

      // Reset chat history an input text
      setShowChat("new");
      setChatId(newChatId);
      setChatHistory([]);
      setInputText("");
    } catch (error) {
      console.error("Error generating new chat:", error);
    }
  };

  const loadChat = (id) => {
    try {
      console.log("allUserChats to load chat with: ",allUserChats);
      const chat = allUserChats.find((chat) => chat.chatId === id);
      if (chat) {
        const messagesString = chat.messages;
        if (Array.isArray(messagesString)){
          setChatMessages(messagesString);
          setChatHistory(messagesString);
        } else {
          const messagesArray = JSON.parse(messagesString);
          const messagesArray2 = JSON.parse(messagesArray);
          console.log("messagesArray2", messagesArray2);
          setChatMessages(messagesArray2);
          setChatHistory(messagesArray2);
        }
        setShowChat("old");
        setSelectedChatId(id);
        setChatId(chat.chatId);
      } else {
        console.error("Chat not found for id:", id);
      }
    } catch (error) {
      console.error("Error parsing messages string:", error);
    }
  };

  const analyzeYoutubeData = async () => {
    await fetchUserChannelInfoAndSendToAI("Analyze my data");
    await sendMessage(
      "Analyze my youtube channel and potential for success, getting subscribers and views. ensure to add new lines where necessary using the right symbol so my html rightly interprets",
      false,
    );
  };

  return (
    <section>
      <div className={`m-2 md:m-10 mt-24 p-2 md:p-10 min-h-screen`}>
        <div className="w-full flex">
          <div className="w-1/2 flex py-2">
            <div className="">
              <div className="pageTitle text-3xl font-semibold">AI COACH</div>
              <div className="tag text-md mt-2 text-xs font-thin">
                Ask me questions about your Youtube channel
              </div>
            </div>
          </div>
          <div className="w-1/2 flex justify-end py-2"></div>
        </div>
        <div>
          <br />
          <div className="rounded-md bg-white p-5">
            <Header title={`Folders`} size="text-1xl" mt={0} />
            <div className="w-full flex chat-container">
              <div className="history-container w-2/6 bg-gray-800 rounded-md px-4 py-4">
                <button
                  className="rounded-full py-2 px-4 btn border-1 border-white text-white flex items-center gap-2 text-sm"
                  style={{ border: "solid 1px #" }}
                  onClick={newChat}
                >
                  <FaPlus />
                  New Chat
                </button>
                {loadingAllUserChats ? (
                  <Loader
                    message={"Loading History"}
                    iconColor={"white"}
                    messageColor={"white"}
                  />

                ) : loadedUserChats === false ? (
                  <div className="text-xs text-white w-full flex justify-center items-center my-auto mt-20">
                    <FcCancel className="mr-3" />Error loading chat history
                  </div>
                ) : (
                  allUserChats.map((chat, index) => (
                    <div key={index} className="mt-5">
                      <span
                        className={`p-2 rounded-lg text-xs text-white w-4/6 overflow-hidden whitespace-nowrap flex flex-col gap-2 cursor-pointer`}
                        style={{backgroundColor: `${chat.chatId === selectedChatId ? "#EAEAFE" : ""}`, color: `${chat.chatId === selectedChatId ? "#000000" : "#ffffff"}`}}
                        onClick={() => loadChat(chat.chatId)}
                      >
                        {chat.title.length > 32
                          ? `${chat.title.slice(0, 32)}...`
                          : chat.title}
                      </span>
                    </div>
                  ))
                  
                )}
              </div>

              <div className="input-container w-4/6 px-5 py-5" style={{ overflowX: 'auto' }}>
                {/* Channel Data Loaded Flag */}
                <span className="">
                  {channelDataLoadedIntoAI && (
                    <span
                      className="p-2 border rounded-full text-xs flex justify-center items-center mb-10"
                      style={{
                        borderWidth: "3px",
                        borderColor: "green",
                        transition: "border 0.5s ease",
                      }}
                    >
                      <IoCheckmarkCircle color="green" className={"mr-3"} />
                      Channel Data Loaded
                    </span>
                  )}
                </span>
                {/*END - Channel Data Loaded Flag*/}

                {showChat === "new" && (
                  <div>
                    <Tags items={defaultChannelQuestions} ml={"ml-0"} onClick={(clickedItem) => fetchUserChannelInfoAndSendToAI(clickedItem)}  />
                  </div>
                )}
                {showChat === "old" &&
                  chatMessages.map((chat, index) => (
                    <div key={index}>
                      {chat.role === "user" ? (
                        <div className="flex justify-end mb-5">
                          <div
                            className="rounded-md text-xs px-3 py-2 w-1/2 mr-2 text-white"
                            style={{ backgroundColor: "#1F2937" }}
                          >
                            {chat.content}
                          </div>
                          <img
                            src={userProfilePic}
                            alt=""
                            className="h-10 w-10 rounded-full"
                          />
                        </div>
                      ) : (
                        <div className="flex mb-10">
                          <img
                            src={
                              "https://media.kasperskydaily.com/wp-content/uploads/sites/92/2024/02/27081259/robot-toy-security-issue-featured.jpg"
                            }
                            alt=""
                            className="h-10 w-10 rounded-full mr-2"
                          />
                          <div
                            className="rounded-md text-xs px-3 py-2 w-1/2 mr-2"
                            style={{ backgroundColor: "#F1F1FA" }}
                          >
                            {chat.role === "system" && chat.content}
                          </div>
                          <hr className="border-2" />
                          <br />
                          <br />
                        </div>
                      )}
                    </div>
                  ))}
                {sendingMessage && (
                  <Loader
                    messages={[
                      "Analyzing your question",
                      "Processing your request",
                    ]}
                  />
                )}
                {loadingUserInfoIntoAI && (
                  <Loader message={"Loading your channel Data"} />
                )}

                <div className="w-full mt-10 flex items-center p-2 pl-4 pr-4 border border-gray-300 bg-white rounded-full">
                  <input
                    type="text"
                    placeholder="Ask me a question"
                    className="flex-grow bg-transparent outline-none pr-2 text-xs"
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={sendMessageOnEnter(inputText)}
                    readOnly={sendingMessage} // make input read-only when sendingMessage is true
                  />
                  <button
                    className={`text-white rounded-full px-4 py-2 ml-4 flex items-center text-xs getIdeasBtn`}
                    onClick={() => {
                      sendMessage(inputText, false);
                    }}
                    style={{
                      background: sendingMessage
                        ? "linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))"
                        : "linear-gradient(270deg, #4B49AC 0.05%, #9999FF 99.97%), linear-gradient(0deg, rgba(0, 0, 21, 0.1), rgba(0, 0, 21, 0.1))",
                    }}
                    disabled={sendingMessage} // disable the button when sendingMessage is true
                  >
                    <BsLightningChargeFill className="mr-2" color="white" />
                    Send
                    {sendingMessage && (
                      <BiLoaderCircle
                        className="animate-spin text-center ml-2"
                        size={20}
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AICoach;
