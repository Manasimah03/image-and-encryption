import CryptoJS from 'crypto-js';
import { set, get } from 'idb-keyval';

// Convert File to Base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Generate random AES key
export const generateKey = (length = 16) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_!@#';
  let key = '';
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};

// Encrypt payload and save to IndexedDB (mock cloud storage)
export const encryptAndStore = async (base64Image, secretKey) => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(base64Image, secretKey).toString();
    const shareId = 'shr_' + Math.random().toString(36).substring(2, 10);
    
    if (!ciphertext) throw new Error("Encryption failed");

    // Store in IndexedDB
    await set(shareId, ciphertext);
    
    return shareId;
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
};

// Retrieve from IndexedDB and decrypt
export const retrieveAndDecrypt = async (shareId, secretKey) => {
  try {
    const ciphertext = await get(shareId);
    if (!ciphertext) {
      throw new Error("Payload not found or expired.");
    }

    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    if (!originalText || !originalText.startsWith('data:image')) {
      throw new Error("Invalid decryption key or corrupt data.");
    }

    return originalText; 
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
};
