import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { Typography, Box } from '@mui/material';

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

initializeApp(firebaseConfig);

function AuthenticationApp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const auth = getAuth();
  const db = getFirestore();

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleLogin = () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = '/';
      })
      .catch((error) => {
        setError('Login failed: ' + error.message);
      });
  };

  const handleSignup = () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = { email };

        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
          .then(() => window.location.href = '/')
          .catch((error) => console.error("Error writing document: ", error));
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          setError("Email Address Already Exists!");
        } else {
          setError("Unable to Create User: " + errorCode);
        }
      });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f4f6f8"
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          padding: 3,
          boxShadow: 3,
          width: 300,
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
          Welcome to Smell the Roses 🌹
        </Typography>
        {error && <Typography color="error" variant="body2" align="center">{error}</Typography>}

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ marginTop: 2 }}
        >
          Sign In
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={handleSignup}
          sx={{ marginTop: 1 }}
        >
          Sign Up
        </Button>
        <Button
          variant="text"
          color="primary"
          fullWidth
          sx={{ marginTop: 1 }}
        >
          Forgot Password?
        </Button>
      </Box>
    </Box>
  );
}

export default AuthenticationApp;
