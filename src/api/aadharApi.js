// src/api/aadhaarApi.js
import { getFunctions, httpsCallable } from "firebase/functions";

export const verifyAadhaar = async (aadhaarNumber) => {
  try {
    const functions = getFunctions();
    const verifyAadhaarFunc = httpsCallable(functions, 'verifyAadhaar');
    const result = await verifyAadhaarFunc({ aadhaarNumber });
    return result.data;
  } catch (error) {
    console.error('Aadhaar verification error:', error);
    throw error;
  }
};