// Import the functions you need from the SDKs you need
import { initializeApp,  } from "firebase/app";
import { getAuth, FacebookAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAB1qq5uURcbfMIy-lRntEuugcy1CY1eAo",
  authDomain: "project-manage-45643.firebaseapp.com",
  projectId: "project-manage-45643",
  storageBucket: "project-manage-45643.appspot.com",
  messagingSenderId: "968035461105",
  appId: "1:968035461105:web:32a113603befb43f9e0650"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const db=getFirestore(app);

const provider = new FacebookAuthProvider();

export const database = getFirestore(app)

const imgDB = getStorage(app)
const txtDB = getFirestore(app)
const storage = getStorage(app)

const providers = new GoogleAuthProvider();

const firestore = getFirestore(app);

export {auth,imgDB,txtDB,storage,firestore, provider, providers}