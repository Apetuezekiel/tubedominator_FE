/* eslint-disable */

import React, { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  Navigate,
  Outlet,
} from "react-router-dom";

import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/translucent.css";
import "react-tippy/dist/tippy.css";

import { Navbar, Footer, Sidebar, ThemeSettings } from "./components";
import Ideation from "./pages/Ideation3";
import Optimization from "./pages/Optimization";
import Reporting from "./pages/Reporting";
import SavedIdeas from "./pages/SavedIdeas";
import Keywords from "./pages/Keywords2";
import Rankings from "./pages/Rankings";
import "./App.css";
import Sort from "./data/Sortting";
import RegistrationForm from "./pages/UserAuth/registration/index2";

import {
  useSavedIdeasData,
  useUserAccessLevel,
  useUserData,
  useUserLoggedin,
} from "./state/state";
import SignInPage from "./pages/UserAuth/SignInPage";
import SignUpPage from "./pages/UserAuth/SignUpPage";
import Opitimize from "./components/Opitimize";
import SearchTerm from "./components/SearchTerm";
import Tests from "./components/Tests";
import IdeasCategoryView from "./components/IdeasCategoryView";
import SavedIdeasCategories from "./pages/SavedIdeasCategories";
import Register from "./pages/UserAuth/registration/Register";
import SignUpPage2 from "./pages/UserAuth/registration/SignUpPage";
import PreviewKeyword from "./components/PreviewKeyword";
import Sidebar2 from "./components/Sidebar2";

import { useStateContext } from "./contexts/ContextProvider";
import Home from "./pages/Home";
import { gapi } from "gapi-script";
import Auth from "./components/Auth";
import Insights from "./pages/keywords/Insights";
import Competition from "./pages/keywords/Competition";
import ConnectYoutube from "./pages/ConnectYoutube";
import AiPostGenerator from "./pages/AiPostGenerator";
import Testss from "./pages/Testss";
import axios from "axios";
import { userFullDataDecrypted } from "./data/api/calls";
import GenerateIdeasPanel from "./components/GenerateIdeasPanel";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const App = () => {
  const decryptedFullData = userFullDataDecrypted();

  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();
  const userLoggedIn = useUserLoggedin((state) => state.userLoggedIn);
  const setUserLoggedIn = useUserLoggedin((state) => state.setUserLoggedIn);
  const accessLevel = useUserAccessLevel((state) => state.accessLevel);
  const setAccessLevel = useUserLoggedin((state) => state.setAccessLevel);
  const userData = useUserData((state) => state.userData);
  const setUserData = useUserData((state) => state.setUserData);
  function ProtectedRoute() {
    return userLoggedIn && accessLevel === "L2" ? (
      <Outlet />
    ) : (
      <Navigate to="/" />
    );
  }

  function AppRoutes() {
    return (
      <Routes>
        {/* Authentication */}
        <Route path="/auth" element={<Auth />} />

        {/* Pages */}
        <Route path="/ideation" element={<ProtectedRoute />}>
          <Route index element={<Ideation />} />
          <Route path="competition" element={<Competition />} />
          <Route path="insights" element={<Insights />} />
        </Route>

        <Route path="/optimization" element={<ProtectedRoute />}>
          <Route index element={<Optimization />} />
          <Route path="optimize" element={<Opitimize />} />
        </Route>

        <Route path="/ai-generator" element={<ProtectedRoute />}>
          <Route index element={<AiPostGenerator />} />
          <Route path="ai-generator" element={<AiPostGenerator />} />
        </Route>

        <Route path="/reporting" element={<ProtectedRoute />}>
          <Route path="/reporting" element={<Reporting />} />
        </Route>

        <Route path="/saved-ideas" element={<ProtectedRoute />}>
          <Route path="/saved-ideas" element={<SavedIdeas />} />
        </Route>

        <Route path="/keywords" element={<ProtectedRoute />}>
          <Route index element={<Keywords />} />
        </Route>

        <Route path="rankings" element={<Rankings />} />

        <Route path="/searchterm" element={<ProtectedRoute />}>
          <Route path="/searchterm" element={<SearchTerm />} />
        </Route>

        {/* <Route path="/channel" element={<ProtectedRoute />}> */}
        <Route path="/channel" element={<RegistrationForm />} />
        <Route path="/sidebar" element={<Sidebar2 />} />
        <Route path="/generate" element={<GenerateIdeasPanel />} />
        {/* </Route> */}

        {/* Navigation */}
        <Route path="/nav" element={<Navbar />} />

        {/* User-Specific Routes */}
        <Route path="/ideascategory" element={<IdeasCategoryView />} />
        <Route path="/saved-ideas-cat" element={<SavedIdeasCategories />} />
        <Route path="/preview" element={<PreviewKeyword />} />
        <Route path="/tests" element={<Testss />} />
        <Route path="/register" element={<Register />} />
        <Route path="/youtube" element={<ConnectYoutube />} />
      </Routes>
    );
  }
  useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  useEffect(() => {
    const fetchUserYoutubeInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/getSavedUserYoutubeInfo`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.REACT_APP_X_API_KEY,
              Authorization: `Bearer ${decryptedFullData.token}`,
            },
          },
        );

        setUserData(response.data.data);
        console.log(
          "getSavedUserYoutubeInfo:",
          response.data,
          decryptedFullData.token,
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    console.log("is user logged in from App.js:", userLoggedIn);

    // Only fetch data if the user is logged in
    if (userLoggedIn) {
      fetchUserYoutubeInfo();
    }
  }, [userLoggedIn]);

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.client.init({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        clientId: process.env.REACT_APP_CLIENT_ID,
        scope:
          "https://www.googleapis.com/auth/youtube.readonly " +
          "https://www.googleapis.com/auth/youtube.force-ssl " +
          "https://www.googleapis.com/auth/youtube " +
          "https://www.googleapis.com/auth/youtube.upload " +
          "https://www.googleapis.com/auth/cse",
      });
    });
  }, []);

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        // hideProgressBar={false}
        // newestOnTop={false}
        closeOnClick
        // pauseOnFocusLoss
        // pauseOnHover
      ></ToastContainer>
      <BrowserRouter>
        <div className="relative w-full">
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
            <Navbar />
          </div>
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />

            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            {/* Sign-In and Sign-Up */}
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
          </Routes>
          <div
            className="flex w-full"
            style={{ backgroundColor: `${userLoggedIn && "#F1F1FA"}` }}
          >
            <div className="" style={{ width: "5vw" }}>
              {userLoggedIn && (
                <div className="flex justify-center mt-20 h-72">
                  <Sidebar />
                </div>
              )}
            </div>
            <div className="" style={{ width: "95vw" }}>
              {/* {themeSettings && <ThemeSettings />} */}
              <AppRoutes />
            </div>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
