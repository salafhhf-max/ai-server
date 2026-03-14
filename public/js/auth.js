// FIREBASE IMPORTS

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
GoogleAuthProvider,
signInWithPopup,
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// FIREBASE CONFIG

const firebaseConfig = {
  apiKey: "AIzaSyAcvs9DevO3ezuIdlzkO_pZo1LiehaCLls",
  authDomain: "promptbox-ai-6833b.firebaseapp.com",
  projectId: "promptbox-ai-6833b",
  storageBucket: "promptbox-ai-6833b.firebasestorage.app",
  messagingSenderId: "745942779497",
  appId: "1:745942779497:web:569e8a2edfaa76273904f8",
  measurementId: "G-ZTPPD527HD"
};


// INITIALIZE FIREBASE

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);


// =============================
// SIGNUP
// =============================

window.signup = async function(){

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

try{

await createUserWithEmailAndPassword(auth,email,password);

alert("Account created successfully");

window.location.href="dashboard.html";

}catch(error){

alert(error.message);

}

};


// =============================
// LOGIN
// =============================

window.login = async function(){

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

try{

await signInWithEmailAndPassword(auth,email,password);

alert("Login successful");

window.location.href="dashboard.html";

}catch(error){

alert(error.message);

}

};


// =============================
// GOOGLE LOGIN
// =============================

window.googleLogin = async function(){

const provider = new GoogleAuthProvider();

try{

await signInWithPopup(auth,provider);

alert("Google login successful");

window.location.href="dashboard.html";

}catch(error){

alert(error.message);

}

};


// =============================
// LOGOUT
// =============================

window.logout = async function(){

try{

await signOut(auth);

window.location.href="login.html";

}catch(error){

alert(error.message);

}

};


// =============================
// PROTECT DASHBOARD
// =============================

onAuthStateChanged(auth,(user)=>{

if(!user){

if(window.location.pathname.includes("dashboard.html")){

window.location.href="login.html";

}

}

});