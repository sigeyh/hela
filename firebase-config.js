// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyACmo5asSSo-hVfVaxNOHhQ25cqByYYPeU",
    authDomain: "hela-pesa-641b4.firebaseapp.com",
    databaseURL: "https://hela-pesa-641b4-default-rtdb.firebaseio.com",
    projectId: "hela-pesa-641b4",
    storageBucket: "hela-pesa-641b4.firebasestorage.app",
    messagingSenderId: "67716565239",
    appId: "1:67716565239:web:f618983c2f9b54c07dabf2",
    measurementId: "G-MV4BSF654K"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Firebase utility functions
export const firebaseUtils = {
    // Save user data to Firestore
    async saveUserData(userId, data) {
        try {
            await setDoc(doc(db, "users", userId), data, { merge: true });
            console.log("User data saved successfully");
        } catch (error) {
            console.error("Error saving user data:", error);
            throw error;
        }
    },

    // Get user data from Firestore
    async getUserData(userId) {
        try {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                console.log("No user data found");
                return null;
            }
        } catch (error) {
            console.error("Error getting user data:", error);
            throw error;
        }
    },

    // Save loan application to Firestore
    async saveLoanApplication(userId, loanData) {
        try {
            const loanRef = await addDoc(collection(db, "loan_applications"), {
                ...loanData,
                userId,
                createdAt: new Date().toISOString()
            });
            console.log("Loan application saved with ID:", loanRef.id);
            return loanRef.id;
        } catch (error) {
            console.error("Error saving loan application:", error);
            throw error;
        }
    },

    // Create user account
    async createUser(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    // Sign in user
    async signInUser(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Error signing in:", error);
            throw error;
        }
    },

    // Check authentication state
    onAuthStateChange(callback) {
        return onAuthStateChanged(auth, callback);
    },

    // Sign out user
    async signOutUser() {
        try {
            await signOut(auth);
            console.log("User signed out successfully");
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    }
};