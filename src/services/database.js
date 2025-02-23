import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { auth } from "./firebaseConfig";

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
