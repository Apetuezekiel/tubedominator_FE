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
import Keywords from "./pages/Keywords";
import Rankings from "./pages/Rankings";
import "./App.css";
import RegistrationForm from "./pages/UserAuth/registration/index2";

import {
  useUserAccessLevel,
  useUserData,
  useUserLoggedin,
} from "./state/state";
import SignInPage from "./pages/UserAuth/SignInPage";
import SignUpPage from "./pages/UserAuth/SignUpPage";
import Opitimize from "./components/Opitimize";
import SearchTerm from "./components/SearchTerm";
import IdeasCategoryView from "./components/IdeasCategoryView";
import SavedIdeasCategories from "./pages/SavedIdeasCategories";
import PreviewKeyword from "./components/PreviewKeyword";
import { useStateContext } from "./contexts/ContextProvider";
import Home from "./pages/Home";
import { gapi } from "gapi-script";
import Insights from "./pages/keywords/Insights";
import Competition from "./pages/keywords/Competition";
import ConnectYoutube from "./pages/ConnectYoutube";
import AiPostGenerator from "./pages/AiPostGenerator";
import { fetchUser, userFullDataDecrypted } from "./data/api/calls";
import GenerateIdeasPanel from "./components/GenerateIdeasPanel";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Settings from "./pages/Settings";
import SignUpBundlePage from "./pages/UserAuth/SignUpBundlePage";
import SignUpPremiumPage from "./pages/UserAuth/SignUpPremiumPage";
import DFYSEOAgency from "./pages/bundle/DFYSEOAgency";
import AffilliateMarketingCoaching from "./pages/bundle/AffilliateMarketingCoaching";
import DFYCampaigns from "./pages/bundle/25DFYCampaigns";
import UnlimitedTraffic from "./pages/bundle/UnlimitedTraffic";
import Training from "./pages/Training";

