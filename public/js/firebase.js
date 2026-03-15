import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcvs9DevO3ezuIdlzkO_pZo1LiehaCLls",
  authDomain: "promptbox-ai-6833b.firebaseapp.com",
  projectId: "promptbox-ai-6833b",
  storageBucket: "promptbox-ai-6833b.firebasestorage.app",
  messagingSenderId: "745942779497",
  appId: "1:745942779497:web:569e8a2edfaa76273904f8",
  measurementId: "G-ZTPPD527HD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };