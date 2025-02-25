
import { auth } from "./firebaseConfig";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc,
  getDocs,
  query,
  where,
  orderBy
} from "firebase/firestore";

const db = getFirestore();

export const createUserProfile = async (user) => {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, { email: user.email, createdAt: new Date() });
};

export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? snapshot.data() : null;
};

export const postJob = async (employerId, jobData) => {
  try {
    const jobRef = await addDoc(collection(db, "jobListings"), {
      ...jobData,
      employerId,
      createdAt: new Date(),
    });

    console.log("✅ Job posted successfully with ID:", jobRef.id);
    return jobRef.id;
  } catch (error) {
    console.error("❌ Error posting job:", error);
    return null;
  }
};

export const applyForJob = async (seekerId, jobId) => {
  try {
    await addDoc(collection(db, "jobsApplied"), {
      seekerId,
      jobId,
      appliedAt: new Date(),
    });

    console.log("✅ Job application recorded.");
  } catch (error) {
    console.error("❌ Error applying for job:", error);
  }
};
// Add this to your database.js file

export const getJobsByEmployer = async (employerId) => {
  try {
    const jobsQuery = query(
      collection(db, "jobListings"),
      where("employerId", "==", employerId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(jobsQuery);
    const jobs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`✅ Found ${jobs.length} jobs for employer ${employerId}`);
    return jobs;
  } catch (error) {
    console.error("❌ Error fetching employer jobs:", error);
    return [];
  }
};

export { db };