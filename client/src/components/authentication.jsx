import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { Typography } from '@mui/material';

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
    <div>
      <form className="auth">
      <Typography variant="h5" component="h3" gutterBottom>
        Welcome to Smell the Roses
      </Typography>
        <div className="form-group">

          <TextField
            hiddenLabel
            id="email-input"
            variant="outlined"
            size="small"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '15px', // Circular edges
              },
            }}
          />
          </div>
        <div className="form-group">
          <TextField
            hiddenLabel
            id="password-input"
            variant="outlined"
            size="small"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '15px', // Circular edges
              },
            }}
          />
          <a href="#" className="forgot-password">Forgot password?</a>
        </div>  
        <Button variant="contained" onClick={handleLogin}>Sign In</Button>
        <Button variant="contained" onClick={handleSignup}>Sign Up</Button>
      </form>
    </div>
  );
}

export default AuthenticationApp;
