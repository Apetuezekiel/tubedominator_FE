/* eslint-disable */

import React, { useEffect } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
// import Ideation from "./pages/Ideation";
import Ideation from "./pages/Ideation3";
import Optimization from "./pages/Optimization";
import Reporting from "./pages/Reporting";
import SavedIdeas from "./pages/SavedIdeas";
import Keywords from "./pages/Keywords2";
import Rankings from "./pages/Rankings";
import "./App.css";
import OAuthConsent from "./components/OAuthConsent";
// import Keywords from "./pages/Keywords";
import Sort from "./data/Sortting";
import RegistrationForm from "./pages/UserAuth/registration/index2";
import { useSavedIdeasData, useUserLoggedin } from "./state/state";
import Nav from "./components/Navb";
import SignInPage from "./pages/UserAuth/SignInPage";
import SignUpPage from "./pages/UserAuth/SignUpPage";
import Opitimize from "./components/Opitimize";

import { useStateContext } from "./contexts/ContextProvider";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  SignUp,
  useUser,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import Home from "./pages/Home";
import { gapi } from "gapi-script";
import Auth from "./components/Auth";
const client_id =
  "372673946018-lu1u3llu6tqi6hmv8m2226ri9qev8bb8.apps.googleusercontent.com";
const apiKey = "AIzaSyBhnxmlAowrcFI7owW40YrsqI3xPVVk0IU";

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function PublicPage() {
  return (
    <>
      <h1>Public page</h1>
      <a href="/protected">Go to protected page</a>
    </>
  );
}

function ProtectedPage() {
  return (
    <>
      <h1>Protected page</h1>
      <UserButton />
    </>
  );
}

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();

  return (
    // <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/optimize" element={<Opitimize />} />
      <Route
        path="/"
        element={
          <>
            <SignedIn>
              <Ideation />
            </SignedIn>
            <SignedOut>
              <Home />
            </SignedOut>
          </>
        }
      />
      {/* pages  */}
      <Route
        path="/ideation"
        element={
          <>
            <SignedIn>
              <Ideation />
            </SignedIn>
            <SignedOut>
              <Home />
            </SignedOut>
          </>
        }
      />
      <Route
        path="/optimization"
        element={
          <>
            <SignedIn>
              <Optimization />
            </SignedIn>
          </>
        }
      />
      <Route
        path="/reporting"
        element={
          <>
            <SignedIn>
              <Reporting />
            </SignedIn>
          </>
        }
      />
      <Route
        path="/nav"
        element={
          <>
            <SignedIn>
              <Navbar />
            </SignedIn>
          </>
        }
      />
      <Route
        path="/savedideas"
        element={
          <>
            <SignedIn>
              <SavedIdeas />
            </SignedIn>
          </>
        }
      />
      <Route
        path="/ecommerce"
        element={
          <>
            <SignedIn>
              <Ecommerce />
            </SignedIn>
          </>
        }
      />
      <Route
        path="/pie"
        element={
          <>
            <SignedIn>
              <Pie />
            </SignedIn>
          </>
        }
      />
      <Route
        path="/keywords"
        element={
          <>
            <SignedIn>
              <Keywords />
            </SignedIn>
          </>
        }
      />
      <Route
        path="/rankings"
        element={
          <>
            <SignedIn>
              <Rankings />
            </SignedIn>
          </>
        }
      />
      <Route path="/channel" element={<RegistrationForm />} />
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />
      <Route
        path="/protected"
        element={
          <>
            <SignedIn>
              <ProtectedPage />
            </SignedIn>
            <SignedOut>
              <Home />
            </SignedOut>
          </>
        }
      />
    </Routes>
    // </ClerkProvider>
  );
}

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
  //   function start() {
  //     gapi.client.init({
  //       apiKey,
  //       client_id,
  //       scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.upload'
  //     }).then(() => {
  //       // Access token retrieval should be done here
  //       const accessToken = gapi.auth.getToken().access_token;
  //       console.log("Access Token:", accessToken);
  //     });
  //   }

  //   gapi.load('client:auth2', start);
  // }, []);

  // const accessToken = gapi.auth.getToken().access_token;
  // console.log("Access Token:", accessToken);

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.client.init({
        apiKey,
        client_id,
        scope:
          "https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.upload",
      });
      // .then(() => {
      //   // Access token retrieval should be done here
      //   const accessToken = gapi.auth.getToken().access_token;
      //   console.log("Access Token:", accessToken);
      // });
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
            <div className="w-1/9 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
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
                : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
            }
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
              <Navbar />
            </div>
            <div>
              {themeSettings && <ThemeSettings />}
              <ClerkProviderWithRoutes />
            </div>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

