import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";

// * Firebase configuration
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
initializeApp(firebaseConfig);

function AuthenticationApp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = getAuth();
  const db = getFirestore();

  // * User Login
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Log In Successful!");
        window.location.href = 'homepage.html'; // Redirect to homepage
      })
      .catch((error) => {
        console.log("Login Failed: " + error.message);
      });
  };

  // * User Sign-Up
  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          email,
        };
        console.log("Sign Up Was Successful!");

        // Saving user data to Firestore
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
          .then(() => window.location.href = 'index.html') // Redirect to index page after signup
          .catch((error) => console.error("Error writing document: ", error));
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          console.log("Email Address Already Exists!");
        } else {
          console.log("Unable to Create User: " + errorCode);
        }
      });
  };

  return (
    <>
      <form>
        <div className="form-group">
          <input
            type="email" className="form-control"
            id="email-input"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            id="password-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
        </div>
        <button type="button" className="btn btn-primary" onClick={handleLogin}>Sign In</button>
        <button type="button" className="btn btn-secondary" onClick={handleSignup}>Sign Up</button>
      </form>
    </>
  );
}

export default AuthenticationApp;
