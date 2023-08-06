import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPKYamYMRSUaxNf4nHnBMubv9B5yEYMqY",
  authDomain: "nwitter-reloaded-1cf47.firebaseapp.com",
  projectId: "nwitter-reloaded-1cf47",
  storageBucket: "nwitter-reloaded-1cf47.appspot.com",
  messagingSenderId: "1088509817891",
  appId: "1:1088509817891:web:fb2a833e0faee0883c2d96",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