// const App = () => {
//   const {
//     setCurrentColor,
//     setCurrentMode,
//     currentMode,
//     activeMenu,
//     currentColor,
//     themeSettings,
//     setThemeSettings,
//   } = useStateContext();

//   useEffect(() => {
//     const currentThemeColor = localStorage.getItem("colorMode");
//     const currentThemeMode = localStorage.getItem("themeMode");
//     if (currentThemeColor && currentThemeMode) {
//       setCurrentColor(currentThemeColor);
//       setCurrentMode(currentThemeMode);
//     }
//   }, []);

//   return (
//     <div className={currentMode === "Dark" ? "dark" : ""}>
//       <BrowserRouter>
//         <div className="flex relative dark:bg-main-dark-bg">
//           <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
//             <TooltipComponent content="Settings" position="Top">
//               <button
//                 type="button"
//                 onClick={() => setThemeSettings(true)}
//                 style={{ background: currentColor, borderRadius: "50%" }}
//                 className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
//               >
//                 <FiSettings />
//               </button>
//             </TooltipComponent>
//           </div>
//           {activeMenu ? (
//             <div className="w-1/9 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
//               <Sidebar />
//             </div>
//           ) : (
//             <div className="w-0 dark:bg-secondary-dark-bg">
//               <Sidebar />
//             </div>
//           )}
//           <div
//             className={
//               activeMenu
//                 ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
//                 : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
//             }
//           >
//             <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
//               <Navbar />
//             </div>
//             <div>
//               {themeSettings && <ThemeSettings />}

//               <Routes>
//                 {/* dashboard  */}
//                 <Route path="/" element={<Sort />} />
//                 <Route path="/ecommerce" element={<Ecommerce />} />

//                 {/* pages  */}
//                 <Route path="/register" element={<RegistrationForm />} />
//                 <Route path="/orders" element={<Orders />} />
//                 <Route path="/employees" element={<Employees />} />
//                 <Route path="/customers" element={<Customers />} />
//                 <Route path="/ideation" element={<Ideation />} />
//                 <Route path="/optimization" element={<Optimization />} />
//                 <Route path="/reporting" element={<Reporting />} />
//                 <Route path="/savedideas" element={<SavedIdeas />} />

//                 {/* apps  */}
//                 <Route path="/kanban" element={<Kanban />} />
//                 <Route path="/editor" element={<Editor />} />
//                 <Route path="/calendar" element={<Calendar />} />
//                 <Route path="/color-picker" element={<ColorPicker />} />

//                 {/* charts  */}
//                 <Route path="/line" element={<Line />} />
//                 <Route path="/area" element={<Area />} />
//                 <Route path="/bar" element={<Bar />} />
//                 <Route path="/pie" element={<Pie />} />
//                 <Route path="/financial" element={<Financial />} />
//                 <Route path="/color-mapping" element={<ColorMapping />} />
//                 <Route path="/pyramid" element={<Pyramid />} />
//                 <Route path="/stacked" element={<Stacked />} />
//               </Routes>
//             </div>
//             <Footer />
//           </div>
//         </div>
//       </BrowserRouter>
//     </div>
//   );
// };

export default App;
