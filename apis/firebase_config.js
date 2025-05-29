// firebase.js
import firebase from "@react-native-firebase/app";
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyASUpHuNzMCq5fnNpkS4EATmzCwH4EdJcs",
  authDomain: "",
  projectId: "ophop-48c23",
  storageBucket: "ophop-48c23.appspot.com",
  messagingSenderId: "",
  appId: "1:264477529800:android:9a9f5247f7128f070877fd",
  measurementId: "",
  databaseURL: "https://ophop-48c23-default-rtdb.firebaseio.com",
};

// if (!firebase.apps.length) {
const app = firebase.initializeApp(firebaseConfig);
// console.warn(app);
// }

export { firebase, firebaseConfig, auth, app };
