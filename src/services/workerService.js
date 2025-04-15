// src/services/workerService.js
import { getFirestore, collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from './firebaseConfig';

class WorkerService {
  // Get all worker profiles
  async getWorkerProfiles() {
    try {
      const querySnapshot = await getDocs(collection(db, 'userProfiles'));
      const workers = [];
      
      querySnapshot.forEach((doc) => {
        workers.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return {
        success: true,
        workers
      };
    } catch (error) {
      console.error('Error getting worker profiles:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get worker profiles by specific criteria (e.g., skills, location)
  async getWorkerProfilesByFilter(filterField, filterValue) {
    try {
      const q = query(
        collection(db, 'userProfiles'),
        where(filterField, '==', filterValue)
      );
      
      const querySnapshot = await getDocs(q);
      const workers = [];
      
      querySnapshot.forEach((doc) => {
        workers.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return {
        success: true,
        workers
      };
    } catch (error) {
      console.error('Error filtering worker profiles:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get a single worker profile by ID
  async getWorkerProfileById(workerId) {
    try {
      const workerDoc = await getDoc(doc(db, 'userProfiles', workerId));
      
      if (workerDoc.exists()) {
        return {
          success: true,
          worker: {
            id: workerDoc.id,
            ...workerDoc.data()
          }
        };
      } else {
        return {
          success: false,
          error: 'Worker profile not found'
        };
      }
    } catch (error) {
      console.error('Error getting worker profile:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new WorkerService();