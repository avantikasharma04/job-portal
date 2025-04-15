// testJobMatching.js

/**
 * Calculates a match score between a job and a candidate profile.
 * The scoring is broken down as follows:
 * - Location Matching (Weight up to 0.4):
 *    - Exact match: +0.4
 *    - Substring/partial match: +0.2
 * - Text Matching (Weight up to 0.6):
 *    - We split the job's requirements into words.
 *    - For each word found in the candidate's combined jobDescription and jobPreference,
 *      we count an overlap.
 *    - The fraction of words overlapped multiplied by 0.6 gives the text match score.
 *
 * @param {Object} job - An object representing a job listing.
 * @param {Object} profile - An object representing a candidate's profile.
 * @returns {Number} A match score between 0 and 1.
 */
function getMatchScore(job, profile) {
    let score = 0;
  
    // ----- Location Matching (Weight: up to 0.4) -----
    const jobLoc = job.location.toLowerCase();
    const profileLoc = profile.location.toLowerCase();
    if (jobLoc === profileLoc) {
      score += 0.4;
    } else if (jobLoc && profileLoc && (profileLoc.includes(jobLoc) || jobLoc.includes(profileLoc))) {
      score += 0.2;
    }
  
    // ----- Text Matching for Requirements (Weight: up to 0.6) -----
    const reqText = job.requirements.toLowerCase();
    const reqWords = reqText.split(/\s+/).filter(word => word); // Split into words
    const candidateText = ((profile.jobDescription || "") + " " + (profile.jobPreference || "")).toLowerCase();
  
    let overlapCount = 0;
    reqWords.forEach((word) => {
      if (candidateText.includes(word)) {
        overlapCount++;
      }
    });
    
    // Fraction of requirement words present in the candidate text
    const textScore = reqWords.length ? (overlapCount / reqWords.length) : 0;
    score += textScore * 0.6;
  
    return score;
  }
  
  // ----- Sample Data for Testing -----
  
  // Sample Job Listings Array
  const sampleJobs = [
    {
      id: "job1",
      title: "Dance Class",
      requirements: "good dance performance",
      location: "test", // for example, could be "Mumbai" in a real app
      // Additional fields can be added if needed
    },
    {
      id: "job2",
      title: "House Cleaner",
      requirements: "cleaning, cooking, and household work",
      location: "test location",
    },
    {
      id: "job3",
      title: "Dance Instructor",
      requirements: "dance, choreography, and performance skills",
      location: "test",
    },
    {
      id: "job4",
      title: "Office Assistant",
      requirements: "organizational skills, typing, and scheduling",
      location: "downtown",
    }
  ];
  
  // Sample Candidate Profiles Array
  const sampleProfiles = [
    {
      userId: "user1",
      name: "Alice",
      jobDescription: "I have experience in dancing and teaching dance",
      jobPreference: "Dance Instructor or choreographer",
      location: "test", // exact match with "test"
    },
    {
      userId: "user2",
      name: "Bob",
      jobDescription: "I have experience in cleaning and cooking",
      jobPreference: "Housekeeping",
      location: "test location", // exact match with job2 location
    },
    {
      userId: "user3",
      name: "Carol",
      jobDescription: "I am very organized and have experience managing office tasks",
      jobPreference: "Office Assistant",
      location: "downtown",
    },
    {
      userId: "user4",
      name: "Dave",
      jobDescription: "I love dance and always practice performance routines",
      jobPreference: "Dancer",
      location: "unknown", // no match with any job location here
    }
  ];
  
  // ----- Testing the Matching Function -----
  
  function testMatching() {
    sampleProfiles.forEach((profile) => {
      console.log(`\nCandidate: ${profile.name} (Location: ${profile.location})`);
      const jobMatches = sampleJobs.map((job) => {
        const score = getMatchScore(job, profile);
        return { jobTitle: job.title, matchScore: score, jobLocation: job.location, requirements: job.requirements };
      });
  
      // Sort jobs by match score descending
      jobMatches.sort((a, b) => b.matchScore - a.matchScore);
  
      // Log detailed output for each job for the candidate
      jobMatches.forEach((match, index) => {
        console.log(
          `${index + 1}. ${match.jobTitle} (Location: ${match.jobLocation})` +
          ` - Requirements: "${match.requirements}"` +
          `\n   => Match Score: ${(match.matchScore * 100).toFixed(2)}%`
        );
      });
    });
  }
  
  // Run the test
  testMatching();
  