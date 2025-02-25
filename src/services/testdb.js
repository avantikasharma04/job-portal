import { db, auth } from "./firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

/**
 * ✅ Test function to post a job
 */
const testPostJob = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("⚠️ No authenticated user. Please log in first.");
      return;
    }

    const jobRef = await addDoc(collection(db, "jobListings"), {
      title: "House Cleaner Needed",
      location: "Mumbai",
      salary: "₹15,000/month",
      employerId: user.uid,
      createdAt: new Date(),
    });

    console.log("✅ Job posted successfully:", jobRef.id);
  } catch (error) {
    console.error("❌ Error posting job:", error);
  }
};

/**
 * ✅ Test function to fetch all job listings
 */
const testFetchJobs = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "jobListings"));
    console.log("📌 Job Listings in Firestore:");
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
  }
};

/**
 * ✅ Test function to fetch jobs posted by a specific employer
 */
const testFetchEmployerJobs = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("⚠️ No authenticated user. Please log in first.");
      return;
    }

    const jobsQuery = query(collection(db, "jobListings"), where("employerId", "==", user.uid));
    const querySnapshot = await getDocs(jobsQuery);
    
    console.log(`📌 Jobs posted by ${user.uid}:`);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error("❌ Error fetching employer jobs:", error);
  }
};

// ✅ Run Tests
testPostJob(); // Posts a test job
testFetchJobs(); // Fetches all jobs
testFetchEmployerJobs(); // Fetches jobs posted by the logged-in employer
