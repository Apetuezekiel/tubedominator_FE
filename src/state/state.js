/* eslint-disable */

import { create } from "zustand";
import { getSavedIdeas } from "../data/api/calls";

export const useKeywordStore = create((set) => ({
  exactKeywordData: [],
  relatedKeywordData: [],

  setExactKeywordData: (data) => set({ exactKeywordData: data }),
  setRelatedKeywordData: (data) => set({ relatedKeywordData: data }),
}));

export const useUserYoutubeInfo = create((set) => ({
  userYoutubeData: [],
  setUserYoutubeData: (data) => set({ userYoutubeData: data }),
}));

export const useKeywordVideosInfo = create((set) => ({
  keywordVideosInfo: [],
  setKeywordVideosInfo: (data) => set({ keywordVideosInfo: data }),
}));

export const useUserChannelKeywords = create((set) => ({
  userChannelKeywords: [],
  setUserChannelKeywords: (data) => set({ userChannelKeywords: data }),
}));

export const useUserSavedSearchTerm = create((set) => ({
  userSavedSearchTerm: null,
  setUserSavedSearchTerm: (data) => set({ userSavedSearchTerm: data }),
}));

export const useShowSearchTermPanel = create((set) => ({
  showSearchTermPanel: false,
  setShowSearchTermPanel: (data) => set({ showSearchTermPanel: data }),
}));

export const useUserAuthToken = create((set) => ({
  userAuthToken: "",
  setUserAuthToken: (data) => set({ userAuthToken: data }),
}));

export const useUserData = create((set) => ({
  userData: null,
  setUserData: (data) => set({ userData: data }),
}));

export const useAllUserDeets = create((set) => ({
  allUserDeets: {},
  setAllUserDeets: (data) => set({ allUserDeets: data }),
}));

export const useDisplayPreviewKeyword = create((set) => ({
  displayPreviewKeyword: false,
  setDisplayPreviewKeyword: (data) => set({ displayPreviewKeyword: data }),
}));

export const useUserLoggedin = create((set) => ({
  userLoggedIn: localStorage.getItem("userLoggedin") || null,
  setUserLoggedIn: (data) => set({ userLoggedIn: data }),
}));

export const useUserAccessLevel = create((set) => ({
  accessLevel: localStorage.getItem("accessLevel") || "",
  setAccessLevel: (data) => set({ accessLevel: data }),
}));

export const useUserGoogleCreds = create((set) => ({
  isGoogleCreds: null,
  setIsGoogleCreds: (data) => set({ isGoogleCreds: data }),
}));

export const useUserChannelConnected = create((set) => ({
  userChannelConnected: localStorage.getItem("channelConnected"),
  setUserChannelConnected: (data) => set({ userChannelConnected: data }),
}));

export const useUserProfilePic = create((set) => ({
  userProfilePic: localStorage.getItem("userProfilePic"),
  setUserProfilePic: (data) => set({ userProfilePic: data }),
}));

export const useUserPackage = create((set) => ({
  userPackage: localStorage.getItem("userPackage"),
  setUserPackage: (data) => set({ userPackage: data }),
}));

export const useInitializeOAuth = create((set) => ({
  initializeOAuth: false,
  setInitializeOAuth: (data) => set({ initializeOAuth: data }),
}));

export const useUserConnectionEntry = create((set) => ({
  userConnectionEntry: "",
  setUserConnectionEntry: (data) => set({ userConnectionEntry: data }),
}));

export const useSerpYoutubeVideosInfo = create((set) => ({
  serpYoutubeVideosInfo: {
    keyword: "",
    data: {},
  },
  setSerpYoutubeVideosInfo: (data) => set({ serpYoutubeVideosInfo: data }),
}));

export const useSavedIdeasData = create((set) => ({
  savedIdeasData: [],
  setSavedIdeasData: (data) => set({ savedIdeasData: data }),
}));

// export const useSavedIdeasData = create((set) => ({
//   savedIdeasData: [],
//   isLoading: false,
//   error: null,

//   fetchSavedIdeasData: async () => {
//     try {
//       set({ isLoading: true, error: null });
//       const data = await getSavedIdeas();
//       set({ savedIdeasData: data, isLoading: false });
//     } catch (error) {
//       set({ error, isLoading: false });
//     }
//   },

//   setSavedIdeasData: (data) => set({ savedIdeasData: data }),
// }));
