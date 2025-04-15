// src/services/authService.js
import firebase from './firebaseConfig';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const auth = firebase.auth();
const db = firebase.firestore();

const authService = {
  // Sign up with email and password
  signUpWithEmailPassword: async (email, password, userData) => {
    try {
      // Create user with email and password
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: email,
        name: userData.name,
        phone: userData.phone,
        userType: userData.userType,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      
      return { success: true, user };
    } catch (error) {
      console.error('Error in signUpWithEmailPassword:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to create account'
      };
    }
  },

  // Sign in with email and password
  signInWithEmailPassword: async (email, password) => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Error in signInWithEmailPassword:', error);
      return { 
        success: false, 
        error: error.message || 'Invalid email or password'
      };
    }
  },

  // Send OTP for phone verification (Web)
  sendOTPWeb: async (phoneNumber, recaptchaVerifier) => {
    try {
      const formattedPhone = `+91${phoneNumber}`; // Assuming India country code
      
      const confirmationResult = await auth.signInWithPhoneNumber(
        formattedPhone, 
        recaptchaVerifier
      );
      
      return { 
        success: true, 
        confirmationResult 
      };
    } catch (error) {
      console.error('Error in sendOTPWeb:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send verification code'
      };
    }
  },

  // Verify OTP
  verifyOTP: async (confirmationResult, otp) => {
    try {
      const result = await confirmationResult.confirm(otp);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Error in verifyOTP:', error);
      return { 
        success: false, 
        error: error.message || 'Invalid verification code'
      };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await auth.signOut();
      return { success: true };
    } catch (error) {
      console.error('Error in signOut:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to sign out'
      };
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!auth.currentUser;
  },

  // Get user profile data
  getUserProfile: async (userId) => {
    try {
      const docRef = db.collection('users').doc(userId || auth.currentUser?.uid);
      const doc = await docRef.get();
      
      if (doc.exists) {
        return { success: true, data: doc.data() };
      } else {
        return { success: false, error: 'User profile not found' };
      }
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to get user profile'
      };
    }
  },

  // Update user profile
  updateUserProfile: async (userData) => {
    try {
      if (!auth.currentUser) {
        throw new Error('No authenticated user');
      }
      
      await db.collection('users').doc(auth.currentUser.uid).update({
        ...userData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to update profile'
      };
    }
  },

  // Send password reset email
  sendPasswordResetEmail: async (email) => {
    try {
      await auth.sendPasswordResetEmail(email);
      return { success: true };
    } catch (error) {
      console.error('Error in sendPasswordResetEmail:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send password reset email'
      };
    }
  }
};

export default authService;