const App = () => {
  // const decryptedFullData = userFullDataDecrypted();

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
    return userLoggedIn ? <Outlet /> : <Navigate to="/" />;
  }
  function ProtectedRouteLoggedIn() {
    return !userLoggedIn ? <Outlet /> : <Navigate to="/ideation" />;
  }

  function AppRoutes() {
    return (
      <Routes>
        {/* Pages */}
        <Route path="/ideation" element={<ProtectedRoute />}>
          <Route index element={<Ideation />} />
          <Route path="competition" element={<Competition />} />
          <Route path="insights" element={<Insights />} />
        </Route>

        <Route path="/optimization" element={<ProtectedRoute />}>
          <Route index element={<Optimization />} />
        </Route>

        <Route path="optimize" element={<Opitimize />} />

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
        <Route path="/generate" element={<GenerateIdeasPanel />} />
        <Route path="/settings" element={<Settings />} />
        {/* </Route> */}

        {/* Navigation */}
        <Route path="/nav" element={<Navbar />} />

        {/* User-Specific Routes */}
        <Route path="/ideascategory" element={<IdeasCategoryView />} />
        <Route path="/saved-ideas-cat" element={<SavedIdeasCategories />} />
        <Route path="/preview" element={<PreviewKeyword />} />
        <Route path="/youtube" element={<ConnectYoutube />} />
        <Route path="/dfy-seo-agency" element={<DFYSEOAgency />} />
        <Route
          path="/afilliate-marketing-coaching"
          element={<AffilliateMarketingCoaching />}
        />
        <Route path="/dfy-campaigns" element={<DFYCampaigns />} />
        <Route path="/unlimited-traffic" element={<UnlimitedTraffic />} />
        <Route path="/training" element={<Training />} />
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const fetchedUser = await fetchUser();
  //       setFetchUserData(fetchedUser);

  //       console.log("fetched user data: ", fetchedUser);
  //     } catch (error) {

  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   const fetchUserYoutubeInfo = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_API_BASE_URL}/getSavedUserYoutubeInfo`,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             "x-api-key": process.env.REACT_APP_X_API_KEY,
  //             Authorization: `Bearer ${decryptedFullData.token}`,
  //           },
  //         },
  //       );

  //       setUserData(response.data.data);
  //       console.log(
  //         "getSavedUserYoutubeInfo:",
  //         response.data,
  //         decryptedFullData.token,
  //       );
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   console.log("is user logged in from App.js:", userLoggedIn);

  //   // Only fetch data if the user is logged in
  //   if (userLoggedIn) {
  //     fetchUserYoutubeInfo();
  //   }
  // }, [userLoggedIn]);

  useEffect(() => {
    const fetchDataAndInitGAPI = async () => {
      try {
        const fetchedUser = await fetchUser();
        console.log("fetched user data: ", fetchedUser);

        // Initialize gapi.client inside the try block
        gapi.load("client:auth2", () => {
          gapi.client.init({
            // apiKey: fetchedUser.apiKey,
            clientId: fetchedUser.ClientId,
            // apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
            // clientId: process.env.REACT_APP_CLIENT_ID,
            scope:
              "https://www.googleapis.com/auth/youtube.readonly " +
              "https://www.googleapis.com/auth/youtube.force-ssl " +
              "https://www.googleapis.com/auth/youtube " +
              "https://www.googleapis.com/auth/youtube.upload " +
              "https://www.googleapis.com/auth/cse",
          });
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchDataAndInitGAPI();
  }, []);

  // useEffect(() =>{
  //   const userRegEmail = localStorage.getItem("userRegEmail");
  //   const isChannelRegistered = async (user_id, GUserData) => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_API_BASE_URL}/ischannelRegistered?email=${userRegEmail}`,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             "x-api-key": process.env.REACT_APP_X_API_KEY,
  //           },
  //         },
  //       );

  //       console.log("is channel registered", response.data.success);
  //       if (response.data.success) {
  //       } else {
  //       }
  //     } catch (error) {
  //       console.error("Error checking user channel connection status", error);
  //       throw error;
  //     }
  //   };
  // })
  // const navigate = useNavigate();
  const excludedRoutes = [
    "/",
    "/privacy-policy",
    "/sign-up",
    "/sign-in",
    "/premium-account-create",
    "/premium-account-create",
  ];
  const redirectRoutes = [
    "/sign-in",
    "/sign-up",
    "/premium-account-create",
    "/bundle-account-create",
  ];

  // Wrap your routes with a higher-order component to conditionally redirect
  // const ProtectedRoute = ({ path, element }) => {
  //   if (userLoggedIn && redirectRoutes.includes(path)) {
  //     return <Navigate to="/ideation" />;
  //   } else {
  //     return <Route path={path} element={element} />;
  //   }
  // };

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
        toastStyle={{ zIndex: 10000 }}
      ></ToastContainer>
      <BrowserRouter>
        <div className="relative w-full">
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
            <Navbar />
          </div>
          <Routes>
          <Route
        path="/"
        element={userLoggedIn ? <Navigate to="/ideation" /> : <Home />}
      />


            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            {/* Sign-In and Sign-Up */}
            <Route path="/sign-up" element={<ProtectedRouteLoggedIn />}>
              <Route path="/sign-up" element={<SignUpPage />} />
            </Route>
            <Route path="/sign-in" element={<ProtectedRouteLoggedIn />}>
              <Route path="/sign-in" element={<SignInPage />} />
            </Route>
            <Route
              path="/premium-account-create"
              element={<ProtectedRouteLoggedIn />}
            >
              <Route
                path="/premium-account-create"
                element={<SignUpPremiumPage />}
              />
            </Route>
            <Route
              path="/bundle-account-create"
              element={<ProtectedRouteLoggedIn />}
            >
              <Route
                path="/bundle-account-create"
                element={<SignUpBundlePage />}
              />
            </Route>
            {/* <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route
              path="/premium-account-create"
              element={<SignUpPremiumPage />}
            />
            <Route
              path="/bundle-account-create"
              element={<SignUpBundlePage />}
            /> */}
          </Routes>
          <div
            className="flex w-full"
            style={{ backgroundColor: `${userLoggedIn && "#F1F1FA"}` }}
          >
            <div className="" style={{ width: "5vw" }}>
              {
                // !excludedRoutes.includes(navigate.pathname) &&
                userLoggedIn && (
                  <div className="flex justify-center mt-20">
                    <Sidebar />
                  </div>
                )
              }
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
