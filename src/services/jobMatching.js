// src/services/jobMatching.js

import { db } from "./firebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

/**
 * Calculates a match score between a job and a candidate profile.
 * @param {Object} job - A job document from "jobListings".
 * @param {Object} profile - A user profile from "userProfiles".
 * @returns {Number} A match score (0 to 1).
 */
function getMatchScore(job, profile) {
  let score = 0;

  // Location Matching (Weight: up to 0.4)
  const jobLoc = job.location.toLowerCase();
  const profileLoc = profile.location.toLowerCase();
  if (jobLoc === profileLoc) {
    score += 0.4;
  } else if (jobLoc && profileLoc && (profileLoc.includes(jobLoc) || jobLoc.includes(profileLoc))) {
    score += 0.2;
  }

  // Text Matching (Weight: up to 0.6)
  const reqText = job.requirements.toLowerCase();
  const reqWords = reqText.split(/\s+/).filter(word => word); // split into words

  const candidateText = ((profile.jobDescription || "") + " " + (profile.jobPreference || "")).toLowerCase();

  let overlapCount = 0;
  reqWords.forEach((word) => {
    if (candidateText.includes(word)) {
      overlapCount++;
    }
  });

  const textScore = reqWords.length ? overlapCount / reqWords.length : 0;
  score += textScore * 0.6;

  return score;
}

/**
 * Gets recommended jobs for a given user by calculating match scores.
 * @param {string} userId - The user ID from "userProfiles".
 * @returns {Array} List of job listings with matchScore, sorted in descending order.
 */
export const getRecommendedJobsForUser = async (userId) => {
  try {
    // 1. Fetch the user profile
    const userProfileRef = doc(db, "userProfiles", userId);
    const userSnapshot = await getDoc(userProfileRef);
    
    if (!userSnapshot.exists()) {
      console.log("User profile not found for userId:", userId);
      return [];
    }
    const userProfile = userSnapshot.data();

    // 2. Fetch all job listings
    const jobListingsRef = collection(db, "jobListings");
    const jobSnapshot = await getDocs(jobListingsRef);

    const recommendedJobs = [];
    jobSnapshot.forEach((jobDoc) => {
      const jobData = jobDoc.data();
      const matchScore = getMatchScore(jobData, userProfile);
      recommendedJobs.push({
        id: jobDoc.id,
        ...jobData,
        matchScore,
      });
    });

    // 3. Sort jobs by match score (highest first)
    recommendedJobs.sort((a, b) => b.matchScore - a.matchScore);

    return recommendedJobs;
  } catch (error) {
    console.error("Error in getRecommendedJobsForUser:", error);
    return [];
  }
};
