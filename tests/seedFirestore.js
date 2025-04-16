// seedFirestore.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDB-DiDKI66LJfxDT1TCwkjXnaHQmTtVUg",
  authDomain: "jobportal01-2c9ed.firebaseapp.com",
  projectId: "jobportal01-2c9ed",
  storageBucket: "jobportal01-2c9ed.appspot.com",
  messagingSenderId: "27322884453",
  appId: "1:27322884453:web:03b0629155051dd6a1c18c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample job listings data
const jobListings = [
  {
    title: "Dance Class",
    requirements: "good dance performance",
    location: "test"
  },
  {
    title: "House Cleaner",
    requirements: "cleaning, cooking, and household work",
    location: "test location"
  },
  {
    title: "Dance Instructor",
    requirements: "dance, choreography, and performance skills",
    location: "test"
  },
  {
    title: "Office Assistant",
    requirements: "organizational skills, typing, and scheduling",
    location: "downtown"
  }
];

// Sample user profiles data
const userProfiles = [
  {
    userId: "user1",
    jobDescription: "I have experience in dancing and teaching dance",
    jobPreference: "Dance Instructor or choreographer",
    location: "test"
  },
  {
    userId: "user2",
    jobDescription: "I have experience in cleaning and cooking",
    jobPreference: "Housekeeping",
    location: "test location"
  },
  {
    userId: "user3",
    jobDescription: "I am very organized and have experience managing office tasks",
    jobPreference: "Office Assistant",
    location: "downtown"
  },
  {
    userId: "user4",
    jobDescription: "I love dance and always practice performance routines",
    jobPreference: "Dancer",
    location: "unknown"
  }
];

async function seedData() {
  try {
    // Seed the jobListings collection
    console.log("Seeding job listings...");
    for (const job of jobListings) {
      await addDoc(collection(db, "jobListings"), job);
      console.log(`Added job: ${job.title}`);
    }
    
    // Seed the userProfiles collection
    console.log("Seeding user profiles...");
    for (const profile of userProfiles) {
      await addDoc(collection(db, "userProfiles"), profile);
      console.log(`Added profile for user: ${profile.userId}`);
    }
    
    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
