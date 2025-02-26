// src/services/jobService.js
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Firebase configuration (same as in your testFireBase.mjs)
const firebaseConfig = {
  apiKey: "AIzaSyDB-DiDKI66LJfxDT1TCwkjXnaHQmTtVUg",
  authDomain: "jobportal01-2c9ed.firebaseapp.com",
  projectId: "jobportal01-2c9ed",
  storageBucket: "jobportal01-2c9ed.appspot.com",
  messagingSenderId: "27322884453",
  appId: "1:27322884453:web:03b0629155051dd6a1c18c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

class JobService {
  // Create a new job listing for an employee
  async createJobListing(jobData) {
    try {
      // Add created timestamp and set initial status
      const enhancedJobData = {
        ...jobData,
        createdAt: new Date(),
        status: 'active',
      };

      // Add to 'jobListings' collection
      const docRef = await addDoc(collection(db, 'jobListings'), enhancedJobData);
      
      console.log('Job listing created with ID:', docRef.id);
      return {
        success: true,
        jobId: docRef.id,
        jobData: enhancedJobData
      };
    } catch (error) {
      console.error('Error creating job listing:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create a user profile with all the information gathered during onboarding
  async createUserProfile(userData) {
    try {
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        // Create an anonymous user profile if not signed in
        const profileRef = await addDoc(collection(db, 'userProfiles'), {
          ...userData,
          createdAt: new Date(),
          isAnonymous: true
        });
        
        return {
          success: true,
          profileId: profileRef.id
        };
      } else {
        // Use the authenticated user's ID as the document ID
        const profileRef = await addDoc(collection(db, 'userProfiles'), {
          ...userData,
          userId,
          createdAt: new Date(),
          isAnonymous: false
        });
        
        return {
          success: true,
          profileId: profileRef.id
        };
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get all job listings
  async getJobListings() {
    try {
      const querySnapshot = await getDocs(collection(db, 'jobListings'));
      const jobs = [];
      
      querySnapshot.forEach((doc) => {
        jobs.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return {
        success: true,
        jobs
      };
    } catch (error) {
      console.error('Error getting job listings:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get job listings by specific criteria (e.g., job type, location)
  async getJobListingsByFilter(filterField, filterValue) {
    try {
      const q = query(
        collection(db, 'jobListings'), 
        where(filterField, '==', filterValue)
      );
      
      const querySnapshot = await getDocs(q);
      const jobs = [];
      
      querySnapshot.forEach((doc) => {
        jobs.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return {
        success: true,
        jobs
      };
    } catch (error) {
      console.error('Error filtering job listings:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new JobService();