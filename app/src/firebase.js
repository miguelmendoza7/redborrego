import firebase from "firebase/compat/app";
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage"

const firebaseconfig = firebase.initializeApp( {
    apiKey: "AIzaSyAqUdE59uXaVYvqyhXB6LKn-IgUETtSiFA",
    authDomain: "redborrego.firebaseapp.com",
    projectId: "redborrego",
    storageBucket: "redborrego.appspot.com",
    messagingSenderId: "55734955372",
    appId: "1:55734955372:web:fab77b7dc892a26a02d749"
});


export default firebaseconfig;


