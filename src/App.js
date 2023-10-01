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
import "tippy.js/dist/tippy.css"; // Import Tippy.js CSS
import "tippy.js/themes/translucent.css"; // Import a Tippy.js theme (optional)
import "react-tippy/dist/tippy.css";

import { Navbar, Footer, Sidebar, ThemeSettings } from "./components";
import {
  Ecommerce,
  Orders,
  Calendar,
  Employees,
  Stacked,
  Pyramid,
  Customers,
  Kanban,
  Line,
  Area,
  Bar,
  Pie,
  Financial,
  ColorPicker,
  ColorMapping,
  Editor,
} from "./pages";
import Ideation from "./pages/Ideation3";
import Optimization from "./pages/Optimization";
import Reporting from "./pages/Reporting";
import SavedIdeas from "./pages/SavedIdeas";
import Keywords from "./pages/Keywords2";
import Rankings from "./pages/Rankings";
import "./App.css";
import Sort from "./data/Sortting";
import RegistrationForm from "./pages/UserAuth/registration/index2";
import { useSavedIdeasData, useUserLoggedin } from "./state/state";
import SignInPage from "./pages/UserAuth/SignInPage";
import SignUpPage from "./pages/UserAuth/SignUpPage";
import Opitimize from "./components/Opitimize";
import SearchTerm from "./components/SearchTerm";
import Tests from "./components/Tests";

import { useStateContext } from "./contexts/ContextProvider";
import Home from "./pages/Home";
import { gapi } from "gapi-script";
import Auth from "./components/Auth";
const client_id =
  "372673946018-lu1u3llu6tqi6hmv8m2226ri9qev8bb8.apps.googleusercontent.com";
const apiKey = "AIzaSyBhnxmlAowrcFI7owW40YrsqI3xPVVk0IU";

const App = () => {
  const { fetchSavedIdeasData } = useSavedIdeasData();

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

  function ProtectedRoute() {
    return userLoggedIn ? <Outlet /> : <Navigate to="/" />;
  }

  function AppRoutes() {
    return (
      <Routes>
        {/* Authentication */}
        <Route path="/auth" element={<Auth />} />

        {/* Optimization */}
        <Route path="/optimize" element={<Opitimize />} />

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Pages */}
        <Route path="/ideation" element={<ProtectedRoute />}>
          <Route path="/ideation" element={<Ideation />} />
        </Route>
        <Route path="/optimization" element={<Optimization />} />
        <Route path="/reporting" element={<Reporting />} />

        {/* Navigation */}
        <Route path="/nav" element={<Navbar />} />

        {/* User-Specific Routes */}
        <Route path="/savedideas" element={<SavedIdeas />} />
        <Route path="/ecommerce" element={<Ecommerce />} />
        <Route path="/pie" element={<Pie />} />
        <Route path="/keywords" element={<Keywords />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/searchterm" element={<SearchTerm />} />
        <Route path="/tests" element={<Tests />} />

        {/* User Registration */}
        <Route path="/channel" element={<RegistrationForm />} />

        {/* Sign-In and Sign-Up */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
      </Routes>
    );
  }
  useEffect(() => {
    // console.log("R--------------------", process.env.REACT_APP_YOUTUBE_API_KEY);

    fetchSavedIdeasData();
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  // useEffect(() => {
  //   gapi.load("client:auth2", () => {
  //     gapi.client.init({
  //       apiKey,
  //       client_id,
  //       scope:
  //         "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.upload",
  //     });
  //   });
  // }, []);

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.client.init({
        apiKey,
        client_id,
        scope:
          "https://www.googleapis.com/auth/youtube.readonly " +
          "https://www.googleapis.com/auth/youtube.force-ssl " +
          "https://www.googleapis.com/auth/youtube " +
          "https://www.googleapis.com/auth/youtube.upload " +
          "https://www.googleapis.com/auth/cse", // Added Custom Search scope
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
        pauseOnFocusLoss
        pauseOnHover
      ></ToastContainer>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
            <TooltipComponent content="Settings" position="Top">
              <button
                type="button"
                onClick={() => setThemeSettings(true)}
                style={{ background: currentColor, borderRadius: "50%" }}
                className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
              >
                <FiSettings />
              </button>
            </TooltipComponent>
          </div>
          {userLoggedIn ? (
            <div className="fixed sidebar dark:bg-secondary-dark-bg bg-white ">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={
              userLoggedIn
                ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
                : "bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2 "
            }
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
              <Navbar />
            </div>
            <div>
              {themeSettings && <ThemeSettings />}
              <AppRoutes />
            </div>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
