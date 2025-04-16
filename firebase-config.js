// Replace this with your actual config
const firebaseConfig = {
    apiKey: "AIzaSyBt92APsEkg_ObwlGwYFJnr4v2oKWzcIm0",
    authDomain: "minexapp-a0302.firebaseapp.com",
    projectId: "minexapp-a0302",
    storageBucket: "minexapp-a0302.appspot.com",
    messagingSenderId: "700099573194",
    appId: "1:700099573194:web:a95d690d8c8f3647da4b33",
    measurementId: "G-C52K5WNC05"
  };
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  