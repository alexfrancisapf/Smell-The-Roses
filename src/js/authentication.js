import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCu1t3ylfLrjGWwPQdbTx4UjDsXMqWsWFE",
    authDomain: "smell-the-roses-f31f3.firebaseapp.com",
    projectId: "smell-the-roses-f31f3",
    storageBucket: "smell-the-roses-f31f3.firebasestorage.app",
    messagingSenderId: "839539812567",
    appId: "1:839539812567:web:8a1ab9e2a5d496478c2892",
    measurementId: "G-WRCNNNTFQ3"
};

// * Initialize Firebase
const app = initializeApp(firebaseConfig);

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");

  const auth = getAuth();
  const db = getFirestore();

  // * User Login
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Log In Successful!");
        window.location.href='homepage.html';
      })
      .catch((error) => {
        console.log("Login Failed: " + errorCode);
      })
  });

  // * User Sign-Up
  signupBtn.addEventListener("click", () => {
    const firstName = document.getElementById("firstname").value;
    const lastName = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value; // Must be at leat 6 characters long

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential)=>{
        const user = userCredential.user;
        const userData = {
          firstName: firstName,
          lastName: lastName,
          email: email
        }
        console.log("Sign Up Was Successful!")

        const docRef=doc(db, "users", user.uid)
        setDoc(docRef, userData)
          .then(()=> window.location.href='index.html') // Redirect to new page
          .catch(()=> console.error("Error writing document"));
      })
      .catch((error)=>{
        const errorCode = error.code;
        if (errorCode == 'auth/email-already-in-use') {
          console.log("Email Address Alrady Exists!");
        }
        else {
          console.log("Unable to Create User: " + errorCode);
        }
      })
  });
});
