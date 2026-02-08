// 🔥 Firebase CDN imports (works for normal HTML sites)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ============================
// 🔥 YOUR CONFIG (already correct)
// ============================

const firebaseConfig = {
  apiKey: "AIzaSyDODZTg4XKIhkG4hxyFQISq_8qWMd7UvtU",
  authDomain: "gearsouls-5da31.firebaseapp.com",
  projectId: "gearsouls-5da31",
  storageBucket: "gearsouls-5da31.firebasestorage.app",
  messagingSenderId: "668054432272",
  appId: "1:668054432272:web:273393583b19feec4cb895",
  measurementId: "G-JCH0MVKVXH"
};


// ============================
// Init
// ============================

const app = initializeApp(firebaseConfig);
getAnalytics(app);

const auth = getAuth(app);


// ============================
// AUTH FUNCTIONS
// ============================


// 🟢 SIGN UP
window.signup = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account created 🚀");
  } catch (err) {
    alert(err.message);
  }
};


// 🔵 LOGIN
window.login = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Logged in ✅");
  } catch (err) {
    alert(err.message);
  }
};


// 🔴 LOGOUT
window.logout = async () => {
  await signOut(auth);
  alert("Logged out 👋");
};


// 🟡 RESET PASSWORD
window.resetPassword = async () => {
  const email = document.getElementById("email").value;

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Reset email sent 📩");
  } catch (err) {
    alert(err.message);
  }
};


// 🟣 CHANGE PASSWORD (while logged in)
window.changePassword = async () => {
  const newPass = prompt("Enter new password");

  try {
    await updatePassword(auth.currentUser, newPass);
    alert("Password updated 🔐");
  } catch (err) {
    alert(err.message);
  }
};


// ============================
// AUTO USER STATUS
// ============================

onAuthStateChanged(auth, (user) => {
  const status = document.getElementById("userStatus");

  if (user) {
    status.innerText = "Welcome " + user.email;
  } else {
    status.innerText = "Not logged in";
  }
});
