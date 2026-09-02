import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSkcWN1wgYa5LQVjqFF0bb3AlaJVk0R0w",
  authDomain: "alezoo-portfolio.firebaseapp.com",
  projectId: "alezoo-portfolio",
  storageBucket: "alezoo-portfolio.firebasestorage.app",
  messagingSenderId: "835799340671",
  appId: "1:835799340671:web:2c5e0640c73b4856d1d14a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
