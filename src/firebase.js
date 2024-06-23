// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore , collection, doc, getDoc, getDocs} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA3VULQJnsMGsQpDSAoxxiQK2K0_ecLBtE",
    authDomain: "idonatelife-clean-archit-dcc7e.firebaseapp.com",
    projectId: "idonatelife-clean-archit-dcc7e",
    storageBucket: "idonatelife-clean-archit-dcc7e.appspot.com",
    messagingSenderId: "448059775465",
    appId: "1:448059775465:web:83eb7692ead6eec6c19378"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore , collection , doc , getDoc, getDocs};