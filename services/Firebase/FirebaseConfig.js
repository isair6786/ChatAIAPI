// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA5MkBtOGktEu__DHVRdMI7xZQnJjkbaBY",
    authDomain: "aiassistant-fada1.firebaseapp.com",
    projectId: "aiassistant-fada1",
    storageBucket: "aiassistant-fada1.appspot.com",
    messagingSenderId: "584122301418",
    appId: "1:584122301418:web:ca4db848a0fa7533ed9093",
    measurementId: "G-HMFGGMZ12H"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(AsyncStorage),
});